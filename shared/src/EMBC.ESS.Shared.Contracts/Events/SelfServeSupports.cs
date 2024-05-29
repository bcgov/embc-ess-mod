using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace EMBC.ESS.Shared.Contracts.Events.SelfServe;

public record CheckEligibileForSelfServeCommand : Command
{
    public string RegistrantUserId { get; set; }
    public string EvacuationFileNumber { get; set; }
}

public record EligibilityCheckQuery : Query<EligibilityCheckQueryResponse>
{
    public string RegistrantUserId { get; set; }
    public string EvacuationFileNumber { get; set; }
}

public record EligibilityCheckQueryResponse
{
    public SupportEligibility Eligibility { get; set; }
}

public record OptOutSelfServeCommand : Command
{
    public string RegistrantUserId { get; set; }
    public string EvacuationFileNumber { get; set; }
}

public record DraftSelfServeSupportQuery : Query<DraftSelfServeSupportQueryResponse>
{
    public string RegistrantUserId { get; set; }
    public string EvacuationFileNumber { get; set; }
    public IEnumerable<SelfServeSupport>? Items { get; set; }
}

public record DraftSelfServeSupportQueryResponse
{
    public IEnumerable<HouseholdMember> HouseholdMembers { get; set; } = [];
    public IEnumerable<SelfServeSupport> Items { get; set; } = [];
}

public record ProcessSelfServeSupportsCommand : Command
{
    public string RegistrantUserId { get; set; }
    public string EvacuationFileNumber { get; set; }
    public IEnumerable<SelfServeSupport> Supports { get; set; } = [];
    public ETransferDetails ETransferDetails { get; set; }
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
    public IEnumerable<string> IncludedHouseholdMembers { get; set; }
    public IEnumerable<DateOnly> Nights { get; set; } = [];
}

public record SelfServeFoodGroceriesSupport : SelfServeSupport
{
    public IEnumerable<string> IncludedHouseholdMembers { get; set; }
    public IEnumerable<DateOnly> Nights { get; set; } = [];
}

public record SelfServeFoodRestaurantSupport : SelfServeSupport
{
    public IEnumerable<string> IncludedHouseholdMembers { get; set; }
    public IEnumerable<SupportDayMeals> Meals { get; set; } = [];
}
public record SupportDayMeals(DateOnly Date)
{
    public bool? Breakfast { get; set; }
    public bool? Lunch { get; set; }
    public bool? Dinner { get; set; }
}

public record SelfServeIncidentalsSupport : SelfServeSupport
{
    public IEnumerable<string> IncludedHouseholdMembers { get; set; } = [];
}

public record SelfServeClothingSupport : SelfServeSupport
{
    public IEnumerable<string> IncludedHouseholdMembers { get; set; } = [];
}

public record ETransferDetails
{
    public string ContactEmail { get; set; }
    public string? ETransferEmail { get; set; }
    public string? ETransferMobile { get; set; }
    public string RecipientName { get; set; }
}

public record SupportEligibility
{
    public bool IsEligible { get; set; }
    public DateTimeOffset? From { get; set; }
    public DateTimeOffset? To { get; set; }
    public string TaskNumber { get; set; }
    public IEnumerable<SelfServeSupportSetting> SupportSettings { get; set; } = [];
}

public record SelfServeSupportSetting(SelfServeSupportType Type, SelfServeSupportEligibilityState State);

public enum SelfServeSupportType
{
    ShelterAllowance,
    FoodGroceries,
    FoodRestaurant,
    Incidentals,
    Clothing
}

public enum SelfServeSupportEligibilityState
{
    Available,
    Unavailable,
    NotAvailableOneTimeUsed
}
