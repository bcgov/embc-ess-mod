using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Registrants.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SupportsController : ControllerBase
{
    [HttpGet("{evacuationFileId}/supports/draft")]
    public async Task<ActionResult<IEnumerable<SelfServeSupport>>> GetDraftSupports(string evacuationFileId, CancellationToken ct)
    {
        await Task.CompletedTask;
        var fromDate = DateTime.UtcNow;
        var toDate = fromDate.AddHours(72);
        var days = Enumerable.Range(0, 1 + toDate.Subtract(fromDate).Days).Select(offset => fromDate.AddDays(offset)).Select(DateOnly.FromDateTime).ToArray();
        var householdMembers = new[] { "1", "2", "3" };

        return new SelfServeSupport[]
        {
            new SelfServeFoodGroceriesSupport { Nights = days.Select(d=>new SupportDay(d, householdMembers)) },
            new SelfServeFoodRestaurantSupport { IncludedHouseholdMembers = householdMembers, Meals = days.Select(d=>new SupportDayMeals(d, true, true, true)) },
            new SelfServeShelterAllowanceSupport { Nights = days.Select(d=>new SupportDay(d, householdMembers)) },
            new SelfServeClothingSupport { IncludedHouseholdMembers = householdMembers  },
            new SelfServeIncidentalsSupport { IncludedHouseholdMembers = householdMembers }
        };
    }
}

[JsonDerivedType(typeof(SelfServeShelterAllowanceSupport), typeDiscriminator: nameof(SelfServeShelterAllowanceSupport))]
[JsonDerivedType(typeof(SelfServeFoodGroceriesSupport), typeDiscriminator: nameof(SelfServeFoodGroceriesSupport))]
[JsonDerivedType(typeof(SelfServeFoodRestaurantSupport), typeDiscriminator: nameof(SelfServeFoodRestaurantSupport))]
[JsonDerivedType(typeof(SelfServeIncidentalsSupport), typeDiscriminator: nameof(SelfServeIncidentalsSupport))]
[JsonDerivedType(typeof(SelfServeClothingSupport), typeDiscriminator: nameof(SelfServeClothingSupport))]
public abstract record SelfServeSupport
{
}

public record SelfServeShelterAllowanceSupport : SelfServeSupport
{
    public IEnumerable<SupportDay> Nights { get; set; }
}

public record SupportDay(DateOnly Date, IEnumerable<string> IncludedHouseholdMembers);

public record SelfServeFoodGroceriesSupport : SelfServeSupport
{
    public IEnumerable<SupportDay> Nights { get; set; }
}

public record SelfServeFoodRestaurantSupport : SelfServeSupport
{
    public IEnumerable<string> IncludedHouseholdMembers { get; set; }
    public IEnumerable<SupportDayMeals> Meals { get; set; }
}
public record SupportDayMeals(DateOnly Date, bool Breakfast, bool Dinner, bool Lunch);

public record SelfServeIncidentalsSupport : SelfServeSupport
{
    public IEnumerable<string> IncludedHouseholdMembers { get; set; }
}

public record SelfServeClothingSupport : SelfServeSupport
{
    public IEnumerable<string> IncludedHouseholdMembers { get; set; }
}
