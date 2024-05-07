using System;
using System.Collections.Generic;
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

        public static IEnumerable<object[]> GenerateTestCases()
        {
            yield return new[] { new ClothingSupport { SupportDelivery = new Referral(), TotalAmount = 100m }, new ClothingSupport { SupportDelivery = new Interac(), TotalAmount = 100m } };
            yield return new object[] { new ShelterHotelSupport { SupportDelivery = new Referral(), NumberOfNights = 3, NumberOfRooms = 3 }, new ShelterAllowanceSupport { SupportDelivery = new Interac(), TotalAmount = 100m } };
            yield return new object[] { new FoodRestaurantSupport { SupportDelivery = new Referral() }, new FoodGroceriesSupport { SupportDelivery = new Interac(), TotalAmount = 100m } };
        }

        [Theory]
        [MemberData(nameof(GenerateTestCases))]
        public async Task CheckSupportComplianceRequest_OneDuplicate_FlagReturned(Support initialSupport, Support duplicatedSupport)

        {
            var fileId = TestData.EvacuationFileId;
            var householdMembers = TestData.HouseholdMemberIds;
            //var initialSupport = new ShelterHotelSupport { FileId = fileId, SupportDelivery = new Referral(), NumberOfNights = 3, NumberOfRooms = 3 };
            //var duplicatedSupport = new ShelterAllowanceSupport { FileId = fileId, SupportDelivery = new Interac(), TotalAmount = 100m };
            await DuplicateCheck(fileId, householdMembers, initialSupport, duplicatedSupport, TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(5));
        }

        private async Task DuplicateCheck(string fileId, IEnumerable<string> householdMembers, Support initialSupport, Support dupicatedSupport, TimeSpan fromTimeGap, TimeSpan toTimeGap)
        {
            var from = DateTime.UtcNow.AddDays(-3);
            var to = DateTime.UtcNow.AddDays(1);
            IEnumerable<Support> supports = [initialSupport];
            foreach (var support in supports)
            {
                support.FileId = fileId;
                support.From = from;
                support.To = to;
                support.IncludedHouseholdMembers = householdMembers;
                support.CreatedBy = new TeamMember { Id = TestData.Tier4TeamMemberId };
            }

            var firstSupport = ((ProcessDigitalSupportsResponse)await engine.Process(new ProcessDigitalSupportsRequest
            {
                FileId = fileId,
                Supports = supports,
                RequestingUserId = TestData.Tier4TeamMemberId
            })).Supports.ShouldHaveSingleItem();

            supports = [dupicatedSupport];
            foreach (var support in supports)
            {
                support.FileId = fileId;
                support.From = from.Add(fromTimeGap);
                support.To = to.Add(toTimeGap);
                support.IncludedHouseholdMembers = householdMembers;
                support.CreatedBy = new TeamMember { Id = TestData.Tier4TeamMemberId };
            }

            var secondSupport = ((ProcessDigitalSupportsResponse)await engine.Process(new ProcessDigitalSupportsRequest
            {
                FileId = fileId,
                Supports = supports,
                RequestingUserId = TestData.Tier4TeamMemberId
            })).Supports.ShouldHaveSingleItem();

            var response = (CheckSupportComplianceResponse)await engine.Validate(new CheckSupportComplianceRequest { Supports = [secondSupport] });
            var flags = response.Flags.ShouldHaveSingleItem();
            flags.Key.Id.ShouldBe(secondSupport.Id);
            flags.Value.Where(f => f is DuplicateSupportFlag d && d.DuplicatedSupportId == firstSupport.Id).ShouldHaveSingleItem();
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
