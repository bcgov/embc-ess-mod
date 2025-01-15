using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Shared.Contracts.Events.SelfServe;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration.SelfServe;

internal class SelfServeEtransferGenerator(IMapper mapper) : ISupportGenerationStrategy
{
    public Task<GenerateResponse> Generate(GenerateRequest request, CancellationToken ct) =>
        request switch
        {
            GenerateSelfServeETransferSupports r => Handle(r, ct),

            _ => throw new NotImplementedException($"{request.GetType().Name}")
        };

    private async Task<GenerateResponse> Handle(GenerateSelfServeETransferSupports r, CancellationToken ct)
    {
        await Task.CompletedTask;
        var supports = new List<Support>();
        foreach (var selfServeSupport in r.Supports)
        {
            var support = selfServeSupport switch
            {
                SelfServeClothingSupport s => mapper.Map<ClothingSupport>(s),
                SelfServeIncidentalsSupport s => mapper.Map<IncidentalsSupport>(s),
                SelfServeFoodGroceriesSupport s => mapper.Map<FoodGroceriesSupport>(s),
                SelfServeFoodRestaurantSupport s => mapper.Map<FoodRestaurantSupport>(s),
                SelfServeShelterAllowanceSupport s => (Support)mapper.Map<ShelterAllowanceSupport>(s),

                _ => throw new NotImplementedException()
            };
            support.From = r.SupportPeriodFrom;
            support.To = r.SupportPeriodTo;
            support.SupportDelivery = new Interac
            {
                NotificationEmail = r.ETransferDetails.ETransferEmail,
                NotificationMobile = r.ETransferDetails.ETransferMobile,
                ReceivingRegistrantId = r.RegistrantId,
            };

            if (support.IncludedHouseholdMembers.Any()) supports.Add(support);
        }

        return new GenerateSelfServeETransferSupportsResponse(supports);
    }
}

public class Mapping : Profile
{
    public Mapping()
    {
        CreateMap<SelfServeSupport, Support>()
            .IncludeAllDerived()
            .ForMember(d => d.IsSelfServe, opts => opts.MapFrom(_ => true))
            .ForMember(d => d.Id, opts => opts.Ignore())
            .ForMember(d => d.From, opts => opts.Ignore())
            .ForMember(d => d.To, opts => opts.Ignore())
            .ForMember(d => d.Status, opts => opts.Ignore())
            .ForMember(d => d.FileId, opts => opts.Ignore())
            .ForMember(d => d.CreatedOn, opts => opts.Ignore())
            .ForMember(d => d.CreatedBy, opts => opts.Ignore())
            .ForMember(d => d.IssuedOn, opts => opts.Ignore())
            .ForMember(d => d.IssuedBy, opts => opts.Ignore())
            .ForMember(d => d.OriginatingNeedsAssessmentId, opts => opts.Ignore())
            .ForMember(d => d.Status, opts => opts.Ignore())
            .ForMember(d => d.SupportDelivery, opts => opts.Ignore())
            .ForMember(d => d.Flags, opts => opts.Ignore())
            .ForMember(d => d.IncludedHouseholdMembers, opts => opts.Ignore())
            .ForMember(d => d.HouseholdMembers, opts => opts.Ignore())
    ;

        CreateMap<SelfServeClothingSupport, ClothingSupport>()
            .ForMember(d => d.ExtremeWinterConditions, opts => opts.Ignore())
            .ForMember(d => d.ApproverName, opts => opts.Ignore())
            .ForMember(d => d.IncludedHouseholdMembers, opts => opts.MapFrom(s => s.IncludedHouseholdMembers))
            ;

        CreateMap<SelfServeIncidentalsSupport, IncidentalsSupport>()
            .ForMember(d => d.ApproverName, opts => opts.Ignore())
            .ForMember(d => d.ApprovedItems, opts => opts.Ignore())
            .ForMember(d => d.IncludedHouseholdMembers, opts => opts.MapFrom(s => s.IncludedHouseholdMembers))
            ;

        CreateMap<SelfServeFoodGroceriesSupport, FoodGroceriesSupport>()
            .ForMember(d => d.IncludedHouseholdMembers, opts => opts.MapFrom(s => s.IncludedHouseholdMembers))
            .ForMember(d => d.NumberOfDays, opts => opts.MapFrom(s => s.Nights.Count()))
            .ForMember(d => d.ApproverName, opts => opts.Ignore())
            ;

        CreateMap<SelfServeFoodRestaurantSupport, FoodRestaurantSupport>()
            .ForMember(d => d.IncludedHouseholdMembers, opts => opts.MapFrom(s => s.IncludedHouseholdMembers))
            .ForMember(d => d.NumberOfBreakfastsPerPerson, opts => opts.MapFrom(s => s.Meals.Count(m => m.Breakfast == true)))
            .ForMember(d => d.NumberOfLunchesPerPerson, opts => opts.MapFrom(s => s.Meals.Count(m => m.Lunch == true)))
            .ForMember(d => d.NumberOfDinnersPerPerson, opts => opts.MapFrom(s => s.Meals.Count(m => m.Dinner == true)))
            ;

        CreateMap<SelfServeShelterAllowanceSupport, ShelterAllowanceSupport>()
            .ForMember(d => d.IncludedHouseholdMembers, opts => opts.MapFrom(s => s.IncludedHouseholdMembers))
            .ForMember(d => d.NumberOfNights, opts => opts.MapFrom(s => s.Nights.Count()))
            .ForMember(d => d.ContactEmail, opts => opts.Ignore())
            .ForMember(d => d.ContactPhone, opts => opts.Ignore())
            ;
    }
}
