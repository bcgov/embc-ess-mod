using System;
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

        private EvacuationFile CreateNewTestEvacuationFile(RegistrantProfile registrant) => TestHelper.CreateNewTestEvacuationFile(TestData.TestPrefix, registrant);

        public SupportTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            manager = Services.GetRequiredService<EventsManager>();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task ProcessSupports_Supports_Created()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var file = CreateNewTestEvacuationFile(registrant);

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = TestData.Tier4TeamMemberId };

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });

            var email = $"{TestData.TestPrefix}eraunitest@test.gov.bc.ca";
            var supports = new Support[]
            {
                new ClothingSupport { TotalAmount = 100, SupportDelivery = new Interac { NotificationEmail = email, ReceivingRegistrantId = registrant.Id } },
                new IncidentalsSupport { TotalAmount = 100, SupportDelivery = new Interac { NotificationEmail = email, ReceivingRegistrantId = registrant.Id } },
                new FoodGroceriesSupport {TotalAmount = 100, SupportDelivery = new Interac { NotificationEmail = email, ReceivingRegistrantId = registrant.Id } },
                new FoodRestaurantSupport { TotalAmount = 100, SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierCId } } },
                new LodgingBilletingSupport() { NumberOfNights = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new LodgingGroupSupport { NumberOfNights = 1, FacilityCommunityCode = TestData.RandomCommunity, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new LodgingHotelSupport { NumberOfNights = 1, NumberOfRooms = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new TransportationOtherSupport { TotalAmount = 100, SupportDelivery = new Interac { NotificationEmail = email, ReceivingRegistrantId = registrant.Id } },
                new TransportationTaxiSupport { SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
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
            foreach (var support in refreshedFile.Supports)
            {
                var sourceSupport = supports.Where(s => s.GetType() == support.GetType()).ShouldHaveSingleItem();
                if (sourceSupport.SupportDelivery is Referral sourceReferral)
                {
                    var r = support.SupportDelivery.ShouldBeAssignableTo<Referral>().ShouldNotBeNull();
                    support.Status.ShouldBe(SupportStatus.Active);
                    r.IssuedToPersonName.ShouldBe(sourceReferral.IssuedToPersonName);
                    r.SupplierNotes.ShouldBe(sourceReferral.SupplierNotes);
                    if (sourceReferral.SupplierDetails != null)
                    {
                        r.SupplierDetails.ShouldNotBeNull();
                        r.SupplierDetails.Id.ShouldBe(sourceReferral.SupplierDetails.Id);
                        r.SupplierDetails.Name.ShouldNotBeNull();
                        r.SupplierDetails.Address.ShouldNotBeNull();
                    }
                }
                if (sourceSupport.SupportDelivery is Interac sourceEtransfer)
                {
                    var etransfer = support.SupportDelivery.ShouldBeAssignableTo<Interac>().ShouldNotBeNull();
                    etransfer.NotificationEmail.ShouldBe(sourceEtransfer.NotificationEmail);
                    etransfer.NotificationMobile.ShouldBe(sourceEtransfer.NotificationMobile);
                    etransfer.ReceivingRegistrantId.ShouldBe(sourceEtransfer.ReceivingRegistrantId);
                    support.Status.ShouldBe(SupportStatus.PendingApproval);
                }
                support.CreatedBy.Id.ShouldBe(TestData.Tier4TeamMemberId);
                support.CreatedOn.ShouldNotBeNull().ShouldBeInRange(DateTime.UtcNow.AddSeconds(-30), DateTime.UtcNow);
                support.IssuedOn.ShouldNotBeNull().ShouldBeInRange(DateTime.UtcNow.AddSeconds(-30), DateTime.UtcNow);
                support.IssuedBy.ShouldNotBeNull().Id.ShouldBe(TestData.Tier4TeamMemberId);
            }
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanVoidReferral()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var file = CreateNewTestEvacuationFile(registrant);

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = TestData.Tier4TeamMemberId };

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });

            var email = $"{TestData.TestPrefix}eraunitest@test.gov.bc.ca";
            var supports = new Support[]
            {
                new ClothingSupport { SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierAId } } },
                new IncidentalsSupport { SupportDelivery = new Interac { NotificationEmail = email, ReceivingRegistrantId = registrant.Id } },
                new FoodGroceriesSupport {  SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierBId } } },
                new FoodRestaurantSupport {  SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierCId } } },
                new LodgingBilletingSupport() { NumberOfNights = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new LodgingGroupSupport { NumberOfNights = 1, FacilityCommunityCode = TestData.RandomCommunity, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new LodgingHotelSupport { NumberOfNights = 1, NumberOfRooms = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new TransportationOtherSupport { SupportDelivery = new Referral { IssuedToPersonName = "test person" }},
                new TransportationTaxiSupport { SupportDelivery = new Referral { IssuedToPersonName = "test person" }},
            };

            foreach (var s in supports)
            {
                s.From = DateTime.UtcNow;
                s.To = DateTime.UtcNow.AddDays(3);
            }

            await manager.Handle(new ProcessSupportsCommand { FileId = fileId, Supports = supports, RequestingUserId = TestData.Tier4TeamMemberId });

            var support = (await manager.Handle(new SearchSupportsQuery { FileId = fileId })).Items.First(s => s.SupportDelivery is Referral);

            await manager.Handle(new VoidSupportCommand
            {
                FileId = fileId,
                SupportId = support.Id,
                VoidReason = SupportVoidReason.ErrorOnPrintedReferral
            });

            var updatedSupport = (await manager.Handle(new SearchSupportsQuery { FileId = fileId })).Items.Single(s => s.Id == support.Id);

            updatedSupport.Status.ShouldBe(SupportStatus.Void);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanCancelETransfer()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var file = CreateNewTestEvacuationFile(registrant);

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = TestData.Tier4TeamMemberId };

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });

            var supports = new Support[]
            {
                new ClothingSupport { SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierAId } } },
                new IncidentalsSupport { SupportDelivery = new Interac { NotificationEmail = "test@test.com", ReceivingRegistrantId = registrant.Id } },
                new FoodGroceriesSupport {  SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierBId } } },
                new FoodRestaurantSupport {  SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierCId } } },
                new LodgingBilletingSupport() { NumberOfNights = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new LodgingGroupSupport { NumberOfNights = 1, FacilityCommunityCode = TestData.RandomCommunity, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new LodgingHotelSupport { NumberOfNights = 1, NumberOfRooms = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new TransportationOtherSupport { SupportDelivery = new Referral { IssuedToPersonName = "test person" }},
                new TransportationTaxiSupport { SupportDelivery = new Referral { IssuedToPersonName = "test person" }},
            };

            foreach (var s in supports)
            {
                s.From = DateTime.UtcNow;
                s.To = DateTime.UtcNow.AddDays(3);
            }

            await manager.Handle(new ProcessSupportsCommand { FileId = fileId, Supports = supports, RequestingUserId = TestData.Tier4TeamMemberId });

            var support = (await manager.Handle(new SearchSupportsQuery { FileId = fileId })).Items.First(s => s.SupportDelivery is ETransfer);

            await manager.Handle(new CancelSupportCommand
            {
                FileId = fileId,
                SupportId = support.Id,
                Reason = "need to cancel"
            });

            var updatedSupport = (await manager.Handle(new SearchSupportsQuery { FileId = fileId })).Items.Single(s => s.Id == support.Id);

            updatedSupport.Status.ShouldBe(SupportStatus.Cancelled);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanReprintSupport()
        {
            var printRequestId = await manager.Handle(new ReprintSupportCommand
            {
                FileId = TestData.EvacuationFileId,
                ReprintReason = "test",
                RequestingUserId = TestData.Tier4TeamMemberId,
                SupportId = TestData.CurrenntRunSupportIds.First()
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

            var supports = new Support[]
            {
                new IncidentalsSupport() { SupportDelivery = new Referral { ManualReferralId = $"{TestData.TestPrefix}-paperreferral"} },
                new IncidentalsSupport() { SupportDelivery = new Referral() }
            };

            await Should.ThrowAsync<BusinessValidationException>(async () => await manager.Handle(new ProcessSupportsCommand
            {
                FileId = fileId,
                Supports = supports,
                RequestingUserId = TestData.Tier4TeamMemberId
            }));
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task ProcessPaperSupports_paperSupports_Created()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var paperFile = CreateNewTestEvacuationFile(registrant);

            paperFile.ManualFileId = $"{TestData.TestPrefix}-paperfile";
            paperFile.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            paperFile.NeedsAssessment.CompletedBy = new TeamMember { Id = TestData.Tier4TeamMemberId };

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = paperFile });

            var supports = new Support[]
            {
                new ClothingSupport { SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierAId } } },
                new IncidentalsSupport { SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierBId } } },
                new FoodGroceriesSupport {  SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierBId } } },
                new FoodRestaurantSupport {  SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierCId } } },
                new LodgingBilletingSupport() { NumberOfNights = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new LodgingGroupSupport { NumberOfNights = 1, FacilityCommunityCode = TestData.RandomCommunity, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new LodgingHotelSupport { NumberOfNights = 1, NumberOfRooms = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new TransportationOtherSupport { SupportDelivery = new Referral { IssuedToPersonName = "test person" }},
                new TransportationTaxiSupport { SupportDelivery = new Referral { IssuedToPersonName = "test person" }},
            };

            foreach (var s in supports)
            {
                s.From = DateTime.UtcNow.AddDays(-4);
                s.To = DateTime.UtcNow.AddDays(-1);
                s.IssuedOn = DateTime.Parse("2021/12/31T16:14:32Z");
                ((Referral)s.SupportDelivery).ManualReferralId = $"{TestData.TestPrefix}-paperreferral";
                s.IssuedBy = new TeamMember { DisplayName = "autotest R" };
            }

            await manager.Handle(new ProcessPaperSupportsCommand { FileId = fileId, Supports = supports, RequestingUserId = TestData.Tier4TeamMemberId });

            var refreshedFile = (await manager.Handle(new EvacuationFilesQuery { FileId = fileId })).Items.ShouldHaveSingleItem();
            refreshedFile.Supports.ShouldNotBeEmpty();
            refreshedFile.Supports.Count().ShouldBe(supports.Length);
            foreach (var support in refreshedFile.Supports)
            {
                var sourceSupport = supports.Where(s => s.GetType() == support.GetType()).ShouldHaveSingleItem();
                if (sourceSupport.SupportDelivery is Referral sourceReferral)
                {
                    var r = support.SupportDelivery.ShouldBeAssignableTo<Referral>().ShouldNotBeNull();
                    support.Status.ShouldBe(SupportStatus.Expired);
                    r.IssuedToPersonName.ShouldBe(sourceReferral.IssuedToPersonName);
                    r.SupplierNotes.ShouldBe(sourceReferral.SupplierNotes);
                    if (sourceReferral.SupplierDetails != null)
                    {
                        r.SupplierDetails.ShouldNotBeNull();
                        r.SupplierDetails.Id.ShouldBe(sourceReferral.SupplierDetails.Id);
                        r.SupplierDetails.Name.ShouldNotBeNull();
                        r.SupplierDetails.Address.ShouldNotBeNull();
                    }
                }
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

            var supports = new Support[]
            {
                new IncidentalsSupport() { SupportDelivery = new Referral { ManualReferralId = $"{TestData.TestPrefix}-paperreferral" } },
                new IncidentalsSupport() {  SupportDelivery = new Referral { ManualReferralId = $"{TestData.TestPrefix}-paperreferral" } }
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

            var supports = new Support[]
            {
                new IncidentalsSupport() { SupportDelivery = new Referral { ManualReferralId = $"{TestData.TestPrefix}-paperreferral" } },
                new IncidentalsSupport(){ SupportDelivery = new Referral() }
            };

            await Should.ThrowAsync<BusinessValidationException>(async () => await manager.Handle(new ProcessPaperSupportsCommand
            {
                FileId = fileId,
                Supports = supports,
                RequestingUserId = TestData.Tier4TeamMemberId
            }));
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task SearchSupports_ManualReferralId_CorrectListOfSupports()
        {
            var fileId = TestData.PaperEvacuationFileId;

            var newSupports = new Support[]
            {
                new ClothingSupport { SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierAId } } },
                new IncidentalsSupport { SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierBId } } },
                new FoodGroceriesSupport {  SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierBId } } },
                new FoodRestaurantSupport {  SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierCId } } },
                new LodgingBilletingSupport() { NumberOfNights = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new LodgingGroupSupport { NumberOfNights = 1, FacilityCommunityCode = TestData.RandomCommunity, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new LodgingHotelSupport { NumberOfNights = 1, NumberOfRooms = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new TransportationOtherSupport { SupportDelivery = new Referral { IssuedToPersonName = "test person" }},
                new TransportationTaxiSupport { SupportDelivery = new Referral { IssuedToPersonName = "test person" }},
            };

            var uniqueId = Guid.NewGuid().ToString().Substring(0, 4);
            var paperReferralId = $"{TestData.TestPrefix}-paperreferral-{uniqueId}";

            foreach (var s in newSupports)
            {
                s.From = DateTime.UtcNow;
                s.To = DateTime.UtcNow.AddDays(3);
                s.IssuedOn = DateTime.Parse("2021/12/31T16:14:32Z");
                ((Referral)s.SupportDelivery).ManualReferralId = paperReferralId;
                s.IssuedBy = new TeamMember { DisplayName = "autotest R" };
            }

            await manager.Handle(new ProcessPaperSupportsCommand { FileId = fileId, RequestingUserId = TestData.Tier4TeamMemberId, Supports = newSupports });

            var supports = (await manager.Handle(new SearchSupportsQuery { ManualReferralId = paperReferralId })).Items;
            supports.ShouldNotBeEmpty();
            supports.Count().ShouldBe(newSupports.Length);
            foreach (var support in supports)
            {
                var referral = support.SupportDelivery.ShouldBeAssignableTo<Referral>().ShouldNotBeNull();
                support.FileId.ShouldBe(fileId);
                support.OriginatingNeedsAssessmentId.ShouldBe(TestData.PaperEvacuationFileNeedsAssessmentId);
                referral.ManualReferralId.ShouldBe(paperReferralId);
            }
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
