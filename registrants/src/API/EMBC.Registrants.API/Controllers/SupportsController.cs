using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Registrants.API.Controllers;

[Route("api/Evacuations/{fileReferenceNumber}/[controller]")]
[ApiController]
[Authorize]
public class SupportsController : ControllerBase
{
    [HttpGet("draft")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<SelfServeSupport>>> GetDraftSupports(string fileReferenceNumber, CancellationToken ct)
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

    [HttpPost("draft/totals")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<SelfServeSupport>>> CalculateAmounts(string fileReferenceNumber, IEnumerable<SelfServeSupport> supports, CancellationToken ct)
    {
        await Task.CompletedTask;
        return Ok(supports.Select(s => { s.TotalAmount = 100.00; return s; }));
    }

    [HttpPost("optout")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> OptOut(string fileReferenceNumber, CancellationToken ct)
    {
        await Task.CompletedTask;
        return Ok();
    }

    [HttpPost("")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> SubmitSupports(string fileReferenceNumber, SubmitSupportsRequest request, CancellationToken ct)
    {
        await Task.CompletedTask;
        return Ok();
    }
}

public record SubmitSupportsRequest
{
    public string FileReferenceNumber { get; set; }
    public IEnumerable<SelfServeSupport> Supports { get; set; }
    public ETransferDetails ETransferDetails { get; set; }
}

public record ETransferDetails
{
    public string? ContactEmail { get; set; }
    public string? ETransferEmail { get; set; }
    public string? ETransferMobile { get; set; }
    public string RecipientName { get; set; }
}

[JsonDerivedType(typeof(SelfServeShelterAllowanceSupport), typeDiscriminator: nameof(SelfServeShelterAllowanceSupport))]
[JsonDerivedType(typeof(SelfServeFoodGroceriesSupport), typeDiscriminator: nameof(SelfServeFoodGroceriesSupport))]
[JsonDerivedType(typeof(SelfServeFoodRestaurantSupport), typeDiscriminator: nameof(SelfServeFoodRestaurantSupport))]
[JsonDerivedType(typeof(SelfServeIncidentalsSupport), typeDiscriminator: nameof(SelfServeIncidentalsSupport))]
[JsonDerivedType(typeof(SelfServeClothingSupport), typeDiscriminator: nameof(SelfServeClothingSupport))]
public abstract record SelfServeSupport
{
    public double? TotalAmount { get; set; }
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
