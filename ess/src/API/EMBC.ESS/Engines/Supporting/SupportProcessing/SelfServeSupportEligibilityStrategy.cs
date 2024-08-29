using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;
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

        var file = await GetFile(ctx, request.EvacuationFileId, ct);
        if (file == null) throw new InvalidOperationException($"File {request.EvacuationFileId} not found");

        var registrant = file.era_Registrant;
        if (registrant == null) throw new InvalidOperationException($"File {request.EvacuationFileId} has no primary registrant");

        var currentNeedsAssessment = file.era_CurrentNeedsAssessmentid;
        if (currentNeedsAssessment == null) throw new InvalidOperationException($"File {request.EvacuationFileId} has no needs assesment");

        // check maximum number of household members
        if (registrant.birthdate.HasValue && ((DateTime)file.era_Registrant.birthdate.Value).IsMinor()) return NotEligible("Registrant is a minor");
        if (currentNeedsAssessment.era_era_householdmember_era_needassessment.Count > MaximumNumberOfHouseholdMember) return NotEligible($"File has more than {MaximumNumberOfHouseholdMember} household members");

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
        var task = await GetTask(ctx, taskNumber, ct);
        if (task == null) return NotEligible($"Task {taskNumber} was not found or not active in Dynamics", referencedHomeAddressId: homeAddress.era_bcscaddressid);
        if (!task.era_selfservetoggle.GetValueOrDefault()) return NotEligible($"Task {taskNumber} is not enabled for self-serve");

        var enabledSupports = GetEnabledSupportTypesForTask(task).ToArray();
        if (enabledSupports.Length == 0) return NotEligible("Task has no supports enabled for self serve", taskNumber: taskNumber, referencedHomeAddressId: homeAddress.era_bcscaddressid);

        // calculate support eligibility period
        var eligibleFrom = DateTimeOffset.UtcNow;
        var eligibleTo = eligibleFrom.Add(SupportsPeriod);
        if (eligibleTo > task.era_taskenddate) eligibleTo = task.era_taskenddate.Value;

        var needs = GetIdentifiedNeeds(currentNeedsAssessment).ToArray();

        // check if any needs were requested
        if (needs.Length == 0) return Eligible(taskNumber: taskNumber, referencedHomeAddressId: homeAddress.era_bcscaddressid.Value, from: eligibleFrom, to: eligibleTo, eligibleSupportTypes: [], oneTimeUsedSupportTypes: []);

        // check if requested supports include referrals
        if (needs.Contains(IdentifiedNeed.ShelterReferral)) return NotEligible("Evacuee requested support referrals", taskNumber: taskNumber, referencedHomeAddressId: homeAddress.era_bcscaddressid, from: eligibleFrom, to: eligibleTo);

        // check all the previous supports expired
        var receivedSupports = file.era_era_evacuationfile_era_evacueesupport_ESSFileId.ToList();
        var notExpiredPastSupports = receivedSupports.Where(s => s.era_validto > eligibleFrom).ToList();
        if (notExpiredPastSupports.Count > 0) return NotEligible($"Supports {string.Join(",", notExpiredPastSupports.Select(s => s.era_name))} are still active",
            taskNumber: taskNumber, referencedHomeAddressId: homeAddress.era_bcscaddressid, from: eligibleFrom, to: eligibleTo);

        // check for disabled supports
        var (eligibleSupports, ineligibleSupports) = MapNeedsToSupportTypes(needs, enabledSupports);
        if (ineligibleSupports.Any())
        {
            return NotEligible($"Requested supports are not enabled: {string.Join(",", ineligibleSupports)}", taskNumber: taskNumber, referencedHomeAddressId: homeAddress.era_bcscaddressid);
        }

        // filter supports enabled for extensions
        var oneTimeSupportTypes = GetOnetimeEnabledSupportTypesForTask(task).SelectMany(s => GetMatchingTypesByCategory(s)).Distinct().Cast<int>().ToArray();
        var oneTimeReceivedSupportTypes = (await currentNeedsAssessment.era_era_householdmember_era_needassessment
            .SelectManyAsync(async hm => await GetPreviousOnetimeSupportsForHouseholdMember(ctx, hm, oneTimeSupportTypes, task.era_taskstartdate.Value, ct)))
            .Select(s => s.era_supporttype).Cast<SupportType>().SelectMany(s => GetMatchingTypesByCategory(s)).Distinct().ToList();

        var receivedSupportTypes = receivedSupports.Select(s => s.era_supporttype).Distinct().Cast<SupportType>().ToArray();
        receivedSupportTypes = receivedSupportTypes.Concat(oneTimeReceivedSupportTypes).Distinct().ToArray();
        var enabledSupportTypesForExtensions = GetExtensionEnabledSupportTypesForTask(task).ToArray();
        var (unusedSupportTypes, oneTimeUsedSupportTypes) = MapEligibleSupportTypesByUsage(eligibleSupports.ToArray(), receivedSupportTypes, enabledSupportTypesForExtensions);

        // check for overlapping supports
        var similarSupportTypes = needs.SelectMany(t => MapNeedToSupportType(t)).Cast<int>().ToArray();

        foreach (var hm in currentNeedsAssessment.era_era_householdmember_era_needassessment)
        {
            var overlappingSupports = (await GetDuplicateSupportsForHouseholdMember(ctx, hm, similarSupportTypes, eligibleFrom, eligibleTo, ct)).ToList();
            if (overlappingSupports.Count > 0)
            {
                return NotEligible($"Overlapping supports found for household member {hm.era_householdmemberid}: {string.Join(",", overlappingSupports.Select(s => s.era_name))}",
                    taskNumber: taskNumber, referencedHomeAddressId: homeAddress.era_bcscaddressid, from: eligibleFrom, to: eligibleTo);
            }
        }

        // check if household member composition changed from the last needs assessment
        var initialNeedsAssessment = ctx.era_needassessments
            .Expand(na => na.era_era_householdmember_era_needassessment)
            .Where(na => na.era_needassessmentid != currentNeedsAssessment.era_needassessmentid && na.era_EvacuationFile.era_evacuationfileid == file.era_evacuationfileid).OrderBy(na => na.createdon).FirstOrDefault();
        if (initialNeedsAssessment != null)
        {
            if (initialNeedsAssessment.era_era_householdmember_era_needassessment.Count < currentNeedsAssessment.era_era_householdmember_era_needassessment.Count)
            {
                // current needs assessment has more household members than previous needs assessment
                return NotEligible("Current needs assessment has more household members from the previous needs asessment",
                    taskNumber: taskNumber, referencedHomeAddressId: homeAddress.era_bcscaddressid, from: eligibleFrom, to: eligibleTo);
            }
#pragma warning disable S3267 // Loops should be simplified with "LINQ" expressions
            foreach (var householdMember in currentNeedsAssessment.era_era_householdmember_era_needassessment)
            {
                var previouseHouseholdMember = initialNeedsAssessment.era_era_householdmember_era_needassessment.SingleOrDefault(hm => hm.era_householdmemberid == householdMember.era_householdmemberid);
                if (previouseHouseholdMember == null)
                {
                    // not found in previous needs assessment
                    return NotEligible($"Household member {householdMember.era_householdmemberid}) not found in previous needs assessment",
                        taskNumber: taskNumber, referencedHomeAddressId: homeAddress.era_bcscaddressid, from: eligibleFrom, to: eligibleTo);
                }
                else if (householdMember.era_isprimaryregistrant != true)
                {
                    var history = (await ctx.audits
                        .Where(a => a.objecttypecode == nameof(era_householdmember) && a._objectid_value == householdMember.era_householdmemberid && a.createdon >= currentNeedsAssessment.createdon)
                        .GetAllPagesAsync(ct))
                        .ToList();

                    if (history.Any(a => a.action == 2))
                    {
                        // household member was modified in the current needs assessment
                        return NotEligible($"Household member {householdMember.era_householdmemberid} was modified",
                            taskNumber: taskNumber, referencedHomeAddressId: homeAddress.era_bcscaddressid, from: eligibleFrom, to: eligibleTo);
                    }
                }
            }
#pragma warning restore S3267 // Loops should be simplified with "LINQ" expressions
        }

        // return eligibility results
        return Eligible(taskNumber, homeAddress.era_bcscaddressid.Value, eligibleFrom, eligibleTo, unusedSupportTypes.Select(MapSupportTypeToSelfServeSupportType), oneTimeUsedSupportTypes.Select(MapSupportTypeToSelfServeSupportType));
    }

    private static IEnumerable<IdentifiedNeed> GetIdentifiedNeeds(era_needassessment needsAssessment)
    {
        if (needsAssessment.era_canevacueeprovideincidentals.GetValueOrDefault(0) == (int)NeedTrueFalse.False) yield return IdentifiedNeed.Incidentals;
        if (needsAssessment.era_canevacueeprovideclothing.GetValueOrDefault(0) == (int)NeedTrueFalse.False) yield return IdentifiedNeed.Clothing;
        if (needsAssessment.era_canevacueeprovidefood.GetValueOrDefault(0) == (int)NeedTrueFalse.False) yield return IdentifiedNeed.Food;
        if (needsAssessment.era_shelteroptions.GetValueOrDefault(0) == (int)ShelterOptionSet.Allowance) yield return IdentifiedNeed.ShelterAllowance;
        if (needsAssessment.era_shelteroptions.GetValueOrDefault(0) == (int)ShelterOptionSet.Referral) yield return IdentifiedNeed.ShelterReferral;
    }

    private static (IEnumerable<SupportType> eligibleSupports, IEnumerable<SupportType> ineligibleSupports) MapNeedsToSupportTypes(IdentifiedNeed[] needs, SupportType[] enabledSupports)
    {
        var eligibleSupports = new List<SupportType>();
        var ineligibleSupports = new List<SupportType>();

        foreach (var need in needs)
        {
            switch (need)
            {
                case IdentifiedNeed.ShelterAllowance:
                    if (enabledSupports.Contains(SupportType.ShelterAllowance))
                        eligibleSupports.Add(SupportType.ShelterAllowance);
                    else
                        ineligibleSupports.Add(SupportType.ShelterAllowance);
                    break;

                case IdentifiedNeed.Incidentals:
                    if (enabledSupports.Contains(SupportType.Incidentals))
                        eligibleSupports.Add(SupportType.Incidentals);
                    else
                        ineligibleSupports.Add(SupportType.Incidentals);
                    break;

                case IdentifiedNeed.Clothing:
                    if (enabledSupports.Contains(SupportType.Clothing))
                        eligibleSupports.Add(SupportType.Clothing);
                    else
                        ineligibleSupports.Add(SupportType.Clothing);
                    break;

                case IdentifiedNeed.Food:
                    if (!enabledSupports.Contains(SupportType.FoodGroceries) && !enabledSupports.Contains(SupportType.FoodRestaurant))
                    {
                        // both support types are disabled
                        ineligibleSupports.AddRange([SupportType.FoodGroceries, SupportType.FoodRestaurant]);
                    }
                    else if (!enabledSupports.Contains(SupportType.FoodGroceries) && enabledSupports.Contains(SupportType.FoodRestaurant))
                    {
                        // groceries support type is disabled and restaurant is enabled
                        eligibleSupports.Add(SupportType.FoodRestaurant);
                    }
                    else if (!enabledSupports.Contains(SupportType.FoodRestaurant) && enabledSupports.Contains(SupportType.FoodGroceries))
                    {
                        // restaurant support type is disabled and groceries is enabled
                        eligibleSupports.Add(SupportType.FoodGroceries);
                    }
                    else
                    {
                        // both support types are enabled
                        eligibleSupports.AddRange([SupportType.FoodGroceries, SupportType.FoodRestaurant]);
                    }
                    break;
            }
        }
        return (eligibleSupports, ineligibleSupports);
    }

    private static IEnumerable<SupportType> GetEnabledSupportTypesForTask(era_task task)
    {
        return task.era_era_task_era_selfservesupportlimits_Task
            .Where(sl => sl.statuscode == 1)
            .Select(s => Enum.Parse<SupportType>(s.era_supporttypeoption.Value.ToString()))
            .ToArray();
    }

    private static IEnumerable<SupportType> GetExtensionEnabledSupportTypesForTask(era_task task)
    {
        return task.era_era_task_era_selfservesupportlimits_Task
            .Where(sl => sl.statuscode == 1 && sl.era_extensionavailable == true)
            .Select(s => Enum.Parse<SupportType>(s.era_supporttypeoption.Value.ToString()))
            .ToArray();
    }

    private static IEnumerable<SupportType> GetOnetimeEnabledSupportTypesForTask(era_task task)
    {
        return task.era_era_task_era_selfservesupportlimits_Task
            .Where(sl => sl.statuscode == 1 && sl.era_extensionavailable != true)
            .Select(s => Enum.Parse<SupportType>(s.era_supporttypeoption.Value.ToString()))
            .ToArray();
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

    private static SelfServeSupportType MapSupportTypeToSelfServeSupportType(SupportType supportType) =>
        supportType switch
        {
            SupportType.FoodGroceries => SelfServeSupportType.FoodGroceries,
            SupportType.FoodRestaurant => SelfServeSupportType.FoodRestaurant,
            SupportType.Incidentals => SelfServeSupportType.Incidentals,
            SupportType.Clothing => SelfServeSupportType.Clothing,
            SupportType.ShelterAllowance => SelfServeSupportType.ShelterAllowance,

            _ => throw new NotImplementedException()
        };

    private async Task<string?> GetTaskNumberForAddress(era_bcscaddress address, CancellationToken ct)
    {
        var features = (await locationService.GetGeocodeAttributes(new Coordinates(address.era_latitude.Value, address.era_longitude.Value), ct));
        return features
            .FirstOrDefault(p => p.Any(a => a.Name == "PRODUCTION" && a.Value == (isProduction ? "Yes" : "No")) && p.Any(a => a.Name == "ESS_STATUS" && a.Value == "Active"))
            ?.FirstOrDefault(p => p.Name == "ESS_TASK_NUMBER")?.Value;
    }

    private async Task<era_evacuationfile?> GetFile(EssContext ctx, string evacuationFileNumber, CancellationToken ct)
    {
        var file = await ctx.era_evacuationfiles
            .Expand(f => f.era_CurrentNeedsAssessmentid)
            .Expand(f => f.era_CurrentNeedsAssessmentid.era_TaskNumber)
            .Expand(f => f.era_CurrentNeedsAssessmentid.era_EligibilityCheck)
            .Expand(f => f.era_Registrant)
            .Expand(f => f.era_Registrant.era_BCSCAddress)
            .Expand(f => f.era_era_evacuationfile_era_evacueesupport_ESSFileId)
            .Where(f => f.era_name == evacuationFileNumber).SingleOrDefaultAsync(ct);

        if (file != null) await ctx.LoadPropertyAsync(file.era_CurrentNeedsAssessmentid, nameof(era_needassessment.era_era_householdmember_era_needassessment), ct);

        return file;
    }

    private static async Task<era_task?> GetTask(EssContext ctx, string taskNumber, CancellationToken ct)
    {
        var now = DateTimeOffset.UtcNow;
        var task = await ctx.era_tasks
          .Expand(t => t.era_era_task_era_selfservesupportlimits_Task)
          .Where(t => t.era_name == taskNumber && t.statuscode == 1 && t.era_taskstartdate <= now && t.era_taskenddate > now).SingleOrDefaultAsync(ct);
        if (task != null) await ctx.LoadPropertyAsync(task, nameof(era_task.era_era_task_era_selfservesupportlimits_Task), ct);

        return task;
    }

    private static async Task<IEnumerable<era_evacueesupport>> GetDuplicateSupportsForHouseholdMember(EssContext ctx, era_householdmember hm, int[] similarSupportTypes, DateTimeOffset eligibleFrom, DateTimeOffset eligibleTo, CancellationToken ct)
    {
        return await ctx.era_evacueesupports
            .WhereNotIn(s => s.statuscode.Value, [(int)Resources.Supports.SupportStatus.Cancelled, (int)Resources.Supports.SupportStatus.Void])
            .WhereIn(s => s.era_supporttype.Value, similarSupportTypes)
            .Where(s =>
                s.era_era_householdmember_era_evacueesupport.Any(h => h.era_dateofbirth == hm.era_dateofbirth && h.era_firstname == hm.era_firstname && h.era_lastname == hm.era_lastname) &&
            ((s.era_validfrom >= eligibleFrom && s.era_validfrom <= eligibleTo) || (s.era_validto >= eligibleFrom && s.era_validto <= eligibleTo) || (s.era_validfrom < eligibleFrom && s.era_validto > eligibleTo)))
        .GetAllPagesAsync(ct);
    }

    private static async Task<IEnumerable<era_evacueesupport>> GetPreviousOnetimeSupportsForHouseholdMember(EssContext ctx, era_householdmember hm, int[] oneTimeSupportTypes, DateTimeOffset taskStartDate, CancellationToken ct)
    {
        return await ctx.era_evacueesupports
            .Expand(s => s.era_Task)
            .Expand(s => s.era_era_householdmember_era_evacueesupport)
            .WhereNotIn(s => s.statuscode.Value, [(int)Resources.Supports.SupportStatus.Cancelled, (int)Resources.Supports.SupportStatus.Void])
            .WhereIn(s => s.era_supporttype.Value, oneTimeSupportTypes)
            .Where(s => s.era_era_householdmember_era_evacueesupport.Any(h => h.era_dateofbirth == hm.era_dateofbirth && h.era_firstname == hm.era_firstname && h.era_lastname == hm.era_lastname))
            .Where(s => s.era_Task.era_taskenddate >= taskStartDate)
            .GetAllPagesAsync(ct);
    }

    private static IEnumerable<SupportType> GetMatchingTypesByCategory(SupportType supportType)
    {
        switch (supportType)
        {
            case SupportType.FoodGroceries:
            case SupportType.FoodRestaurant:
                return new[] { SupportType.FoodGroceries, SupportType.FoodRestaurant };

            default:
                return new[] { supportType };
        }
    }

    private static (SupportType[] unusedSupportTypes, SupportType[] onetimeUsedSupportTypes) MapEligibleSupportTypesByUsage(SupportType[] eligibleSupportTypes, SupportType[] receivedSupportTypes, SupportType[] enabledSupportTypesForExtensions)
    {
        if (receivedSupportTypes.Length == 0) return (eligibleSupportTypes, []);

        var unused = new List<SupportType>();
        var usedOneTime = new List<SupportType>();
        foreach (var supportType in eligibleSupportTypes)
        {
            if (!enabledSupportTypesForExtensions.Contains(supportType) && receivedSupportTypes.Contains(supportType))
            {
                usedOneTime.Add(supportType);
            }
            else
            {
                unused.Add(supportType);
            }
        }
        return (unused.ToArray(), usedOneTime.ToArray());
    }

    private static SelfServeSupportEligibility NotEligible(
    string reason,
    string? taskNumber = null,
    Guid? referencedHomeAddressId = null,
    DateTimeOffset? from = null,
    DateTimeOffset? to = null,
    IEnumerable<SelfServeSupportType>? eligibleSupportTypes = null,
    IEnumerable<SelfServeSupportType>? oneTimeUsedSupportTypes = null) =>
        new SelfServeSupportEligibility(false, reason, taskNumber, referencedHomeAddressId?.ToString(), from, to, eligibleSupportTypes ?? [], oneTimeUsedSupportTypes ?? []);

    private static SelfServeSupportEligibility Eligible(
        string taskNumber,
        Guid referencedHomeAddressId,
        DateTimeOffset from,
        DateTimeOffset to,
        IEnumerable<SelfServeSupportType> eligibleSupportTypes,
        IEnumerable<SelfServeSupportType> oneTimeUsedSupportTypes) =>
        new SelfServeSupportEligibility(true, null, taskNumber, referencedHomeAddressId.ToString(), from, to, eligibleSupportTypes, oneTimeUsedSupportTypes);

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
