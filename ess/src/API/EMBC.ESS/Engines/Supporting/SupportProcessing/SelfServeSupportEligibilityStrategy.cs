using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using EMBC.ESS.Utilities.Spatial;
using EMBC.Utilities.Extensions;

namespace EMBC.ESS.Engines.Supporting.SupportProcessing;

internal class SelfServeSupportEligibilityStrategy(IEssContextFactory essContextFactory, ILocationService locationService) : ISupportProcessingStrategy
{
    private const int LocationAccuracyThreshold = 90;
    private const int MaximumNumberOfHouseholdMember = 5;
    private static readonly TimeSpan SupportsPeriod = TimeSpan.FromHours(72);
    private static bool isProduction = Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT") == "Production" || Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production";

    public Task<ProcessResponse> Process(ProcessRequest request, CancellationToken ct) =>
        request switch
        {
            _ => throw new NotImplementedException($"{request.GetType().Name}")
        };

    public async Task<ValidationResponse> Validate(ValidationRequest request, CancellationToken ct) =>
        request switch
        {
            ValidateSelfServeSupportsEligibility r => new ValidateSelfServeSupportsEligibilityResponse(await ValidateEligibility(r, ct)),

            _ => throw new NotImplementedException($"{request.GetType().Name}")
        };

    private async Task<SelfServeSupportEligibility> ValidateEligibility(ValidateSelfServeSupportsEligibility request, CancellationToken ct)
    {
        var ctx = essContextFactory.Create();
        var file = await ctx.era_evacuationfiles
            .Expand(f => f.era_CurrentNeedsAssessmentid)
            .Expand(f => f.era_CurrentNeedsAssessmentid.era_TaskNumber)
            .Expand(f => f.era_CurrentNeedsAssessmentid.era_EligibilityCheck)
            .Expand(f => f.era_Registrant)
            .Expand(f => f.era_Registrant.era_BCSCAddress)
            .Where(f => f.era_name == request.EvacuationFileId).SingleOrDefaultAsync();

        if (file == null) throw new InvalidOperationException($"File {request.EvacuationFileId} not found");
        await ctx.LoadPropertyAsync(file.era_CurrentNeedsAssessmentid, nameof(era_needassessment.era_era_householdmember_era_needassessment), ct);

        var registrant = file.era_Registrant;
        if (registrant == null) throw new InvalidOperationException($"File {request.EvacuationFileId} has no primary registrant");

        var needsAssessment = file.era_CurrentNeedsAssessmentid;
        if (needsAssessment == null) throw new InvalidOperationException($"File {request.EvacuationFileId} has no needs assesment");

        // check maximum number of household members
        if (registrant.birthdate.HasValue && ((DateTime)file.era_Registrant.birthdate.Value).IsMinor()) return NotEligible("Registrant is a minor");
        if (needsAssessment.era_era_householdmember_era_needassessment.Count > MaximumNumberOfHouseholdMember) return NotEligible($"File has more than {MaximumNumberOfHouseholdMember} household members");

        // check home address eligibility
        var homeAddress = registrant.era_BCSCAddress;
        if (homeAddress == null) return NotEligible("Registarnt has no home address");
        if (homeAddress.era_latitude == null || homeAddress.era_longitude == null) return NotEligible("Home address has no coordinates", referencedHomeAddressId: homeAddress.era_bcscaddressid);
        if (homeAddress.era_geocodescore.HasValue && homeAddress.era_geocodescore.Value < LocationAccuracyThreshold)
            return NotEligible($"Home address has geocode score less than {LocationAccuracyThreshold}", referencedHomeAddressId: homeAddress.era_bcscaddressid);

        // search for a task number
        var taskNumber = await GetTaskNumberForAddress(homeAddress, ct);
        if (taskNumber == null) return NotEligible("No suitable task found for home address", referencedHomeAddressId: homeAddress.era_bcscaddressid);

        // check the task is enabled for self-serve
        var task = await ctx.era_tasks
            .Expand(t => t.era_era_task_era_selfservesupportlimits_Task)
            .Where(t => t.era_name == taskNumber && t.statuscode == 1).SingleOrDefaultAsync(ct);

        if (task == null) return NotEligible($"Task {taskNumber} was not found or not active in Dynamics", referencedHomeAddressId: homeAddress.era_bcscaddressid);
        if (!task.era_selfservetoggle.GetValueOrDefault()) return NotEligible($"Task {taskNumber} is not enabled for self-serve");
        await ctx.LoadPropertyAsync(task, nameof(era_task.era_era_task_era_selfservesupportlimits_Task), ct);

        var enabledSupports = GetEnabledSupportTypesForTask(task).ToArray();
        if (enabledSupports.Length == 0) return NotEligible("Task has no supports enabled for self serve", taskNumber: taskNumber, referencedHomeAddressId: homeAddress.era_bcscaddressid);

        // calculate support eligibility period
        var eligibleFrom = DateTimeOffset.UtcNow;
        var eligibleTo = eligibleFrom.Add(SupportsPeriod);
        if (eligibleTo > task.era_taskenddate) eligibleTo = task.era_taskenddate.Value.ToUniversalTime();

        var needs = GetIdentifiedNeeds(needsAssessment).ToArray();

        // check if any needs were requested
        if (needs.Length == 0) return Eligible(taskNumber: taskNumber, referencedHomeAddressId: homeAddress.era_bcscaddressid.Value, from: eligibleFrom, to: eligibleTo, eligibleSupportTypes: []);

        // check if requested supports include referrals
        if (needs.Contains(IdentifiedNeed.ShelterReferral)) return NotEligible("Evacuee requested support referrals", taskNumber: taskNumber, referencedHomeAddressId: homeAddress.era_bcscaddressid, from: eligibleFrom, to: eligibleTo);

        // check for disabled supports
        var (eligibleSupports, ineligibleSupports) = GenerateSelfServeSupportTypesEligibility(needs, enabledSupports);
        if (ineligibleSupports.Any()) return NotEligible($"Requested supports are not enabled: {string.Join(",", ineligibleSupports)}", taskNumber: taskNumber, referencedHomeAddressId: homeAddress.era_bcscaddressid);

        // add - duplicate check
        var similarSupportTypes = needs.SelectMany(t => MapNeedToSupportType(t)).Cast<int>().ToList();
        foreach (var hm in needsAssessment.era_era_householdmember_era_needassessment)
        {
            var supports = (await ctx.era_evacueesupports
                .WhereNotIn(s => s.statuscode.Value, [(int)Resources.Supports.SupportStatus.Cancelled, (int)Resources.Supports.SupportStatus.Void])
                .WhereIn(s => s.era_supporttype.Value, similarSupportTypes)
                .Where(s =>
                    s.era_era_householdmember_era_evacueesupport.Any(h => h.era_dateofbirth == hm.era_dateofbirth && h.era_firstname == hm.era_firstname && h.era_lastname == hm.era_lastname) &&
                    ((s.era_validfrom >= eligibleFrom && s.era_validfrom <= eligibleTo) || (s.era_validto >= eligibleFrom && s.era_validto <= eligibleTo) || (s.era_validfrom < eligibleFrom && s.era_validto > eligibleTo)))
                .GetAllPagesAsync(ct))
                .Select(s => s.era_name)
                .ToList();

            if (supports.Any()) return NotEligible($"Duplicate supports found {string.Join(",", supports)}", taskNumber: taskNumber, referencedHomeAddressId: homeAddress.era_bcscaddressid, from: eligibleFrom, to: eligibleTo);
        }

        // return eligibility results
        return Eligible(taskNumber, homeAddress.era_bcscaddressid.Value, eligibleFrom, eligibleTo, eligibleSupports);
    }

