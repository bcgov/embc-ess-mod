using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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
    private string currentUserId => User.FindFirstValue(JwtRegisteredClaimNames.Sub);

    /// <summary>
    /// Checks if a file is eligible for self-serve supports
    /// </summary>
    /// <param name="evacuationFileId"></param>
    /// <param name="ct"></param>
    /// <returns>Eligiility results</returns>
    [HttpGet("eligible")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize]
    public async Task<ActionResult<EligibilityCheck>> CheckSelfServeEligibility(string evacuationFileId, CancellationToken ct)
    {
        await messagingClient.Send(new CheckEligibileForSelfServeCommand
        {
            RegistrantUserId = currentUserId,
            EvacuationFileNumber = evacuationFileId
        }, ct);
        var eligilityCheck = (await messagingClient.Send(new EligibilityCheckQuery
        {
            RegistrantUserId = currentUserId,
            EvacuationFileNumber = evacuationFileId
        }, ct)).Eligibility;

        return Ok(new EligibilityCheck
        {
            EvacuationFileId = evacuationFileId,
            IsEligable = eligilityCheck.IsEligible,
            From = eligilityCheck.From?.DateTime.ToUniversalTime(),
            To = eligilityCheck.To?.DateTime.ToUniversalTime(),
            TaskNumber = eligilityCheck.TaskNumber,
            SupportSettings = mapper.Map<IEnumerable<SelfServeSupportSetting>>(eligilityCheck.SupportSettings)
        });
    }

    /// <summary>
    /// Calculate self serve supports for a file
    /// </summary>
    /// <param name="evacuationFileId"></param>
    /// <param name="ct"></param>
    /// <returns>Self serve support details</returns>
    [HttpGet("draft")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<DraftSupports>> GetDraftSupports(string evacuationFileId, CancellationToken ct)
    {
        var response = await messagingClient.Send(new DraftSelfServeSupportQuery
        {
            RegistrantUserId = currentUserId,
            EvacuationFileNumber = evacuationFileId
        }, ct);

        return Ok(mapper.Map<DraftSupports>(response));
    }

    /// <summary>
    /// Calculate the self serve supports amounts for a file
    /// </summary>
    /// <param name="evacuationFileId"></param>
    /// <param name="supports"></param>
    /// <param name="ct"></param>
    /// <returns>Self serve support details</returns>
    [HttpPost("draft")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<SelfServeSupport>>> CalculateAmounts(string evacuationFileId, IEnumerable<SelfServeSupport> supports, CancellationToken ct)
    {
        var response = await messagingClient.Send(new DraftSelfServeSupportQuery
        {
            RegistrantUserId = currentUserId,
            EvacuationFileNumber = evacuationFileId,
            Items = mapper.Map<IEnumerable<ESS.Shared.Contracts.Events.SelfServe.SelfServeSupport>>(supports)
        }, ct);

        return Ok(mapper.Map<IEnumerable<SelfServeSupport>>(response.Items));
    }

    /// <summary>
    /// Opt out of self serve supports
    /// </summary>
    /// <param name="evacuationFileId"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpPost("optout")]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> OptOut(string evacuationFileId, CancellationToken ct)
    {
        await messagingClient.Send(new OptOutSelfServeCommand
        {
            RegistrantUserId = currentUserId,
            EvacuationFileNumber = evacuationFileId
        }, ct);
        return Ok();
    }

    /// <summary>
    /// Submit self serve supports
    /// </summary>
    /// <param name="evacuationFileId"></param>
    /// <param name="request"></param>
    /// <param name="ct"></param>
    /// <returns></returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<Results<Ok, BadRequest<string>>> SubmitSupports(string evacuationFileId, SubmitSupportsRequest request, CancellationToken ct)
    {
        if (evacuationFileId != request.EvacuationFileId) return TypedResults.BadRequest(evacuationFileId);
        await messagingClient.Send(new ProcessSelfServeSupportsCommand
        {
            RegistrantUserId = currentUserId,
            EvacuationFileNumber = evacuationFileId,
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
    public IEnumerable<SelfServeSupportSetting> SupportSettings { get; set; }
}

public record SelfServeSupportSetting(SelfServeSupportType Type, SelfServeSupportEligibilityState State);

public record DraftSupports
{
    public IEnumerable<SelfServeSupport> Items { get; set; } = [];
    public IEnumerable<HouseholdMember> HouseholdMembers { get; set; } = [];
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
    public IEnumerable<string> IncludedHouseholdMembers { get; set; } = [];
    public IEnumerable<DateOnly> Nights { get; set; } = [];
    public override SelfServeSupportType Type => SelfServeSupportType.ShelterAllowance;
}

public record SelfServeFoodGroceriesSupport : SelfServeSupport
{
    public IEnumerable<string> IncludedHouseholdMembers { get; set; } = [];
    public IEnumerable<DateOnly> Nights { get; set; } = [];
    public override SelfServeSupportType Type => SelfServeSupportType.FoodGroceries;
}

public record SelfServeFoodRestaurantSupport : SelfServeSupport
{
    public IEnumerable<string> IncludedHouseholdMembers { get; set; } = [];
    public IEnumerable<SupportDayMeals> Meals { get; set; } = [];
    public override SelfServeSupportType Type => SelfServeSupportType.FoodRestaurant;
}

public record SupportDayMeals
{
    public DateOnly Date { get; set; }
    public bool Breakfast { get; set; }
    public bool Dinner { get; set; }
    public bool Lunch { get; set; }
}

public record SelfServeIncidentalsSupport : SelfServeSupport
{
    public IEnumerable<string> IncludedHouseholdMembers { get; set; } = [];
    public override SelfServeSupportType Type => SelfServeSupportType.Incidentals;
}

public record SelfServeClothingSupport : SelfServeSupport
{
    public IEnumerable<string> IncludedHouseholdMembers { get; set; } = [];
    public override SelfServeSupportType Type => SelfServeSupportType.Clothing;
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SelfServeSupportType
{
    ShelterAllowance,
    FoodGroceries,
    FoodRestaurant,
    Incidentals,
    Clothing
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum SelfServeSupportEligibilityState
{
    Available,
    Unavailable,
    UnavailableOneTimeUsed
}
