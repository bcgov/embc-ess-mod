using System;
using System.Linq;
using EMBC.ESS.Resources.Supports;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class SupportTests : DynamicsWebAppTestBase
    {
        private readonly ISupportRepository supportRepository;

        public SupportTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            supportRepository = Services.GetRequiredService<ISupportRepository>();
        }

        [Fact]
        public async Task CanCreateSupports()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            var uniqueId = Guid.NewGuid().ToString().Substring(0, 4);
            var householdMembers = TestData.HouseholdMemberIds;
            var evacuationFileId = TestData.EvacuationFileId;

            var newSupports = new Support[]
            {
               new ClothingSupport {
                   SupportDelivery = new Referral
                   {
                        SupplierId = TestData.SupplierAId,
                        SupplierNotes = $"{uniqueId}-notes",
                        IssuedToPersonName = "test person",
                   },
                   CreatedByTeamMemberId = TestData.Tier4TeamMemberId,
                   IncludedHouseholdMembers = householdMembers,
                   From = now,
                   To = now.AddDays(3),
                   IssuedOn = now
               },
               new IncidentalsSupport {
                   SupportDelivery = new Interac
                   {
                       NotificationEmail = $"{TestData.TestPrefix}eraunitest@test.gov.bc.ca",
                       NotificationMobile = "+000-000-0000",
                       ReceivingRegistrantId = TestData.ContactId
                   },
                   TotalAmount = 100.00m,
                   CreatedByTeamMemberId = TestData.Tier4TeamMemberId,
                   IncludedHouseholdMembers = householdMembers,
                   From = now,
                   To = now.AddDays(5),
                   IssuedOn = now
               },
               new TransportationTaxiSupport {
                   SupportDelivery = new Referral
                   {
                        SupplierId = TestData.SupplierAId,
                        SupplierNotes = $"{uniqueId}-notes",
                        IssuedToPersonName = "test person",
                   },
                   CreatedByTeamMemberId = TestData.Tier4TeamMemberId,
                   IncludedHouseholdMembers = householdMembers,
                   From = now,
                   To = now.AddDays(3),
                   IssuedOn = now,
               }
            };

            var newSupportIds = ((CreateNewSupportsCommandResult)await supportRepository.Manage(new CreateNewSupportsCommand
            {
                FileId = evacuationFileId,
                Supports = newSupports
            })).Supports.Select(s => s.Id).ToArray();
            newSupportIds.Count().ShouldBe(newSupports.Length);

            var supports = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ByEvacuationFileId = evacuationFileId }))
                .Items.Where(s => newSupportIds.Contains(s.Id)).ToArray();
            supports.Length.ShouldBe(newSupports.Length);

            foreach (var support in supports)
            {
                var sourceSupport = newSupports.Single(s => s.GetType() == support.GetType());

                if (sourceSupport.IncludedHouseholdMembers.Any())
                    support.IncludedHouseholdMembers.ShouldBe(sourceSupport.IncludedHouseholdMembers);
                if (sourceSupport.CreatedByTeamMemberId != null)
                    support.CreatedByTeamMemberId.ShouldBe(sourceSupport.CreatedByTeamMemberId);

                support.To.ShouldBe(sourceSupport.To);
                support.CreatedByTeamMemberId.ShouldBe(sourceSupport.CreatedByTeamMemberId);
                support.IncludedHouseholdMembers.ShouldBe(sourceSupport.IncludedHouseholdMembers);
                support.CreatedOn.ShouldBeInRange(now.AddSeconds(-5), DateTime.UtcNow.AddSeconds(2));
                support.IssuedOn.ShouldBe(support.CreatedOn);

                if (sourceSupport.SupportDelivery is Referral sourceReferral)
                {
                    support.Status.ShouldBe(sourceSupport.To < DateTime.UtcNow ? SupportStatus.Expired : SupportStatus.Active);
                    var referral = support.SupportDelivery.ShouldBeAssignableTo<Referral>().ShouldNotBeNull();
                    referral.IssuedToPersonName.ShouldBe(sourceReferral.IssuedToPersonName);
                    referral.SupplierNotes.ShouldBe(sourceReferral.SupplierNotes);
                    referral.SupplierId.ShouldBe(sourceReferral.SupplierId);
                    referral.ManualReferralId.ShouldBeNull();
                    referral.IssuedByDisplayName.ShouldBeNull();
                    if (sourceReferral.SupplierId != null)
                        referral.SupplierId.ShouldBe(sourceReferral.SupplierId);
                }
                if (sourceSupport.SupportDelivery is Interac sourceETransfer)
                {
                    support.Status.ShouldBe(SupportStatus.PendingScan);
                    var etransfer = support.SupportDelivery.ShouldBeAssignableTo<Interac>().ShouldNotBeNull();
                    etransfer.NotificationEmail.ShouldBe(sourceETransfer.NotificationEmail);
                    etransfer.NotificationMobile.ShouldBe(sourceETransfer.NotificationMobile);
                    etransfer.ReceivingRegistrantId.ShouldBe(sourceETransfer.ReceivingRegistrantId);
                }
            }
        }

        [Fact]
        public async Task CanCreatePaperReferrals()
        {
            var now = DateTime.UtcNow;
            now = new DateTime(now.Ticks - (now.Ticks % TimeSpan.TicksPerSecond), now.Kind);
            var issueDate = DateTime.Parse("2021/12/31T16:14:32Z");
            var uniqueId = Guid.NewGuid().ToString().Substring(0, 4);
            var householdMembers = TestData.HouseholdMemberIds;
            var evacuationFileId = TestData.EvacuationFileId;

            var paperSupports = new Support[]
            {
               new ClothingSupport
               {
                   SupportDelivery = new Referral
                   {
                       SupplierId = TestData.SupplierAId,
                       SupplierNotes = $"{uniqueId}-paper-notes",
                       IssuedToPersonName = "test person",
                       ManualReferralId = $"{uniqueId}-paperreferral",
                       IssuedByDisplayName =   "autotest R"
                   },
                   CreatedByTeamMemberId = TestData.Tier4TeamMemberId,
                   IncludedHouseholdMembers = householdMembers,
                   From = issueDate.AddDays(-10),
                   To = issueDate.AddDays(-3),
                   IssuedOn = issueDate,
               },
               new IncidentalsSupport
               {
                   SupportDelivery = new Referral
                   {
                       SupplierId = TestData.SupplierAId,
                       SupplierNotes = $"{uniqueId}-paper-notes",
                       IssuedToPersonName = "test person",
                       ManualReferralId = $"{uniqueId}-paperreferral",
                       IssuedByDisplayName =   "autotest R"
                   },
                   CreatedByTeamMemberId = TestData.Tier4TeamMemberId,
                   IncludedHouseholdMembers = householdMembers,
                   From = issueDate.AddDays(-10),
                   To = issueDate.AddDays(-3),
                   IssuedOn = issueDate,
               }
            };

            var newSupportIds = ((CreateNewSupportsCommandResult)await supportRepository.Manage(new CreateNewSupportsCommand
            {
                FileId = evacuationFileId,
                Supports = paperSupports
            })).Supports.Select(s => s.Id).ToArray();
            newSupportIds.Count().ShouldBe(paperSupports.Length);

            var supports = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ByEvacuationFileId = evacuationFileId }))
                .Items.Where(s => newSupportIds.Contains(s.Id)).ToArray();
            supports.Length.ShouldBeGreaterThanOrEqualTo(paperSupports.Length);

            foreach (var support in supports)
            {
                var sourceSupport = paperSupports.Single(s => s.GetType() == support.GetType());
                var sourceReferral = (Referral)sourceSupport.SupportDelivery;

                var referral = support.SupportDelivery.ShouldBeAssignableTo<Referral>().ShouldNotBeNull();

                support.Status.ShouldBe(sourceSupport.To < DateTime.UtcNow ? SupportStatus.Expired : SupportStatus.Active);

                if (sourceReferral.SupplierId != null)
                    referral.SupplierId.ShouldBe(sourceReferral.SupplierId);
                if (sourceSupport.IncludedHouseholdMembers.Any())
                    support.IncludedHouseholdMembers.ShouldBe(sourceSupport.IncludedHouseholdMembers);
                if (sourceSupport.CreatedByTeamMemberId != null)
                    support.CreatedByTeamMemberId.ShouldBe(sourceSupport.CreatedByTeamMemberId);

                support.To.ShouldBe(sourceSupport.To);
                referral.IssuedToPersonName.ShouldBe(sourceReferral.IssuedToPersonName);
                referral.SupplierNotes.ShouldBe(sourceReferral.SupplierNotes);
                support.CreatedByTeamMemberId.ShouldBe(sourceSupport.CreatedByTeamMemberId);
                support.Status.ShouldBe(sourceSupport.To < DateTime.UtcNow ? SupportStatus.Expired : SupportStatus.Active);
                support.IncludedHouseholdMembers.ShouldBe(sourceSupport.IncludedHouseholdMembers);
                referral.SupplierId.ShouldBe(sourceReferral.SupplierId);
                referral.ManualReferralId.ShouldNotBeNull().ShouldBe(sourceReferral.ManualReferralId);
                referral.IssuedByDisplayName.ShouldNotBeNull().ShouldBe(sourceReferral.IssuedByDisplayName);
                support.CreatedOn.ShouldBeInRange(now.AddSeconds(-10), DateTime.UtcNow.AddSeconds(2));
                support.IssuedOn.ShouldBe(sourceSupport.IssuedOn);
            }
        }

        [Fact]
        public async Task ChangeStatus_Void_Success()
        {
            var support = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ByEvacuationFileId = TestData.EvacuationFileId })).Items
                .First(s => s.SupportDelivery is Referral && s.Status == SupportStatus.Active);

            var voidedSupportId = ((ChangeSupportStatusCommandResult)await supportRepository.Manage(new ChangeSupportStatusCommand
            {
                Items = new[] { SupportStatusTransition.VoidSupport(support.Id, SupportVoidReason.NewSupplierRequired) }
            })).Ids.ShouldHaveSingleItem();
            voidedSupportId.ShouldBe(support.Id);

            var voidedSupport = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ById = voidedSupportId })).Items.ShouldHaveSingleItem();
            voidedSupport.Status.ShouldBe(SupportStatus.Void);
        }

        [Fact]
        public async Task ChangeStatus_eTransferToCancel_Success()
        {
            var support = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ByEvacuationFileId = TestData.EvacuationFileId })).Items
                .First(s => s.SupportDelivery is ETransfer);

            var cancelledSupportId = ((ChangeSupportStatusCommandResult)await supportRepository.Manage(new ChangeSupportStatusCommand
            {
                Items = new[] { new SupportStatusTransition { SupportId = support.Id, ToStatus = SupportStatus.Cancelled, Reason = "some reason" } }
            })).Ids.ShouldHaveSingleItem();
            cancelledSupportId.ShouldBe(support.Id);

            var voidedSupport = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ById = cancelledSupportId })).Items.ShouldHaveSingleItem();
            voidedSupport.Status.ShouldBe(SupportStatus.Cancelled);
        }

        [Fact]
        public async Task ChangeStatus_eTransferToApproved_Success()
        {
            var supports = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ByEvacuationFileId = TestData.EvacuationFileId })).Items;
            var support = supports.First(s => s.SupportDelivery is Interac && s.Status == SupportStatus.Approved);

            var supportId = ((ChangeSupportStatusCommandResult)await supportRepository.Manage(new ChangeSupportStatusCommand
            {
                Items = new[] { new SupportStatusTransition { SupportId = support.Id, ToStatus = SupportStatus.Approved } }
            })).Ids.ShouldHaveSingleItem();
            supportId.ShouldBe(support.Id);

            var voidedSupport = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ById = supportId })).Items.ShouldHaveSingleItem();
            voidedSupport.Status.ShouldBe(SupportStatus.Approved);
        }

        [Fact]
        public async Task QuerySupports_ByStatus_ReturnCorrectSupports()
        {
            var sampleSupports = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ByEvacuationFileId = TestData.EvacuationFileId, })).Items;

            var status = sampleSupports.Select(s => s.Status).Skip(Random.Shared.Next(0, sampleSupports.Count() - 1)).Take(1).Single();

            var supports = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ByStatus = status })).Items;

            supports.ShouldNotBeEmpty();
            supports.ShouldAllBe(s => s.Status == status);
        }

        [Fact]
        public async Task QuerySupports_WithLimit_ReturnCorrectSupports()
        {
            var supports = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery
            {
                ByStatus = SupportStatus.PendingApproval,
                LimitNumberOfResults = 2
            })).Items;

            supports.Count().ShouldBeLessThanOrEqualTo(2);
        }

        [Fact]
        public async Task SubmitSupportForApproval_SupportWithFlags_AssignedToApprovalQueue()
        {
            var householdMembers = TestData.HouseholdMemberIds;
            var now = DateTime.UtcNow;
            var fileId = TestData.EvacuationFileId;

            var support = new ClothingSupport
            {
                SupportDelivery = new Interac
                {
                    NotificationEmail = "test@email",
                    NotificationMobile = "12345",
                    ReceivingRegistrantId = TestData.ContactId,
                    RecipientFirstName = "test",
                    RecipientLastName = "test"
                },
                CreatedByTeamMemberId = TestData.Tier4TeamMemberId,
                IncludedHouseholdMembers = householdMembers,
                From = now,
                To = now.AddDays(3),
                IssuedOn = now
            };

            var supportId = ((CreateNewSupportsCommandResult)await supportRepository.Manage(new CreateNewSupportsCommand
            {
                FileId = fileId,
                Supports = new[] { support }
            })).Supports.ShouldHaveSingleItem().Id;

            var flags = new[]
            {
                new AmountOverridenSupportFlag{ Approver = "test" }
            };

            //should be in pending scan
            ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ByStatus = SupportStatus.PendingScan })).Items.Where(s => s.Id == supportId).ShouldHaveSingleItem();

            await supportRepository.Manage(new SubmitSupportForApprovalCommand
            {
                SupportId = supportId,
                Flags = flags
            });

            //should be in pending approval
            var pendingApprovalSupport = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ById = supportId })).Items.ShouldHaveSingleItem();
            pendingApprovalSupport.Status.ShouldBe(SupportStatus.PendingApproval);
            pendingApprovalSupport.Flags.ShouldHaveSingleItem().ShouldBeAssignableTo<AmountOverridenSupportFlag>().ShouldNotBeNull().Approver.ShouldBe(flags[0].Approver);
        }

        [Fact]
        public async Task FailSupport_AssignedToErrorQueue()
        {
            //var supportId = TestData.ETransferIds.TakeRandom(1).Single();
            var supportId = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ByStatus = SupportStatus.Approved, LimitNumberOfResults = 10 })).Items.ToArray().TakeRandom(1).ShouldHaveSingleItem().Id;

            await supportRepository.Manage(new SubmitSupportForReviewCommand { SupportId = supportId });

            var support = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ById = supportId })).Items.ShouldHaveSingleItem();
            support.Status.ShouldBe(SupportStatus.UnderReview);
        }

        [Fact]
        public async Task ApproveSupport_PendingSupport_Approved()
        {
            var householdMembers = TestData.HouseholdMemberIds;
            var now = DateTime.UtcNow;
            var fileId = TestData.EvacuationFileId;

            var support = new ClothingSupport
            {
                SupportDelivery = new Interac
                {
                    NotificationEmail = "test@email",
                    NotificationMobile = "12345",
                    ReceivingRegistrantId = TestData.ContactId,
                    RecipientFirstName = "test",
                    RecipientLastName = "test"
                },
                CreatedByTeamMemberId = TestData.Tier4TeamMemberId,
                IncludedHouseholdMembers = householdMembers,
                From = now,
                To = now.AddDays(3),
                IssuedOn = now
            };

            var supportId = ((CreateNewSupportsCommandResult)await supportRepository.Manage(new CreateNewSupportsCommand
            {
                FileId = fileId,
                Supports = new[] { support }
            })).Supports.ShouldHaveSingleItem().Id;

            await supportRepository.Manage(new SubmitSupportForApprovalCommand { SupportId = supportId, Flags = Array.Empty<SupportFlag>() });

            await supportRepository.Manage(new ApproveSupportCommand { SupportId = supportId });

            var approvedSupport = ((SearchSupportQueryResult)await supportRepository.Query(new SearchSupportsQuery { ById = supportId })).Items.ShouldHaveSingleItem();
            approvedSupport.Status.ShouldBe(SupportStatus.Approved);
        }
    }
}