    private static IEnumerable<IdentifiedNeed> GetIdentifiedNeeds(era_needassessment needsAssessment)
    {
        if (needsAssessment.era_canevacueeprovideincidentals.GetValueOrDefault(0) == (int)NeedTrueFalse.False) yield return IdentifiedNeed.Incidentals;
        if (needsAssessment.era_canevacueeprovideclothing.GetValueOrDefault(0) == (int)NeedTrueFalse.False) yield return IdentifiedNeed.Clothing;
        if (needsAssessment.era_canevacueeprovidefood.GetValueOrDefault(0) == (int)NeedTrueFalse.False) yield return IdentifiedNeed.Food;
        if (needsAssessment.era_shelteroptions.GetValueOrDefault(0) == (int)ShelterOptionSet.Allowance) yield return IdentifiedNeed.ShelterAllowance;
        if (needsAssessment.era_shelteroptions.GetValueOrDefault(0) == (int)ShelterOptionSet.Referral) yield return IdentifiedNeed.ShelterReferral;
    }

    private static (IEnumerable<SelfServeSupportType> eligibleSupports, IEnumerable<SelfServeSupportType> ineligibleSupports) GenerateSelfServeSupportTypesEligibility(IdentifiedNeed[] needs, SupportType[] enabledSupports)
    {
        var eligibleSupports = new List<SelfServeSupportType>();
        var ineligibleSupports = new List<SelfServeSupportType>();

        foreach (var need in needs)
        {
            switch (need)
            {
                case IdentifiedNeed.ShelterAllowance:
                    if (enabledSupports.Contains(SupportType.ShelterAllowance))
                        eligibleSupports.Add(SelfServeSupportType.ShelterAllowance);
                    else
                        ineligibleSupports.Add(SelfServeSupportType.ShelterAllowance);
                    break;

                case IdentifiedNeed.Incidentals:
                    if (enabledSupports.Contains(SupportType.Incidentals))
                        eligibleSupports.Add(SelfServeSupportType.Incidentals);
                    else
                        ineligibleSupports.Add(SelfServeSupportType.Incidentals);
                    break;

                case IdentifiedNeed.Clothing when !enabledSupports.Contains(SupportType.Clothing):
                    if (enabledSupports.Contains(SupportType.Clothing))
                        eligibleSupports.Add(SelfServeSupportType.Clothing);
                    else
                        ineligibleSupports.Add(SelfServeSupportType.Clothing);
                    break;

                case IdentifiedNeed.Food:
                    if (!enabledSupports.Contains(SupportType.FoodGroceries) && !enabledSupports.Contains(SupportType.FoodRestaurant))
                    {
                        // both support types are disabled
                        ineligibleSupports.AddRange([SelfServeSupportType.FoodGroceries, SelfServeSupportType.FoodRestaurant]);
                    }
                    else if (!enabledSupports.Contains(SupportType.FoodGroceries) && enabledSupports.Contains(SupportType.FoodRestaurant))
                    {
                        // groceries support type is disabled and restaurant is enabled
                        eligibleSupports.Add(SelfServeSupportType.FoodRestaurant);
                    }
                    else if (!enabledSupports.Contains(SupportType.FoodRestaurant) && enabledSupports.Contains(SupportType.FoodGroceries))
                    {
                        // restaurant support type is disabled and groceries is enabled
                        eligibleSupports.Add(SelfServeSupportType.FoodGroceries);
                    }
                    else
                    {
                        // both support types are enabled
                        eligibleSupports.AddRange([SelfServeSupportType.FoodGroceries, SelfServeSupportType.FoodRestaurant]);
                    }
                    break;
            }
        }
        return (eligibleSupports, ineligibleSupports);
    }

