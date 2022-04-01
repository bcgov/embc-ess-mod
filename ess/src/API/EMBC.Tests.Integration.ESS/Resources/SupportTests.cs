using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Resources.Supports;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class SupportTests : DynamicsWebAppTestBase
    {
        private readonly ISupportRepository supportRepository;

        public SupportTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            supportRepository = Services.GetRequiredService<ISupportRepository>();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
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
                       NotificationEmail = "test@test.test",
                       NotificationMobile = "+000-000-0000",
                       ReceivingRegistrantId = TestData.ContactId
                   },
                   TotalAmount = 100.00,
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

            var newSupportIds = (await supportRepository.Manage(new SaveEvacuationFileSupportCommand { FileId = evacuationFileId, Supports = newSupports })).Ids;
            newSupportIds.Count().ShouldBe(newSupports.Length);

            var supports = (await supportRepository.Query(new SearchSupportsQuery { ByEvacuationFileId = evacuationFileId }))
                .Items.Where(s => newSupportIds.Contains(s.Id)).ToArray();
            supports.Length.ShouldBe(newSupports.Length);

            foreach (var support in supports)
            {
                var sourceSupport = newSupports.Where(s => s.GetType() == support.GetType()).Single();

                if (sourceSupport.IncludedHouseholdMembers.Any())
                    support.IncludedHouseholdMembers.ShouldBe(sourceSupport.IncludedHouseholdMembers);
                if (sourceSupport.CreatedByTeamMemberId != null)
                    support.CreatedByTeamMemberId.ShouldBe(sourceSupport.CreatedByTeamMemberId);

                support.To.ShouldBe(sourceSupport.To);
                support.CreatedByTeamMemberId.ShouldBe(sourceSupport.CreatedByTeamMemberId);
                support.IncludedHouseholdMembers.ShouldBe(sourceSupport.IncludedHouseholdMembers);
                support.CreatedOn.ShouldBeInRange(now.AddSeconds(-5), DateTime.UtcNow);
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

        [Fact(Skip = RequiresVpnConnectivity)]
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

            var newSupportIds = (await supportRepository.Manage(new SaveEvacuationFileSupportCommand { FileId = evacuationFileId, Supports = paperSupports })).Ids;
            newSupportIds.Count().ShouldBe(paperSupports.Length);

            var supports = (await supportRepository.Query(new SearchSupportsQuery { ByEvacuationFileId = evacuationFileId }))
                .Items.Where(s => newSupportIds.Contains(s.Id)).ToArray();
            supports.Length.ShouldBeGreaterThanOrEqualTo(paperSupports.Length);

            foreach (var support in supports)
            {
                var sourceSupport = paperSupports.Where(s => s.GetType() == support.GetType()).Single();
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
                support.CreatedOn.ShouldBeInRange(now.AddSeconds(-10), DateTime.UtcNow);
                support.IssuedOn.ShouldBe(sourceSupport.IssuedOn);
            }
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task ChangeStatus_Void_Success()
        {
            var support = (await supportRepository.Query(new SearchSupportsQuery { ByEvacuationFileId = TestData.EvacuationFileId })).Items.First(s => s.SupportDelivery is Referral);

            var voidedSupportId = (await supportRepository.Manage(new ChangeSupportStatusCommand
            {
                Items = new[] { SupportStatusTransition.VoidSupport(support.Id, SupportVoidReason.NewSupplierRequired) }
            })).Ids.ShouldHaveSingleItem();
            voidedSupportId.ShouldBe(support.Id);

            var voidedSupport = (await supportRepository.Query(new SearchSupportsQuery { ById = voidedSupportId })).Items.ShouldHaveSingleItem();
            voidedSupport.Status.ShouldBe(SupportStatus.Void);
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task ChangeStatus_Cancel_Success()
        {
            var support = (await supportRepository.Query(new SearchSupportsQuery { ByEvacuationFileId = TestData.EvacuationFileId })).Items.First(s => s.SupportDelivery is ETransfer);

            var cancelledSupportId = (await supportRepository.Manage(new ChangeSupportStatusCommand
            {
                Items = new[] { new SupportStatusTransition { SupportId = support.Id, ToStatus = SupportStatus.Cancelled, Reason = "some reason" } }
            })).Ids.ShouldHaveSingleItem();
            cancelledSupportId.ShouldBe(support.Id);

            var voidedSupport = (await supportRepository.Query(new SearchSupportsQuery { ById = cancelledSupportId })).Items.ShouldHaveSingleItem();
            voidedSupport.Status.ShouldBe(SupportStatus.Cancelled);
        }
    }
}
