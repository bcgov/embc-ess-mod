using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Utilities.Dynamics;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Managers.Events
{
    public class SupportTests : DynamicsWebAppTestBase
    {
        private readonly EventsManager manager;

        private async Task<RegistrantProfile> GetRegistrantByUserId(string userId) => (await TestHelper.GetRegistrantByUserId(manager, userId)).ShouldNotBeNull();

        private async Task<IEnumerable<EvacuationFile>> GetEvacuationFileById(string fileId) => await TestHelper.GetEvacuationFileById(manager, fileId);

        private EvacuationFile CreateNewTestEvacuationFile(RegistrantProfile registrant) => TestHelper.CreateNewTestEvacuationFile(registrant);

        public SupportTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            manager = Services.GetRequiredService<EventsManager>();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanProcessSupports()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var file = CreateNewTestEvacuationFile(registrant);

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = TestData.Tier4TeamMemberId };

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });

            var supports = new Support[]
            {
                new ClothingReferral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierAId } },
                new IncidentalsReferral(),
                new FoodGroceriesReferral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierBId } },
                new FoodRestaurantReferral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierCId } },
                new LodgingBilletingReferral() { NumberOfNights = 1 },
                new LodgingGroupReferral() { NumberOfNights = 1, FacilityCommunityCode = TestData.RandomCommunity },
                new LodgingHotelReferral() { NumberOfNights = 1, NumberOfRooms = 1 },
                new TransportationOtherReferral(),
                new TransportationTaxiReferral(),
            };

            foreach (var s in supports)
            {
                s.From = DateTime.UtcNow;
                s.To = DateTime.UtcNow.AddDays(3);
            }

            var printRequestId = await manager.Handle(new ProcessSupportsCommand { FileId = fileId, Supports = supports, RequestingUserId = TestData.Tier4TeamMemberId });

            printRequestId.ShouldNotBeNullOrEmpty();

            var refreshedFile = (await manager.Handle(new EvacuationFilesQuery { FileId = fileId })).Items.ShouldHaveSingleItem();
            refreshedFile.Supports.ShouldNotBeEmpty();
            refreshedFile.Supports.Count().ShouldBe(supports.Length);
            foreach (var support in refreshedFile.Supports.Cast<Referral>())
            {
                var sourceSupport = (Referral)supports.Where(s => s.GetType() == support.GetType()).ShouldHaveSingleItem();
                if (sourceSupport.SupplierDetails != null)
                {
                    support.SupplierDetails.ShouldNotBeNull();
                    support.SupplierDetails.Id.ShouldBe(sourceSupport.SupplierDetails.Id);
                    support.SupplierDetails.Name.ShouldNotBeNull();
                    support.SupplierDetails.Address.ShouldNotBeNull();
                }
                support.CreatedBy.Id.ShouldBe(TestData.Tier4TeamMemberId);
                support.CreatedOn.ShouldNotBeNull().ShouldBeInRange(DateTime.UtcNow.AddSeconds(-30), DateTime.UtcNow);
                support.IssuedOn.ShouldNotBeNull().ShouldBeInRange(DateTime.UtcNow.AddSeconds(-30), DateTime.UtcNow);
                support.IssuedBy.ShouldNotBeNull().Id.ShouldBe(TestData.Tier4TeamMemberId);
            }
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanVoidSupport()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var file = CreateNewTestEvacuationFile(registrant);

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = TestData.Tier4TeamMemberId };

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });

            var supports = new Support[]
            {
                new ClothingReferral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierAId } },
                new IncidentalsReferral(),
                new FoodGroceriesReferral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierBId } },
                new FoodRestaurantReferral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierCId } },
                new LodgingBilletingReferral() { NumberOfNights = 1 },
                new LodgingGroupReferral() { NumberOfNights = 1 },
                new LodgingHotelReferral() { NumberOfNights = 1, NumberOfRooms = 1 },
                new TransportationOtherReferral(),
                new TransportationTaxiReferral(),
            };

            foreach (var s in supports)
            {
                s.From = DateTime.UtcNow;
                s.To = DateTime.UtcNow.AddDays(3);
            }

            await manager.Handle(new ProcessSupportsCommand { FileId = fileId, Supports = supports, RequestingUserId = TestData.Tier4TeamMemberId });

            var fileWithSupports = (await manager.Handle(new EvacuationFilesQuery { FileId = fileId })).Items.ShouldHaveSingleItem();

            var support = fileWithSupports.Supports.First();

            await manager.Handle(new VoidSupportCommand
            {
                FileId = fileId,
                SupportId = support.Id,
                VoidReason = SupportVoidReason.ErrorOnPrintedReferral
            });

            var updatedFile = (await GetEvacuationFileById(fileId)).ShouldHaveSingleItem();
            var updatedSupport = updatedFile.Supports.Where(s => s.Id == support.Id).ShouldHaveSingleItem();

            updatedSupport.Status.ShouldBe(SupportStatus.Void);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanReprintSupport()
        {
            var printRequestId = await manager.Handle(new ReprintSupportCommand
            {
                FileId = TestData.EvacuationFileId,
                ReprintReason = "test",
                RequestingUserId = TestData.Tier4TeamMemberId,
                SupportId = TestData.SupportIds.First()
            });

            printRequestId.ShouldNotBeNullOrEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanQuerySupplierList()
        {
            var taskId = TestData.ActiveTaskId;
            var list = (await manager.Handle(new SuppliersListQuery { TaskId = taskId })).Items;
            list.ShouldNotBeEmpty();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanQueryPrintRequest()
        {
            var dynamicsContext = Services.GetRequiredService<EssContext>();
            var testPrintRequest = dynamicsContext.era_referralprints
                .Where(pr => pr.statecode == (int)EntityState.Active && pr._era_requestinguserid_value != null)
                .OrderByDescending(pr => pr.createdon)
                .Take(new Random().Next(1, 20))
                .ToArray()
                .First();

            var response = await manager.Handle(new PrintRequestQuery
            {
                PrintRequestId = testPrintRequest.era_referralprintid.ToString(),
                RequestingUserId = testPrintRequest._era_requestinguserid_value?.ToString()
            });
            await File.WriteAllBytesAsync("./newTestPrintRequestFile.pdf", response.Content);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task ProcessSupportsCommand_DigitalAndPaperSupports_BusinessValidationException()
        {
            var fileId = TestData.PaperEvacuationFileId;

            var supports = new Referral[]
            {
                new IncidentalsReferral() {ExternalReferenceId = $"{TestData.TestPrefix}-paperreferral"},
                new IncidentalsReferral()
            };

            await Should.ThrowAsync<BusinessValidationException>(async () => await manager.Handle(new ProcessSupportsCommand
            {
                FileId = fileId,
                Supports = supports,
                RequestingUserId = TestData.Tier4TeamMemberId
            }));
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanProcessPaperReferrals()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var paperFile = CreateNewTestEvacuationFile(registrant);

            paperFile.ExternalReferenceId = $"{TestData.TestPrefix}-paperfile";
            paperFile.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            paperFile.NeedsAssessment.CompletedBy = new TeamMember { Id = TestData.Tier4TeamMemberId };

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = paperFile });

            var supports = new Referral[]
            {
                new ClothingReferral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierAId } },
                new IncidentalsReferral(),
                new FoodGroceriesReferral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierBId } },
                new FoodRestaurantReferral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierCId } },
                new LodgingBilletingReferral() { NumberOfNights = 1 },
                new LodgingGroupReferral() { NumberOfNights = 1, FacilityCommunityCode = TestData.RandomCommunity },
                new LodgingHotelReferral() { NumberOfNights = 1, NumberOfRooms = 1 },
                new TransportationOtherReferral(),
                new TransportationTaxiReferral(),
            };

            foreach (var s in supports)
            {
                s.From = DateTime.UtcNow;
                s.To = DateTime.UtcNow.AddDays(3);
                s.IssuedOn = DateTime.Parse("2021/12/31T16:14:32Z");
                s.ExternalReferenceId = $"{TestData.TestPrefix}-paperreferral";
                s.IssuedBy = new TeamMember { DisplayName = "autotest R" };
            }

            var printRequestId = await manager.Handle(new ProcessPaperSupportsCommand { FileId = fileId, Supports = supports, RequestingUserId = TestData.Tier4TeamMemberId });

            printRequestId.ShouldBeNullOrEmpty();

            var refreshedFile = (await manager.Handle(new EvacuationFilesQuery { FileId = fileId })).Items.ShouldHaveSingleItem();
            refreshedFile.Supports.ShouldNotBeEmpty();
            refreshedFile.Supports.Count().ShouldBe(supports.Length);
            foreach (var support in refreshedFile.Supports.Cast<Referral>())
            {
                var sourceSupport = supports.Where(s => s.GetType() == support.GetType()).ShouldHaveSingleItem();
                if (sourceSupport.SupplierDetails != null)
                {
                    support.SupplierDetails.ShouldNotBeNull();
                    support.SupplierDetails.Id.ShouldBe(sourceSupport.SupplierDetails.Id);
                    support.SupplierDetails.Name.ShouldNotBeNull();
                    support.SupplierDetails.Address.ShouldNotBeNull();
                }
                support.ExternalReferenceId.ShouldBe(sourceSupport.ExternalReferenceId);
                support.CreatedBy.Id.ShouldBe(TestData.Tier4TeamMemberId);
                support.CreatedOn.ShouldNotBeNull().ShouldBeInRange(DateTime.UtcNow.AddSeconds(-30), DateTime.UtcNow);
                support.IssuedBy.ShouldNotBeNull().DisplayName.ShouldBe(sourceSupport.IssuedBy.DisplayName);
                support.IssuedOn.ShouldNotBeNull().ShouldBe(sourceSupport.IssuedOn.ShouldNotBeNull());
            }
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task ProcessPaperSupportsCommand_DuplicateReferralIdAndType_BusinessValidationException()
        {
            var fileId = TestData.PaperEvacuationFileId;

            var supports = new Referral[]
            {
                new IncidentalsReferral() { ExternalReferenceId = $"{TestData.TestPrefix}-paperreferral" },
                new IncidentalsReferral() {  ExternalReferenceId = $"{TestData.TestPrefix}-paperreferral" }
            };

            await Should.ThrowAsync<BusinessValidationException>(async () => await manager.Handle(new ProcessPaperSupportsCommand
            {
                FileId = fileId,
                Supports = supports,
                RequestingUserId = TestData.Tier4TeamMemberId
            }));
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task ProcessPaperSupportsCommand_DigitalAndPaperSupports_BusinessValidationException()
        {
            var fileId = TestData.PaperEvacuationFileId;

            var supports = new Referral[]
            {
                new IncidentalsReferral() { ExternalReferenceId = $"{TestData.TestPrefix}-paperreferral" },
                new IncidentalsReferral()
            };

            await Should.ThrowAsync<BusinessValidationException>(async () => await manager.Handle(new ProcessPaperSupportsCommand
            {
                FileId = fileId,
                Supports = supports,
                RequestingUserId = TestData.Tier4TeamMemberId
            }));
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task SearchSupports_ExternalReferenceId_CorrectListOfSupports()
        {
            var fileId = TestData.PaperEvacuationFileId;

            var newSupports = new Referral[]
            {
                     new ClothingReferral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierAId } },
                     new IncidentalsReferral(),
                     new FoodGroceriesReferral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierBId } },
                     new FoodRestaurantReferral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierCId } },
                     new LodgingBilletingReferral() { NumberOfNights = 1 },
                     new LodgingGroupReferral() { NumberOfNights = 1, FacilityCommunityCode = TestData.RandomCommunity },
                     new LodgingHotelReferral() { NumberOfNights = 1, NumberOfRooms = 1 },
                     new TransportationOtherReferral(),
                     new TransportationTaxiReferral(),
            };

            var externalReferenceId = $"{TestData.TestPrefix}-paperreferral";

            foreach (var s in newSupports)
            {
                s.From = DateTime.UtcNow;
                s.To = DateTime.UtcNow.AddDays(3);
                s.IssuedOn = DateTime.Parse("2021/12/31T16:14:32Z");
                s.ExternalReferenceId = externalReferenceId;
                s.IssuedBy = new TeamMember { DisplayName = "autotest R" };
            }

            await manager.Handle(new ProcessPaperSupportsCommand { FileId = fileId, RequestingUserId = TestData.Tier4TeamMemberId, Supports = newSupports });

            var supports = (await manager.Handle(new SearchSupportsQuery { ExternalReferenceId = externalReferenceId })).Items;
            supports.ShouldNotBeEmpty();
            supports.Count().ShouldBe(newSupports.Length);
            foreach (var support in supports)
            {
                var referral = support.ShouldBeAssignableTo<Referral>().ShouldNotBeNull();
                referral.ExternalReferenceId.ShouldBe(externalReferenceId);
                referral.OriginatingNeedsAssessmentId.ShouldBe(TestData.PaperEvacuationFileNeedsAssessmentId);
            }
        }
    }
}
