using System;
using System.Linq;
using EMBC.ESS.Engines.Supporting;
using EMBC.ESS.Shared.Contracts.Events;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Engines.Supporting
{
    public class ComplianceTests : DynamicsWebAppTestBase
    {
        private readonly ISupportingEngine engine;

        public ComplianceTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            engine = Services.GetRequiredService<ISupportingEngine>();
        }

        [Fact]
        public async Task CheckSupportComplianceRequest_OneDuplicate_FlagReturned()
        {
            var fileId = TestData.EvacuationFileId;
            var householdMembers = TestData.HouseholdMemberIds;

            var from = DateTime.UtcNow.AddDays(-3);
            var to = DateTime.UtcNow.AddDays(1);

            var supports = new Support[]
            {
                new ClothingSupport  { FileId = fileId, SupportDelivery = new Referral(), TotalAmount = 100.00m, ApproverName = "test approver" },
                new IncidentalsSupport  { FileId = fileId, SupportDelivery = new Referral(), TotalAmount = 100.00m, ApproverName = "test approver" },
            };

            foreach (var support in supports)
            {
                support.From = from;
                support.To = to;
                support.IncludedHouseholdMembers = householdMembers;
                support.CreatedBy = new TeamMember { Id = TestData.Tier4TeamMemberId };
            }

            var duplicateSupportId = ((ProcessDigitalSupportsResponse)await engine.Process(new ProcessDigitalSupportsRequest
            {
                FileId = fileId,
                Supports = supports,
                RequestingUserId = TestData.Tier4TeamMemberId
            })).Supports.Where(s => s is ClothingSupport).ShouldHaveSingleItem().Id;

            var checkedSupport = new ClothingSupport
            {
                FileId = fileId,
                SupportDelivery = new Interac(),
                TotalAmount = 100.00m,
                IncludedHouseholdMembers = householdMembers,
                From = from.AddMinutes(1),
                To = to.AddMinutes(1),
                CreatedBy = new TeamMember { Id = TestData.Tier4TeamMemberId }
            };

            checkedSupport.Id = ((ProcessDigitalSupportsResponse)await engine.Process(new ProcessDigitalSupportsRequest
            {
                FileId = fileId,
                Supports = new[] { checkedSupport },
                RequestingUserId = TestData.Tier4TeamMemberId
            })).Supports.ShouldHaveSingleItem().Id;

            var response = (CheckSupportComplianceResponse)await engine.Validate(new CheckSupportComplianceRequest { Supports = new[] { checkedSupport } });
            var flags = response.Flags.ShouldHaveSingleItem();
            flags.Key.Id.ShouldBe(checkedSupport.Id);
            flags.Value.Where(f => f is DuplicateSupportFlag d && d.DuplicatedSupportId == duplicateSupportId).ShouldHaveSingleItem();
        }

        [Fact]
        public async Task CheckSupportComplianceRequest_AmountExceeded_FlagReturned()
        {
            var fileId = TestData.EvacuationFileId;
            var householdMembers = TestData.HouseholdMemberIds;
            var from = DateTime.UtcNow.AddDays(-3);
            var to = DateTime.UtcNow.AddDays(1);

            var checkedSupport = new ClothingSupport
            {
                FileId = fileId,
                SupportDelivery = new Interac(),
                TotalAmount = 100.00m,
                IncludedHouseholdMembers = householdMembers,
                From = from,
                To = to,
                ApproverName = TestHelper.GenerateNewUniqueId(TestData.TestPrefix),
                CreatedBy = new TeamMember { Id = TestData.Tier4TeamMemberId }
            };

            checkedSupport.Id = ((ProcessDigitalSupportsResponse)await engine.Process(new ProcessDigitalSupportsRequest
            {
                FileId = fileId,
                Supports = new[] { checkedSupport },
                RequestingUserId = TestData.Tier4TeamMemberId
            })).Supports.ShouldHaveSingleItem().Id;

            var response = (CheckSupportComplianceResponse)await engine.Validate(new CheckSupportComplianceRequest { Supports = new[] { checkedSupport } });
            var flags = response.Flags.ShouldHaveSingleItem();
            flags.Key.Id.ShouldBe(checkedSupport.Id);
            flags.Value.Where(f => f is AmountExceededSupportFlag d && d.Approver == checkedSupport.ApproverName).ShouldHaveSingleItem();
        }
    }
}
