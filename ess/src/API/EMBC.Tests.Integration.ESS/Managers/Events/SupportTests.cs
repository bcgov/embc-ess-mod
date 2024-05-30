using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using EMBC.ESS.Managers.Events;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;
using EMBC.ESS.Utilities.Dynamics;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Managers.Events
{
    public class SupportTests : DynamicsWebAppTestBase
    {
        private readonly EventsManager manager;

        private async Task<RegistrantProfile> GetRegistrantByUserId(string userId) => (await TestHelper.GetRegistrantByUserId(manager, userId)).ShouldNotBeNull();

        private EvacuationFile CreateNewTestEvacuationFile(RegistrantProfile registrant, string? taskNumber) => TestHelper.CreateNewTestEvacuationFile(registrant, taskNumber);

        public SupportTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            manager = Services.GetRequiredService<EventsManager>();
        }

        [Fact]
        public async Task ProcessSupports_Supports_Created()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var file = CreateNewTestEvacuationFile(registrant, TestData.ActiveTaskId);

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = TestData.Tier4TeamMemberId };

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });
            file = (await manager.Handle(new EvacuationFilesQuery { FileId = fileId })).Items.ShouldHaveSingleItem();

            var email = $"{TestData.TestPrefix}eraunitest@test.gov.bc.ca";
            var householdMembers = file.HouseholdMembers.Select(m => m.Id).ToArray();

            var supports = new Support[]
            {
                new ClothingSupport { TotalAmount = 100, SupportDelivery = new Interac { NotificationEmail = email, ReceivingRegistrantId = registrant.Id } },
                new IncidentalsSupport { TotalAmount = 100, SupportDelivery = new Interac { NotificationEmail = email, ReceivingRegistrantId = registrant.Id } },
                new FoodGroceriesSupport {TotalAmount = 100, SupportDelivery = new Interac { NotificationEmail = email, ReceivingRegistrantId = registrant.Id } },
                new FoodRestaurantSupport { TotalAmount = 100, SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierCId } } },
                new ShelterBilletingSupport() { NumberOfNights = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new ShelterGroupSupport { NumberOfNights = 1, FacilityCommunityCode = TestData.RandomCommunity, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new ShelterHotelSupport { NumberOfNights = 1, NumberOfRooms = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new ShelterAllowanceSupport { NumberOfNights = 1, ContactEmail = "email", ContactPhone = "phone", TotalAmount = 100.00m , SupportDelivery = new Interac { NotificationEmail = email, ReceivingRegistrantId = registrant.Id } },
                new TransportationOtherSupport { TotalAmount = 100, SupportDelivery = new Interac { NotificationEmail = email, ReceivingRegistrantId = registrant.Id } },
                new TransportationTaxiSupport { SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
            };

            foreach (var s in supports)
            {
                s.From = DateTime.UtcNow;
                s.To = DateTime.UtcNow.AddDays(3);
                s.IssuedBy = new TeamMember { DisplayName = "autotest R" };
                s.IncludedHouseholdMembers = householdMembers.TakeRandom();
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
                support.CreatedOn.ShouldNotBeNull().ShouldBeInRange(DateTime.UtcNow.AddSeconds(-30), DateTime.UtcNow.AddSeconds(2));
                support.IssuedOn.ShouldNotBeNull().ShouldBeInRange(DateTime.UtcNow.AddSeconds(-30), DateTime.UtcNow.AddSeconds(2));
                support.IssuedBy.ShouldNotBeNull().Id.ShouldBe(TestData.Tier4TeamMemberId);
                support.IncludedHouseholdMembers.ShouldBe(sourceSupport.IncludedHouseholdMembers);
            }
        }

        [Fact]
        public async Task Void_Referral_Voided()
        {
            var fileId = TestData.EvacuationFileId;
            var supportId = TestData.ReferralIds.TakeRandom(1).Single();
            await manager.Handle(new VoidSupportCommand
            {
                FileId = fileId,
                SupportId = supportId,
                VoidReason = SupportVoidReason.ErrorOnPrintedReferral
            });

            var updatedSupport = (await manager.Handle(new SearchSupportsQuery { FileId = fileId })).Items.Single(s => s.Id == supportId);

            updatedSupport.Status.ShouldBe(SupportStatus.Void);
        }

        [Fact]
        public async Task CancelInteracSupport_NewSupport_Cancelled()
        {
            var fileId = TestData.EvacuationFileId;
            var registrantId = TestData.ContactId;
            var uniqueId = TestHelper.GenerateNewUniqueId(TestData.TestPrefix);
            var email = $"{uniqueId}eraunitest@test.gov.bc.ca";

            var support = new IncidentalsSupport
            {
                TotalAmount = 100,
                SupportDelivery = new Interac
                {
                    NotificationEmail = email,
                    ReceivingRegistrantId = registrantId,
                }
            };

            support.From = DateTime.UtcNow;
            support.To = DateTime.UtcNow.AddDays(3);
            support.IssuedBy = new TeamMember { DisplayName = "autotest R" };
            support.IncludedHouseholdMembers = TestData.HouseholdMemberIds.TakeRandom();

            await manager.Handle(new ProcessSupportsCommand { FileId = fileId, Supports = new[] { support }, RequestingUserId = TestData.Tier4TeamMemberId });

            var supportId = (await manager.Handle(new SearchSupportsQuery { FileId = fileId })).Items
                .Where(s => s.SupportDelivery is Interac i && i.NotificationEmail != null && i.NotificationEmail.StartsWith(uniqueId)).ShouldHaveSingleItem().Id;

            await manager.Handle(new CancelSupportCommand
            {
                FileId = fileId,
                SupportId = supportId,
                Reason = "need to cancel"
            });

            var updatedSupport = (await manager.Handle(new SearchSupportsQuery { FileId = fileId })).Items.Single(s => s.Id == supportId);

            updatedSupport.Status.ShouldBe(SupportStatus.Cancelled);
        }

        [Fact]
        public async Task ReprintSupport_Support_Printed()
        {
            var printRequestId = await manager.Handle(new ReprintSupportCommand
            {
                FileId = TestData.EvacuationFileId,
                ReprintReason = "test",
                RequestingUserId = TestData.Tier4TeamMemberId,
                SupportId = TestData.SupportIds.TakeRandom(1).Single()
            });

            printRequestId.ShouldNotBeNullOrEmpty();
        }

        [Fact]
        public async Task QuerySupplierList_Task_Returned()
        {
            var taskId = TestData.ActiveTaskId;
            var list = (await manager.Handle(new SuppliersListQuery { TaskId = taskId })).Items;
            list.ShouldNotBeEmpty();
        }

        [Fact]
        public async Task QueryPrintRequest_Request_Success()
        {
            var dynamicsContext = Services.GetRequiredService<EssContext>();
            var testPrintRequest = dynamicsContext.era_referralprints
                .Where(pr => pr.statecode == (int)EntityState.Active && pr._era_requestinguserid_value != null)
                .OrderByDescending(pr => pr.createdon)
                .Take(new Random().Next(1, 20))
                .First();

            var response = await manager.Handle(new PrintRequestQuery
            {
                PrintRequestId = testPrintRequest.era_referralprintid.ToString(),
                RequestingUserId = testPrintRequest._era_requestinguserid_value?.ToString()
            });
            response.Content.ShouldNotBeEmpty();
            await File.WriteAllBytesAsync("./newTestPrintRequestFile.html", response.Content);
        }

        [Fact]
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

        [Fact]
        public async Task ProcessPaperSupports_paperSupports_Created()
        {
            var registrant = await GetRegistrantByUserId(TestData.ContactUserId);
            var paperFile = CreateNewTestEvacuationFile(registrant, TestData.ActiveTaskId);

            paperFile.ManualFileId = $"{TestData.TestPrefix}-paperfile";
            paperFile.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            paperFile.NeedsAssessment.CompletedBy = new TeamMember { Id = TestData.Tier4TeamMemberId };

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = paperFile });

            paperFile = (await manager.Handle(new EvacuationFilesQuery { FileId = fileId })).Items.ShouldHaveSingleItem();
            var householdMembers = paperFile.HouseholdMembers.Select(m => m.Id).ToArray();

            var supports = new Support[]
            {
                new ClothingSupport { SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierAId } } },
                new IncidentalsSupport { SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierBId } } },
                new FoodGroceriesSupport {  SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierBId } } },
                new FoodRestaurantSupport {  SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierCId } } },
                new ShelterBilletingSupport() { NumberOfNights = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new ShelterGroupSupport { NumberOfNights = 1, FacilityCommunityCode = TestData.RandomCommunity, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new ShelterHotelSupport { NumberOfNights = 1, NumberOfRooms = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new ShelterAllowanceSupport { NumberOfNights = 1, ContactEmail = "email", ContactPhone = "phone", TotalAmount = 100.00m , SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new TransportationOtherSupport { SupportDelivery = new Referral { IssuedToPersonName = "test person" }},
                new TransportationTaxiSupport { SupportDelivery = new Referral { IssuedToPersonName = "test person" }},
            };

            foreach (var s in supports)
            {
                s.From = DateTime.UtcNow.AddDays(-4);
                s.To = DateTime.UtcNow.AddDays(-1);
                s.IssuedOn = DateTime.Parse("2021/12/31T16:14:32Z", CultureInfo.InvariantCulture);
                ((Referral)s.SupportDelivery).ManualReferralId = $"{TestData.TestPrefix}-paperreferral";
                s.IssuedBy = new TeamMember { DisplayName = "autotest R" };
                s.IncludedHouseholdMembers = householdMembers.TakeRandom();
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
                support.CreatedOn.ShouldNotBeNull().ShouldBeInRange(DateTime.UtcNow.AddSeconds(-30), DateTime.UtcNow.AddSeconds(2));
                support.IssuedBy.ShouldNotBeNull().DisplayName.ShouldBe(sourceSupport.IssuedBy.DisplayName);
                support.IssuedOn.ShouldNotBeNull().ShouldBe(sourceSupport.IssuedOn.ShouldNotBeNull());
                support.IncludedHouseholdMembers.ShouldBe(sourceSupport.IncludedHouseholdMembers);
            }
        }

        [Fact]
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

        [Fact]
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

        [Fact]
        public async Task SearchSupports_ManualReferralId_CorrectListOfSupports()
        {
            var fileId = TestData.PaperEvacuationFilePaperId;
            var paperFile = (await manager.Handle(new EvacuationFilesQuery { FileId = fileId })).Items.ShouldHaveSingleItem();
            var householdMembers = paperFile.HouseholdMembers.Select(m => m.Id).ToArray();

            var newSupports = new Support[]
            {
                new ClothingSupport { SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierAId } } },
                new IncidentalsSupport { SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierBId } } },
                new FoodGroceriesSupport {  SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierBId } } },
                new FoodRestaurantSupport {  SupportDelivery = new Referral { SupplierDetails = new SupplierDetails { Id = TestData.SupplierCId } } },
                new ShelterBilletingSupport() { NumberOfNights = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new ShelterGroupSupport { NumberOfNights = 1, FacilityCommunityCode = TestData.RandomCommunity, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new ShelterHotelSupport { NumberOfNights = 1, NumberOfRooms = 1, SupportDelivery = new Referral { IssuedToPersonName = "test person" } },
                new TransportationOtherSupport { SupportDelivery = new Referral { IssuedToPersonName = "test person" }},
                new TransportationTaxiSupport { SupportDelivery = new Referral { IssuedToPersonName = "test person" }},
            };

            var uniqueId = Guid.NewGuid().ToString().Substring(0, 4);
            var paperReferralId = $"{TestData.TestPrefix}-paperreferral-{uniqueId}";

            foreach (var s in newSupports)
            {
                s.From = DateTime.UtcNow;
                s.To = DateTime.UtcNow.AddDays(3);
                s.IssuedOn = DateTime.Parse("2021/12/31T16:14:32Z", CultureInfo.InvariantCulture);
                ((Referral)s.SupportDelivery).ManualReferralId = paperReferralId;
                s.IssuedBy = new TeamMember { DisplayName = "autotest R" };
                s.IncludedHouseholdMembers = householdMembers.TakeRandom();
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

        [Fact]
        public async Task ScanSupports_FlagsRaised()
        {
            var registrantId = await TestHelper.SaveRegistrant(manager, TestHelper.CreateRegistrantProfile());
            var registrant = (await TestHelper.GetRegistrantById(manager, registrantId)).ShouldNotBeNull();

            var file = CreateNewTestEvacuationFile(registrant, TestData.ActiveTaskId);

            file.NeedsAssessment.CompletedOn = DateTime.UtcNow;
            file.NeedsAssessment.CompletedBy = new TeamMember { Id = TestData.Tier4TeamMemberId };

            var fileId = await manager.Handle(new SubmitEvacuationFileCommand { File = file });
            file = (await manager.Handle(new EvacuationFilesQuery { FileId = fileId })).Items.ShouldHaveSingleItem();

            var newSupports = TestHelper.CreateSupports(file);

            await manager.Handle(new ProcessSupportsCommand
            {
                FileId = fileId,
                Supports = newSupports,
                IncludeSummaryInReferralsPrintout = false,
                RequestingUserId = TestData.Tier4TeamMemberId
            });

            await manager.Handle(new ProcessPendingSupportsCommand());

            var supports = await manager.Handle(new SearchSupportsQuery { FileId = fileId });

            var duplicateSupport = supports.Items.Where(s => s is IncidentalsSupport).Cast<IncidentalsSupport>().ShouldHaveSingleItem();
            var duplicateSupportId = duplicateSupport.Id;
            duplicateSupport.Id = null;
            duplicateSupport.ApprovedItems = TestHelper.GenerateNewUniqueId(TestData.TestPrefix);

            await manager.Handle(new ProcessSupportsCommand
            {
                FileId = fileId,
                Supports = new[] { duplicateSupport },
                IncludeSummaryInReferralsPrintout = false,
                RequestingUserId = TestData.Tier4TeamMemberId
            });

            await manager.Handle(new ProcessPendingSupportsCommand());

            supports = await manager.Handle(new SearchSupportsQuery { FileId = fileId });
            var scannedDuplicateSupport = supports.Items.Where(s => s is IncidentalsSupport i && i.ApprovedItems == duplicateSupport.ApprovedItems).Cast<IncidentalsSupport>().ShouldHaveSingleItem();
            scannedDuplicateSupport.Flags.ShouldHaveSingleItem().ShouldBeAssignableTo<DuplicateSupportFlag>().ShouldNotBeNull().DuplicatedSupportId.ShouldBe(duplicateSupportId);
        }

        [Fact]
        public async Task CheckEligibility_Created()
        {
            var eligibilityId = await manager.Handle(new CheckEligibileForSelfServeCommand { RegistrantUserId = TestData.ContactUserId, EvacuationFileNumber = TestData.EvacuationFileId });
            eligibilityId.ShouldNotBeNull();

            var eligibility = await manager.Handle(new EligibilityCheckQuery { RegistrantUserId = TestData.ContactUserId, EvacuationFileNumber = TestData.EvacuationFileId });
            eligibility.ShouldNotBeNull();
        }

        [Fact]
        public async Task CheckEligibility_NoNeeds_ActiveFile()
        {
            var (file, _) = await CreateTestSubjects(taskNumber: null, needs: []);

            file.RelatedTask.ShouldNotBeNull().Id.ShouldBe(TestData.SelfServeActiveTaskId);
            file.Status.ShouldBe(EvacuationFileStatus.Active);
        }

        [Fact]
        public async Task DraftSelfServeSupport_File_Returned()
        {
            var (file, registrant) = await CreateTestSubjects();

            var response = await manager.Handle(new DraftSelfServeSupportQuery { RegistrantUserId = registrant.UserId, EvacuationFileNumber = file.Id });
            response.Items.ShouldNotBeEmpty();
        }

        [Fact]
        public async Task DraftSelfServeSupport_Changes_Returned()
        {
            var (file, registrant) = await CreateTestSubjects();

            var draftSupports = (await manager.Handle(new DraftSelfServeSupportQuery { RegistrantUserId = registrant.UserId, EvacuationFileNumber = file.Id })).Items;
            var response = await manager.Handle(new DraftSelfServeSupportQuery { RegistrantUserId = registrant.UserId, EvacuationFileNumber = file.Id, Items = draftSupports });
            response.Items.ShouldNotBeEmpty();
        }

        [Fact]
        public async Task ProcessSelfServeSupports_Supports_SupportsCreated()
        {
            var (file, registrant) = await CreateTestSubjects();

            var from = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified);
            var fromDay = DateOnly.FromDateTime(from);
            var householdMembers = file.HouseholdMembers.Select(hm => hm.Id);
            var supportDays = new[] { fromDay, fromDay.AddDays(1), fromDay.AddDays(2) };
            var etransferDetails = new ETransferDetails
            {
                ContactEmail = registrant.Email ?? "test@test.gov.bc.ca",
                ETransferEmail = registrant.Email,
                ETransferMobile = registrant.Phone,
                RecipientName = $"{registrant.FirstName} {registrant.LastName}"
            };

            var supports = new SelfServeSupport[]
            {
                new SelfServeClothingSupport { TotalAmount = 100d, IncludedHouseholdMembers = householdMembers },
                new SelfServeClothingSupport { TotalAmount = 100d, IncludedHouseholdMembers = householdMembers },
                new SelfServeFoodGroceriesSupport { TotalAmount = 100d, Nights = supportDays, IncludedHouseholdMembers = householdMembers },
                new SelfServeShelterAllowanceSupport { TotalAmount = 100d, Nights = supportDays, IncludedHouseholdMembers = householdMembers },
            };

            await manager.Handle(new ProcessSelfServeSupportsCommand
            {
                Supports = supports,
                ETransferDetails = etransferDetails,
                EvacuationFileNumber = file.Id,
                RegistrantUserId = registrant.UserId
            });

            var updatedFile = (await manager.Handle(new EvacuationFilesQuery { FileId = file.Id })).Items.ShouldHaveSingleItem();
            updatedFile.Supports.Count().ShouldBe(supports.Length);
            updatedFile.HouseholdMembers.Count().ShouldBe(file.HouseholdMembers.Count());
            updatedFile.RelatedTask.ShouldNotBeNull().Id.ShouldBe(TestData.SelfServeActiveTaskId);
        }

        private async Task<(EvacuationFile file, RegistrantProfile registrantProfile)> CreateTestSubjects(string? taskNumber = null, IEnumerable<IdentifiedNeed>? needs = null)
        {
            if (needs == null) needs = [IdentifiedNeed.Clothing, IdentifiedNeed.ShelterAllowance, IdentifiedNeed.Incidentals, IdentifiedNeed.Food];
            var registrant = TestHelper.CreateRegistrantProfile();
            registrant.HomeAddress = TestHelper.CreateSelfServeEligibleAddress();
            registrant.UserId = $"autotest-{Guid.NewGuid().ToString().Substring(0, 4)}";
            registrant.Id = await manager.Handle(new SaveRegistrantCommand { Profile = registrant });

            var file = CreateNewTestEvacuationFile(registrant, taskNumber);
            file.NeedsAssessment.HouseholdMembers = file.NeedsAssessment.HouseholdMembers.Take(5);
            file.NeedsAssessment.Needs = needs;
            file.Id = await manager.Handle(new SubmitEvacuationFileCommand { File = file });
            await manager.Handle(new CheckEligibileForSelfServeCommand { RegistrantUserId = registrant.UserId, EvacuationFileNumber = file.Id });
            file = (await manager.Handle(new EvacuationFilesQuery { FileId = file.Id })).Items.ShouldHaveSingleItem();

            return (file, registrant);
        }
    }
}
