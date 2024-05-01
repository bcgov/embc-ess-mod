using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;
using EMBC.Utilities.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Registrants.API.Controllers;

[Route("api/Evacuations/{evacuationFileId}/Supports")]
[ApiController]
[Authorize]
public class SupportsController(IMessagingClient messagingClient, IMapper mapper) : ControllerBase
{
    /// <summary>
    /// Checks if a file is eligible for self-serve supports
    /// </summary>
    /// <param name="evacuationFileId">The file id to check</param>
    /// <param name="ct"></param>
    /// <returns>A decision if the file is eligibile or not</returns>
    [HttpGet("eligible")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    public async Task<ActionResult<EligibilityCheck>> CheckSelfServeEligibility(string evacuationFileId, CancellationToken ct)
    {
        await messagingClient.Send(new CheckEligibileForSelfServeCommand { EvacuationFileId = evacuationFileId }, ct);
        var eligilityCheck = (await messagingClient.Send(new EligibilityCheckQuery { EvacuationFileId = evacuationFileId }, ct)).Eligibility;
        return Ok(new EligibilityCheck
        {
            EvacuationFileId = evacuationFileId,
            IsEligable = eligilityCheck.IsEligible,
            From = eligilityCheck.From?.DateTime,
            To = eligilityCheck.To?.DateTime,
            TaskNumber = eligilityCheck.TaskNumber
        });
    }

    [HttpGet("draft")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<DraftSupports>> GetDraftSupports(string evacuationFileId, CancellationToken ct)
    {
        var response = await messagingClient.Send(new DraftSelfServeSupportQuery { EvacuationFileId = evacuationFileId }, ct);

        return Ok(mapper.Map<DraftSupports>(response));
    }

    [HttpPost("draft")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<SelfServeSupport>>> CalculateAmounts(string evacuationFileId, IEnumerable<SelfServeSupport> supports, CancellationToken ct)
    {
        var response = await messagingClient.Send(new DraftSelfServeSupportQuery { EvacuationFileId = evacuationFileId, Items = mapper.Map<IEnumerable<ESS.Shared.Contracts.Events.SelfServe.SelfServeSupport>>(supports) }, ct);

        return Ok(mapper.Map<IEnumerable<SelfServeSupport>>(response.Items));
    }

    [HttpPost("optout")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> OptOut(string evacuationFileId, CancellationToken ct)
    {
        await messagingClient.Send(new OptOutSelfServeCommand { EvacuationFileId = evacuationFileId }, ct);
        return Ok();
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<Results<Ok, BadRequest<string>>> SubmitSupports(string evacuationFileId, SubmitSupportsRequest request, CancellationToken ct)
    {
        if (evacuationFileId != request.EvacuationFileId) return TypedResults.BadRequest(evacuationFileId);
        await messagingClient.Send(new ProcessSelfServeSupportsCommand
        {
            EvacuationFileId = evacuationFileId,
            Supports = mapper.Map<IEnumerable<ESS.Shared.Contracts.Events.SelfServe.SelfServeSupport>>(request.Supports),
            ETransferDetails = mapper.Map<ESS.Shared.Contracts.Events.SelfServe.ETransferDetails>(request.ETransferDetails)
        }, ct);
        return TypedResults.Ok();
    }
}

public record SubmitSupportsRequest
{
    public string EvacuationFileId { get; set; }
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

public record EligibilityCheck
{
    public bool IsEligable { get; set; }
    public string EvacuationFileId { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
    public string? TaskNumber { get; set; }
}

public record DraftSupports
{
    public IEnumerable<SelfServeSupport> Items { get; set; } = Array.Empty<SelfServeSupport>();
    public IEnumerable<HouseholdMember> HouseholdMembers { get; set; } = Array.Empty<HouseholdMember>();
}

[JsonDerivedType(typeof(SelfServeShelterAllowanceSupport), typeDiscriminator: nameof(SelfServeShelterAllowanceSupport))]
[JsonDerivedType(typeof(SelfServeFoodGroceriesSupport), typeDiscriminator: nameof(SelfServeFoodGroceriesSupport))]
[JsonDerivedType(typeof(SelfServeFoodRestaurantSupport), typeDiscriminator: nameof(SelfServeFoodRestaurantSupport))]
[JsonDerivedType(typeof(SelfServeIncidentalsSupport), typeDiscriminator: nameof(SelfServeIncidentalsSupport))]
[JsonDerivedType(typeof(SelfServeClothingSupport), typeDiscriminator: nameof(SelfServeClothingSupport))]
public abstract record SelfServeSupport
{
    public double? TotalAmount { get; set; }
    public abstract SelfServeSupportType Type { get; }
}

public record SelfServeShelterAllowanceSupport : SelfServeSupport
{
    public IEnumerable<SupportDay> Nights { get; set; } = Array.Empty<SupportDay>();
    public override SelfServeSupportType Type => SelfServeSupportType.ShelterAllowance;
}

public record SupportDay(DateOnly Date, IEnumerable<string> IncludedHouseholdMembers);

public record SelfServeFoodGroceriesSupport : SelfServeSupport
{
    public IEnumerable<SupportDay> Nights { get; set; } = Array.Empty<SupportDay>();
    public override SelfServeSupportType Type => SelfServeSupportType.FoodGroceries;
}

public record SelfServeFoodRestaurantSupport : SelfServeSupport
{
    public IEnumerable<string> IncludedHouseholdMembers { get; set; } = Array.Empty<string>();
    public IEnumerable<SupportDayMeals> Meals { get; set; }
    public override SelfServeSupportType Type => SelfServeSupportType.FoodRestaurant;
}
public record SupportDayMeals(DateOnly Date, bool Breakfast, bool Dinner, bool Lunch);

public record SelfServeIncidentalsSupport : SelfServeSupport
{
    public IEnumerable<string> IncludedHouseholdMembers { get; set; } = Array.Empty<string>();
    public override SelfServeSupportType Type => SelfServeSupportType.Incidentals;
}

public record SelfServeClothingSupport : SelfServeSupport
{
    public IEnumerable<string> IncludedHouseholdMembers { get; set; } = Array.Empty<string>();
    public override SelfServeSupportType Type => SelfServeSupportType.Clothing;
}

public enum SelfServeSupportType
{
    ShelterAllowance,
    FoodGroceries,
    FoodRestaurant,
    Incidentals,
    Clothing
}
