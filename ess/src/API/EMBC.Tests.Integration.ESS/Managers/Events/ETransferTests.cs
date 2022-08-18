using System;
using System.Collections.Generic;
using System.Linq;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Utilities.Cas;
using EMBC.ESS.Utilities.Dynamics;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Managers.Events
{
    public class ETransferTests : DynamicsWebAppTestBase
    {
        private readonly EventsManager manager;
        private readonly EMBC.ESS.Resources.Supports.ISupportRepository supportRepository;

        public ETransferTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            manager = Services.GetRequiredService<EventsManager>();
            supportRepository = Services.GetRequiredService<EMBC.ESS.Resources.Supports.ISupportRepository>();
        }

        [Fact]
        public async Task ProcessPendingSupportsCommand_PendingScanSupports_FlagsAdded()
        {
            var registrant = TestHelper.CreateRegistrantProfile(Guid.NewGuid().ToString().Substring(0, 4));
            registrant.Id = await TestHelper.SaveRegistrant(manager, registrant);
            var firstFile = TestHelper.CreateNewTestEvacuationFile(TestData.TestPrefix, registrant);
            var secondFile = TestHelper.CreateNewTestEvacuationFile(TestData.TestPrefix, registrant);

            firstFile.Id = await TestHelper.SaveEvacuationFile(manager, firstFile);
            secondFile.Id = await TestHelper.SaveEvacuationFile(manager, secondFile);

            firstFile = await TestHelper.GetEvacuationFileById(manager, firstFile.Id) ?? null!;
            secondFile = await TestHelper.GetEvacuationFileById(manager, secondFile.Id) ?? null!;

            var firstFileSupports = new Support[]
            {
                new ClothingSupport { TotalAmount = 150 }
            };

            var now1 = DateTime.UtcNow;
            foreach (var support in firstFileSupports)
            {
                support.FileId = TestData.EvacuationFileId;
                support.From = now1;
                support.To = now1.AddMinutes(1);
                support.SupportDelivery = new Interac { ReceivingRegistrantId = registrant.Id };
                support.IncludedHouseholdMembers = firstFile.HouseholdMembers.Select(m => m.Id).ToArray();
            }

            //process first file support
            await manager.Handle(new ProcessSupportsCommand
            {
                FileId = firstFile.Id,
                RequestingUserId = TestData.Tier4TeamMemberId,
                Supports = firstFileSupports
            });

            firstFileSupports = (await manager.Handle(new SearchSupportsQuery { FileId = firstFile.Id })).Items.Where(S => S.SupportDelivery is Interac).ToArray();
            firstFileSupports.ShouldNotBeEmpty();
            firstFileSupports.ShouldAllBe(s => s.Status == SupportStatus.PendingApproval);

            //process pending supports of first file
            await manager.Handle(new ProcessPendingSupportsCommand());

            //first file should not have flags on the supports
            firstFileSupports = (await manager.Handle(new SearchSupportsQuery { FileId = firstFile.Id })).Items.Where(S => S.SupportDelivery is Interac).ToArray();
            firstFileSupports.ShouldNotBeEmpty();
            firstFileSupports.ShouldAllBe(s => (s.Status == SupportStatus.PendingApproval || s.Status == SupportStatus.Approved) && !s.Flags.Any());

            var secondFileSupports = new Support[]
            {
                    new ClothingSupport { }
            };

            var now2 = DateTime.UtcNow;
            foreach (var support in secondFileSupports)
            {
                support.FileId = TestData.EvacuationFileId;
                support.From = now2;
                support.To = now2.AddMinutes(1);
                support.SupportDelivery = new Interac { ReceivingRegistrantId = registrant.Id };
                support.IncludedHouseholdMembers = secondFile.HouseholdMembers.Select(m => m.Id).ToArray();
            }
            //process supports in second file
            await manager.Handle(new ProcessSupportsCommand
            {
                FileId = secondFile.Id,
                RequestingUserId = TestData.Tier4TeamMemberId,
                Supports = secondFileSupports
            });

            //process pending supports of second file
            await manager.Handle(new ProcessPendingSupportsCommand());

            //second file should  have flags on the supports
            secondFileSupports = (await manager.Handle(new SearchSupportsQuery { FileId = secondFile.Id })).Items.Where(S => S.SupportDelivery is Interac).ToArray();
            secondFileSupports.ShouldNotBeEmpty();
            secondFileSupports.ShouldAllBe(s => s.Status == SupportStatus.PendingApproval && s.Flags.SingleOrDefault(f => f is DuplicateSupportFlag) != null);
        }

        [Fact]
        public async Task ProcessApprovedSupportsCommand_ApprovedSupports_PaymentsAdded()
        {
            var approvedSupports = (await manager.Handle(new SearchSupportsQuery { FileId = TestData.EvacuationFileId })).Items
                .Where(s => s.Status == SupportStatus.Approved && ((Interac)s.SupportDelivery).RelatedPaymentId == null)
                .ToArray();

            approvedSupports.ShouldNotBeEmpty();

            var supportsToProcess = approvedSupports.TakeRandom(1).ToArray();

            var supportIdsToApprove = supportsToProcess.Select(s => s.Id).ToArray();
            await QueueApprovedSupports(supportIdsToApprove);

            await manager.Handle(new ProcessApprovedSupportsCommand());

            var fileSupports = (await manager.Handle(new SearchSupportsQuery
            {
                FileId = TestData.EvacuationFileId
            })).Items.Where(s => supportIdsToApprove.Contains(s.Id)).ToArray();

            fileSupports.ShouldNotBeEmpty();

            foreach (var support in fileSupports)
            {
                ((Interac)support.SupportDelivery).RelatedPaymentId.ShouldNotBeNull();
            }
        }

        [Fact]
        public async Task ProcessPendingPaymentsCommand_ApprovedSupports_PaymentsAdded()
        {
            var approvedSupports = (await manager.Handle(new SearchSupportsQuery { FileId = TestData.EvacuationFileId })).Items
                .Where(s => s.Status == SupportStatus.Approved)
                .ToArray();

            approvedSupports.ShouldNotBeEmpty();

            var sut = approvedSupports.TakeRandom(1).Select(s => s.Id);
            await QueueApprovedSupports(sut);

            await manager.Handle(new ProcessApprovedSupportsCommand());
            await manager.Handle(new ProcessPendingPaymentsCommand());

            var updatedSupports = (await manager.Handle(new SearchSupportsQuery { FileId = TestData.EvacuationFileId })).Items
                .Where(s => s.Status == SupportStatus.Approved);

            updatedSupports.Select(s => s.Id).ShouldNotBeOneOf(sut);
        }

        [Fact]
        public async Task FullProcess_NewSupport_Paid()
        {
            var mockedCas = (MockCasProxy)Services.GetRequiredService<IWebProxy>();

            var registrant = TestHelper.CreateRegistrantProfile(Guid.NewGuid().ToString().Substring(0, 4));
            registrant.Id = await TestHelper.SaveRegistrant(manager, registrant);
            var file = TestHelper.CreateNewTestEvacuationFile(TestData.TestPrefix, registrant);
            file.Id = await TestHelper.SaveEvacuationFile(manager, file);
            file = await TestHelper.GetEvacuationFileById(manager, file.Id) ?? null!;

            var fileSupports = new Support[]
            {
                new ClothingSupport { TotalAmount = 150 }
            };

            var now = DateTime.UtcNow;
            foreach (var support in fileSupports)
            {
                support.FileId = file.Id;
                support.From = now;
                support.To = now.AddMinutes(1);
                support.SupportDelivery = new Interac { ReceivingRegistrantId = registrant.Id, NotificationEmail = registrant.Email };
                support.IncludedHouseholdMembers = file.HouseholdMembers.Select(m => m.Id).ToArray();
            }

            await manager.Handle(new ProcessSupportsCommand
            {
                FileId = file.Id,
                RequestingUserId = TestData.Tier4TeamMemberId,
                Supports = fileSupports
            });

            await manager.Handle(new ProcessPendingSupportsCommand());

            var approvedSupports = (await manager.Handle(new SearchSupportsQuery { FileId = file.Id })).Items
                .Where(s => s.Status == SupportStatus.Approved && ((Interac)s.SupportDelivery).RelatedPaymentId == null)
                .ToArray();

            approvedSupports.ShouldNotBeEmpty();

            var supportsToProcess = approvedSupports.TakeRandom(1).ToArray();

            var supportIdsToApprove = supportsToProcess.Select(s => s.Id).ToArray();
            await QueueApprovedSupports(supportIdsToApprove);

            await manager.Handle(new ProcessApprovedSupportsCommand());
            await manager.Handle(new ProcessPendingPaymentsCommand());

            var updatedSupports = (await manager.Handle(new SearchSupportsQuery { FileId = file.Id })).Items
                .Where(s => s.Status == SupportStatus.Approved);

            updatedSupports.Select(s => s.Id).ShouldNotBeOneOf(supportIdsToApprove);

            foreach (var support in updatedSupports)
            {
                mockedCas.GetInvoiceByInvoiceNumber(((Interac)support.SupportDelivery).RelatedPaymentId).ShouldNotBeNull();
            }

            await manager.Handle(new ReconcilePaymentsCommand());

            await manager.Handle(new ProcessPendingPaymentsCommand());

            var issuedSupport = ((EMBC.ESS.Resources.Supports.SearchSupportQueryResult)await supportRepository.Query(new EMBC.ESS.Resources.Supports.SearchSupportsQuery
            {
                ById = supportsToProcess.First().Id,
                ByStatus = EMBC.ESS.Resources.Supports.SupportStatus.Issued,
            })).Items;

            issuedSupport.ShouldHaveSingleItem();

            foreach (var support in updatedSupports)
            {
                mockedCas.SetPaymentDate(((Interac)support.SupportDelivery).RelatedPaymentId, DateTime.UtcNow, CasPaymentStatuses.Reconciled);
            }

            await manager.Handle(new ReconcilePaymentsCommand());

            await manager.Handle(new ProcessPendingPaymentsCommand());

            var paidSupports = ((EMBC.ESS.Resources.Supports.SearchSupportQueryResult)await supportRepository.Query(new EMBC.ESS.Resources.Supports.SearchSupportsQuery
            {
                ById = supportsToProcess.First().Id,
                ByStatus = EMBC.ESS.Resources.Supports.SupportStatus.Paid,
            })).Items;

            paidSupports.ShouldHaveSingleItem();
        }

        private async Task QueueApprovedSupports(IEnumerable<string> supportIds)
        {
            var ctx = Services.GetRequiredService<IEssContextFactory>().Create();

            foreach (var supportId in supportIds)
            {
                var support = await ctx.era_evacueesupports.Where(s => s.era_name == supportId).SingleOrDefaultAsync();
                support.era_queueprocessingstatus = (int)EMBC.ESS.Resources.Payments.QueueStatus.Pending;
                ctx.UpdateObject(support);
            }
            await ctx.SaveChangesAsync();
        }
    }
}