    private static IEnumerable<SupportType> GetEnabledSupportTypesForTask(era_task task)
    {
        return task.era_era_task_era_selfservesupportlimits_Task.Select(s => Enum.Parse<SupportType>(s.era_supporttypeoption.Value.ToString())).ToArray();
    }

    private static SupportType[] MapNeedToSupportType(IdentifiedNeed need) =>
     need switch
     {
         IdentifiedNeed.Food => [SupportType.FoodGroceries, SupportType.FoodRestaurant],
         IdentifiedNeed.ShelterAllowance or IdentifiedNeed.ShelterReferral => [SupportType.ShelterGroup, SupportType.ShelterAllowance, SupportType.ShelterHotel, SupportType.ShelterBilleting],
         IdentifiedNeed.Transportation => [SupportType.TransporationTaxi, SupportType.TransportationOther],
         IdentifiedNeed.Incidentals => [SupportType.Incidentals],
         IdentifiedNeed.Clothing => [SupportType.Clothing],

         _ => throw new NotImplementedException()
     };

    private async Task<string?> GetTaskNumberForAddress(era_bcscaddress address, CancellationToken ct)
    {
        var features = (await locationService.GetGeocodeAttributes(new Coordinates(address.era_latitude.Value, address.era_longitude.Value), ct));
        return features
            .FirstOrDefault(p => p.Any(a => a.Name == "PRODUCTION" && a.Value == (isProduction ? "Yes" : "No")) && p.Any(a => a.Name == "ESS_STATUS" && a.Value == "Active"))
            ?.FirstOrDefault(p => p.Name == "ESS_TASK_NUMBER")?.Value;
    }

    private static SelfServeSupportEligibility NotEligible(
        string reason,
        string? taskNumber = null,
        Guid? referencedHomeAddressId = null,
        DateTimeOffset? from = null,
        DateTimeOffset? to = null,
        IEnumerable<SelfServeSupportType>? eligibleSupportTypes = null) =>
        new SelfServeSupportEligibility(false, reason, taskNumber, referencedHomeAddressId?.ToString(), from, to, eligibleSupportTypes ?? []);

    private static SelfServeSupportEligibility Eligible(string taskNumber, Guid referencedHomeAddressId, DateTimeOffset from, DateTimeOffset to, IEnumerable<SelfServeSupportType> eligibleSupportTypes) =>
        new SelfServeSupportEligibility(true, null, taskNumber, referencedHomeAddressId.ToString(), from, to, eligibleSupportTypes);

    private enum NeedTrueFalse
    {
        True = 174360000,
        False = 174360001
    }

    private enum ShelterOptionSet
    {
        Allowance = 174360000,
        Referral = 174360001
    }

    private enum SupportType
    {
        FoodGroceries = 174360000,
        FoodRestaurant = 174360001,
        ShelterHotel = 174360002,
        ShelterBilleting = 174360003,
        ShelterGroup = 174360004,
        Incidentals = 174360005,
        Clothing = 174360006,
        TransporationTaxi = 174360007,
        TransportationOther = 174360008,
        ShelterAllowance = 174360009
    }
}
