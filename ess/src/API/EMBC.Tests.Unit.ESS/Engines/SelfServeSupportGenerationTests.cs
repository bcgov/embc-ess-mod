using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Engines.Supporting;
using EMBC.ESS.Engines.Supporting.SupportGeneration.SelfServe;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;
using EMBC.Utilities.Extensions;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.ESS.Engines;

public class SelfServeSupportGenerationTests
{
    private readonly SelfServeSupportGenerator strategy;
    private readonly DateTime startDate;
    private readonly DateTime endDate;
    private readonly IEnumerable<SelfServeHouseholdMember> householdMembers;
    private readonly DateOnly[] expectedDays;
    private readonly IEnumerable<string> expectedHouseholdMemberIds;

    public SelfServeSupportGenerationTests()
    {
        strategy = new SelfServeSupportGenerator();

        startDate = new DateTime(2024, 5, 1, 12, 0, 0, DateTimeKind.Utc).ToPST();
        endDate = startDate.AddHours(72);
        householdMembers = Enumerable.Range(1, 5).Select(i => new SelfServeHouseholdMember(i.ToString(), false));
        expectedDays = [DateOnly.FromDateTime(startDate), DateOnly.FromDateTime(startDate.AddHours(24)), DateOnly.FromDateTime(startDate.AddHours(48))];
        expectedHouseholdMemberIds = householdMembers.Select(hm => hm.Id).ToList();
    }

    [Fact]
    public async Task Generate_ShelterAllowance_Created()
    {
        var support = await GenerateSelfServeSupports<SelfServeShelterAllowanceSupport>(IdentifiedNeed.ShelterAllowance);
        support.Nights.Select(n => n.Date).ShouldBe(expectedDays);
        foreach (var night in support.Nights)
        {
            night.IncludedHouseholdMembers.ShouldBe(expectedHouseholdMemberIds);
        }
        support.TotalAmount.ShouldBe(170d);
    }

    [Fact]
    public async Task Generate_Incidentals_Created()
    {
        var support = await GenerateSelfServeSupports<SelfServeIncidentalsSupport>(IdentifiedNeed.Incidentals);
        support.IncludedHouseholdMembers.ShouldBe(expectedHouseholdMemberIds);
        support.TotalAmount.ShouldBe(250d);
    }

    [Fact]
    public async Task Generate_Clothing_Created()
    {
        var support = await GenerateSelfServeSupports<SelfServeClothingSupport>(IdentifiedNeed.Clothing);
        support.IncludedHouseholdMembers.ShouldBe(expectedHouseholdMemberIds);
        support.TotalAmount.ShouldBe(750d);
    }

    [Fact]
    public async Task Generate_FoodGroceries_Created()
    {
        var response = (GenerateSelfServeSupportsResponse)await strategy.Generate(new GenerateSelfServeSupports([IdentifiedNeed.Food], startDate, endDate, startDate, endDate, householdMembers), default);
        response.Supports.Count().ShouldBe(2);

        var groceries = (SelfServeFoodGroceriesSupport)response.Supports.Single(s => s is SelfServeFoodGroceriesSupport);
        groceries.Nights.Select(n => n.Date).ShouldBe(expectedDays);
        foreach (var night in groceries.Nights)
        {
            night.IncludedHouseholdMembers.ShouldBe(expectedHouseholdMemberIds);
        }
        groceries.TotalAmount.ShouldBe(337.5d);

        var restaurant = (SelfServeFoodRestaurantSupport)response.Supports.Single(s => s is SelfServeFoodRestaurantSupport);
        restaurant.IncludedHouseholdMembers.ShouldBe(expectedHouseholdMemberIds);
        // restaurant support days are different
        IEnumerable<DateOnly> mealsExpectedDays = [DateOnly.FromDateTime(startDate), DateOnly.FromDateTime(startDate.AddHours(24)), DateOnly.FromDateTime(startDate.AddHours(48)), DateOnly.FromDateTime(startDate.AddHours(72))];
        mealsExpectedDays = startDate.Hour >= 11 ? mealsExpectedDays : mealsExpectedDays.Prepend(DateOnly.FromDateTime(startDate.AddDays(-1)));
        restaurant.Meals.Select(m => m.Date).ShouldBe(mealsExpectedDays);
        var numberOfBreakfasts = restaurant.Meals.Aggregate(0, (n, m) => n + (m.Breakfast == true ? 1 : 0));
        var numberOfLunches = restaurant.Meals.Aggregate(0, (n, m) => n + (m.Lunch == true ? 1 : 0));
        var numberOfDinners = restaurant.Meals.Aggregate(0, (n, m) => n + (m.Dinner == true ? 1 : 0));
        numberOfBreakfasts.ShouldBe(3);
        numberOfLunches.ShouldBe(3);
        numberOfDinners.ShouldBe(3);
        restaurant.TotalAmount.ShouldBe(795d);
    }

    private async Task<T> GenerateSelfServeSupports<T>(IdentifiedNeed forNeed) where T : SelfServeSupport
    {
        var response = (GenerateSelfServeSupportsResponse)await strategy.Generate(new GenerateSelfServeSupports([forNeed], startDate, endDate, startDate, endDate, householdMembers), default);
        return response.Supports.ShouldHaveSingleItem().ShouldBeOfType<T>();
    }
}
