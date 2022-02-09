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
               new ClothingReferral {
                   SupplierId = TestData.SupplierAId,
                   SupplierNotes = $"{uniqueId}-notes",
                   CreatedByTeamMemberId = TestData.Tier4TeamMemberId,
                   IssuedToPersonName = "test person",
                   IncludedHouseholdMembers = householdMembers,
                   From = now,
                   To = now.AddDays(3),
                   IssuedOn = now
               },
               new IncidentalsReferral {
                   SupplierId = TestData.SupplierAId,
                   SupplierNotes = $"{uniqueId}-notes",
                   CreatedByTeamMemberId = TestData.Tier4TeamMemberId,
                   IssuedToPersonName = "test person",
                   IncludedHouseholdMembers = householdMembers,
                   From = now,
                   To = now.AddDays(5),
                   IssuedOn = now
               }
            };

            var newSupportIds = (await supportRepository.Manage(new SaveEvacuationFileSupportCommand { FileId = evacuationFileId, Supports = newSupports })).Id.Split(';');
            newSupportIds.Length.ShouldBe(newSupports.Length);

            var supports = (await supportRepository.Query(new SearchSupportsQuery { ByEvacuationFileId = evacuationFileId }))
                .Items.Where(s => s is Referral r && (r.SupplierNotes ?? string.Empty).StartsWith(uniqueId))
                .ToArray();
            supports.Length.ShouldBeGreaterThanOrEqualTo(newSupports.Length);
            foreach (var support in supports)
            {
                var sourceSupport = (Referral)newSupports.Where(s => s.GetType() == support.GetType()).Single();

                var referral = support.ShouldBeAssignableTo<Referral>().ShouldNotBeNull();

                referral.Status.ShouldBe(sourceSupport.To < DateTime.UtcNow ? SupportStatus.Expired : SupportStatus.Active);

                if (sourceSupport.SupplierId != null)
                    referral.SupplierId.ShouldBe(sourceSupport.SupplierId);
                if (sourceSupport.IncludedHouseholdMembers.Any())
                    referral.IncludedHouseholdMembers.ShouldBe(sourceSupport.IncludedHouseholdMembers);
                if (sourceSupport.CreatedByTeamMemberId != null)
                    referral.CreatedByTeamMemberId.ShouldBe(sourceSupport.CreatedByTeamMemberId);

                referral.To.ShouldBe(sourceSupport.To);
                referral.IssuedToPersonName.ShouldBe(sourceSupport.IssuedToPersonName);
                referral.SupplierNotes.ShouldBe(sourceSupport.SupplierNotes);
                referral.CreatedByTeamMemberId.ShouldBe(sourceSupport.CreatedByTeamMemberId);
                referral.Status.ShouldBe(sourceSupport.To < DateTime.UtcNow ? SupportStatus.Expired : SupportStatus.Active);
                referral.IncludedHouseholdMembers.ShouldBe(sourceSupport.IncludedHouseholdMembers);
                referral.SupplierId.ShouldBe(sourceSupport.SupplierId);
                referral.ExternalReferenceId.ShouldBeNull();
                referral.IssuedByDisplayName.ShouldBeNull();
                referral.CreatedOn.ShouldBeInRange(now, DateTime.UtcNow);
                referral.IssuedOn.ShouldBe(referral.CreatedOn);
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
               new ClothingReferral
               {
                   SupplierId = TestData.SupplierAId,
                   SupplierNotes = $"{uniqueId}-paper-notes",
                   CreatedByTeamMemberId = TestData.Tier4TeamMemberId,
                   IssuedToPersonName = "test person",
                   IncludedHouseholdMembers = householdMembers,
                   From = issueDate.AddDays(-10),
                   To = issueDate.AddDays(-3),
                   IssuedOn = issueDate,
                   ExternalReferenceId = $"{uniqueId}-paperreferral",
                   IssuedByDisplayName =   "autotest R"
               },
               new IncidentalsReferral
               {
                   SupplierId = TestData.SupplierAId,
                   SupplierNotes = $"{uniqueId}-paper-notes",
                   CreatedByTeamMemberId = TestData.Tier4TeamMemberId,
                   IssuedToPersonName = "test person",
                   IncludedHouseholdMembers = householdMembers,
                   From = issueDate.AddDays(-10),
                   To = issueDate.AddDays(-3),
                   IssuedOn = issueDate,
                   ExternalReferenceId = $"{uniqueId}-paperreferral",
                   IssuedByDisplayName =   "autotest R"
               }
            };

            var newSupportIds = (await supportRepository.Manage(new SaveEvacuationFileSupportCommand { FileId = evacuationFileId, Supports = paperSupports })).Id.Split(';');
            newSupportIds.Length.ShouldBe(paperSupports.Length);

            var supports = (await supportRepository.Query(new SearchSupportsQuery { ByEvacuationFileId = evacuationFileId }))
                .Items.Where(s => s is Referral r && (r.SupplierNotes ?? string.Empty).StartsWith(uniqueId))
                .ToArray();
            supports.Length.ShouldBeGreaterThanOrEqualTo(paperSupports.Length);
            foreach (var support in supports)
            {
                var sourceSupport = (Referral)paperSupports.Where(s => s.GetType() == support.GetType()).Single();

                var referral = support.ShouldBeAssignableTo<Referral>().ShouldNotBeNull();

                referral.Status.ShouldBe(sourceSupport.To < DateTime.UtcNow ? SupportStatus.Expired : SupportStatus.Active);

                if (sourceSupport.SupplierId != null)
                    referral.SupplierId.ShouldBe(sourceSupport.SupplierId);
                if (sourceSupport.IncludedHouseholdMembers.Any())
                    referral.IncludedHouseholdMembers.ShouldBe(sourceSupport.IncludedHouseholdMembers);
                if (sourceSupport.CreatedByTeamMemberId != null)
                    referral.CreatedByTeamMemberId.ShouldBe(sourceSupport.CreatedByTeamMemberId);

                referral.To.ShouldBe(sourceSupport.To);
                referral.IssuedToPersonName.ShouldBe(sourceSupport.IssuedToPersonName);
                referral.SupplierNotes.ShouldBe(sourceSupport.SupplierNotes);
                referral.CreatedByTeamMemberId.ShouldBe(sourceSupport.CreatedByTeamMemberId);
                referral.Status.ShouldBe(sourceSupport.To < DateTime.UtcNow ? SupportStatus.Expired : SupportStatus.Active);
                referral.IncludedHouseholdMembers.ShouldBe(sourceSupport.IncludedHouseholdMembers);
                referral.SupplierId.ShouldBe(sourceSupport.SupplierId);
                referral.ExternalReferenceId.ShouldNotBeNull().ShouldBe(sourceSupport.ExternalReferenceId);
                referral.IssuedByDisplayName.ShouldNotBeNull().ShouldBe(sourceSupport.IssuedByDisplayName);
                referral.CreatedOn.ShouldBeInRange(now, DateTime.UtcNow);
                referral.IssuedOn.ShouldBe(sourceSupport.IssuedOn);
            }
        }
    }
}
