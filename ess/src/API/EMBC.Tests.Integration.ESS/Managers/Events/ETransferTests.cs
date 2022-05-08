using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Shared.Contracts.Events;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Managers.Events
{
    public class ETransferTests : DynamicsWebAppTestBase
    {
        private readonly EventsManager manager;

        public ETransferTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            manager = Services.GetRequiredService<EventsManager>();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
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
                new ClothingSupport { }
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
            firstFileSupports.ShouldAllBe(s => s.Status == SupportStatus.PendingApproval && !s.Flags.Any());

            var secondFileSupports = new Support[]
            {
                    new ClothingSupport { }
            };

            var now2 = DateTime.UtcNow;
            foreach (var support in secondFileSupports)
            {
                support.FileId = TestData.EvacuationFileId;
                support.From = now1;
                support.To = now1.AddMinutes(1);
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

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task ProcessApprovedSupportsCommand_ApprovedSupports_PaymentsAdded()
        {
            var fileId = TestData.EvacuationFileId;
            var approvedSupports = (await manager.Handle(new SearchSupportsQuery { FileId = fileId })).Items.Where(S => S.Status == SupportStatus.Approved).ToArray();
            approvedSupports.ShouldNotBeEmpty();
            await manager.Handle(new ProcessApprovedSupportsCommand());
        }
    }
}
