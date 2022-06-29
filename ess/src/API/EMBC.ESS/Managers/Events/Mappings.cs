using System;
using System.Linq;
using AutoMapper;
using EMBC.ESS.Resources.Evacuations;
using EMBC.ESS.Resources.Evacuees;
using EMBC.ESS.Resources.Supports;

namespace EMBC.ESS.Managers.Events
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Shared.Contracts.Events.EvacuationFile, EvacuationFile>()
                .ForMember(d => d.NeedsAssessment, opts => opts.MapFrom(s => s.NeedsAssessment))
                .ForPath(d => d.NeedsAssessment.EvacuatedFrom, opts => opts.MapFrom(s => s.EvacuatedFromAddress))
                .ForMember(d => d.HouseholdMembers, opts => opts.Ignore())
                .ForMember(d => d.EvacuationDate, opts => opts.MapFrom(s => !s.EvacuationDate.HasValue ? DateTime.UtcNow : s.EvacuationDate))
                .ForMember(d => d.CreatedOn, opts => opts.Ignore())
                .ForMember(d => d.LastModified, opts => opts.Ignore())
                .ForMember(d => d.IsSecurityPhraseMasked, opts => opts.Ignore())
                .ForMember(d => d.TaskId, opts => opts.MapFrom(s => s.RelatedTask == null ? null : s.RelatedTask.Id))
                .ForMember(d => d.TaskLocationCommunityCode, opts => opts.Ignore())
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                .ForMember(d => d.EvacuatedFromAddress, opts => opts.MapFrom(s => s.EvacuatedFrom))
                .ForMember(d => d.RelatedTask, opts => opts.MapFrom(s => s.TaskId == null ? null : new Shared.Contracts.Events.IncidentTask { Id = s.TaskId }))
                .ForMember(d => d.Supports, opts => opts.Ignore())
                ;

            CreateMap<Shared.Contracts.Events.Address, EvacuationAddress>()
                .ForMember(d => d.CommunityCode, opts => opts.MapFrom(s => s.Community))
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                .ForMember(d => d.Community, opts => opts.MapFrom(s => s.CommunityCode))
                .ForMember(d => d.City, opts => opts.Ignore())
                .ForMember(d => d.StateProvince, opts => opts.Ignore())
                .ForMember(d => d.Country, opts => opts.Ignore())
                ;

            CreateMap<Shared.Contracts.Events.HouseholdMember, HouseholdMember>()
                .ForMember(d => d.HasAccessRestriction, opts => opts.Ignore())
                .ForMember(d => d.IsVerifiedRegistrant, opts => opts.Ignore())
                .ForMember(d => d.IsAuthenticatedRegistrant, opts => opts.Ignore())
                ;

            CreateMap<HouseholdMember, Shared.Contracts.Events.HouseholdMember>()
                .ForMember(d => d.RestrictedAccess, opts => opts.MapFrom(s => s.HasAccessRestriction))
                .ForMember(d => d.Verified, opts => opts.MapFrom(s => s.IsVerifiedRegistrant))
                .ForMember(d => d.Authenticated, opts => opts.MapFrom(s => s.IsAuthenticatedRegistrant))
                ;

            CreateMap<Shared.Contracts.Events.Pet, Pet>()
                .ForMember(d => d.Id, opts => opts.Ignore())
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                ;

            CreateMap<Shared.Contracts.Events.NeedsAssessment, NeedsAssessment>()
                .ForMember(d => d.EvacuatedFrom, opts => opts.Ignore())
                .ForMember(d => d.LastModified, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedTeamMemberId, opts => opts.Ignore())
                .ForMember(d => d.CompletedByTeamMemberId, opts => opts.MapFrom(s => s.CompletedBy == null ? null : s.CompletedBy.Id))
                .ForMember(d => d.CompletedOn, opts => opts.MapFrom(s => s.CompletedOn == default ? DateTime.UtcNow : s.CompletedOn))
                ;

            CreateMap<NeedsAssessment, Shared.Contracts.Events.NeedsAssessment>()
                .ForMember(d => d.CompletedBy, opts => opts.MapFrom(s => s.CompletedByTeamMemberId == null
                    ? null
                    : new Shared.Contracts.Events.TeamMember { Id = s.CompletedByTeamMemberId }))
                ;

            CreateMap<Shared.Contracts.Events.Note, Note>()
                .ForMember(d => d.CreatingTeamMemberId, opts => opts.MapFrom(s => s.CreatedBy == null ? null : s.CreatedBy.Id))
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                .ForMember(d => d.CreatedBy, opts => opts.MapFrom(s => new Shared.Contracts.Events.TeamMember { Id = s.CreatingTeamMemberId }))
                ;

            CreateMap<Shared.Contracts.Events.RegistrantProfile, Evacuee>()
                .ForMember(d => d.Authenticated, opts => opts.MapFrom(s => s.AuthenticatedUser))
                .ForMember(d => d.Verified, opts => opts.MapFrom(s => s.VerifiedUser))
                .ForMember(d => d.Minor, opts => opts.Ignore())
                ;

            CreateMap<Evacuee, Shared.Contracts.Events.RegistrantProfile>()
                .ForMember(d => d.AuthenticatedUser, opts => opts.MapFrom(s => s.Authenticated))
                .ForMember(d => d.VerifiedUser, opts => opts.MapFrom(s => s.Verified))
                .ForMember(d => d.IsMinor, opts => opts.MapFrom(s => s.Minor))
                ;

            CreateMap<Shared.Contracts.Events.Address, Address>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                ;

            CreateMap<Shared.Contracts.Events.SecurityQuestion, SecurityQuestion>()
                .ForMember(d => d.AnswerIsMasked, opts => opts.MapFrom(s => !s.AnswerChanged))
                .ReverseMap()
                .ForMember(d => d.AnswerChanged, opts => opts.MapFrom(s => false))
                .ValidateMemberList(MemberList.Destination)
                ;

            CreateMap<Resources.Tasks.EssTask, Shared.Contracts.Events.IncidentTask>();

            CreateMap<EvacuationFile, Shared.Contracts.Events.EvacuationFileSearchResult>()
                .ForMember(d => d.EvacuationAddress, opts => opts.MapFrom(s => s.EvacuatedFrom))
                .ForMember(d => d.IssuedOn, opts => opts.MapFrom(s => s.CreatedOn)) //temporary until files have issued date
                .ForMember(d => d.TaskStartDate, opts => opts.Ignore())
                .ForMember(d => d.TaskEndDate, opts => opts.Ignore())
                .ForMember(d => d.IsFileCompleted, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.SecurityPhrase)))
                ;

            CreateMap<Evacuee, Shared.Contracts.Events.ProfileSearchResult>()
                .ForMember(d => d.RecentEvacuationFiles, opts => opts.Ignore())
                .ForMember(d => d.RegistrationDate, opts => opts.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.IsVerified, opts => opts.MapFrom(s => s.Verified))
                .ForMember(d => d.IsAuthenticated, opts => opts.MapFrom(s => s.Authenticated))
                .ForMember(d => d.IsMinor, opts => opts.MapFrom(s => s.Minor))
                .ForMember(d => d.IsProfileCompleted, opts => opts.MapFrom(s => s.SecurityQuestions.Any()))
                ;

            CreateMap<HouseholdMember, Shared.Contracts.Events.EvacuationFileSearchResultHouseholdMember>()
                .ForMember(d => d.IsSearchMatch, opts => opts.Ignore())
                .ForMember(d => d.RestrictedAccess, opts => opts.MapFrom(s => s.HasAccessRestriction))
                ;

            Func<Support, Shared.Contracts.Events.SupportStatus> resolveSupportStatus = s =>
                s.Status switch
                {
                    SupportStatus.PendingScan => Shared.Contracts.Events.SupportStatus.PendingApproval,
                    SupportStatus.Issued => Shared.Contracts.Events.SupportStatus.Approved,

                    _ => Enum.Parse<Shared.Contracts.Events.SupportStatus>(s.Status.ToString())
                };
            CreateMap<Support, Shared.Contracts.Events.Support>()
                .ForMember(d => d.CreatedBy, opts => opts.MapFrom(s => s.CreatedByTeamMemberId == null
                    ? null
                    : new Shared.Contracts.Events.TeamMember { Id = s.CreatedByTeamMemberId }))
                .ForMember(d => d.IssuedBy, opts => opts.MapFrom(s =>
                    GetReferralOrNull(s) == null
                        ? null
                        : string.IsNullOrEmpty(GetReferralOrNull(s).IssuedByDisplayName)
                            ? null
                            : new Shared.Contracts.Events.TeamMember { DisplayName = GetReferralOrNull(s).IssuedByDisplayName }))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => resolveSupportStatus(s)))
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                .IncludeAllDerived()
                .ForMember(d => d.CreatedByTeamMemberId, opts => opts.MapFrom(s => s.CreatedBy.Id))
                .ForMember(d => d.Flags, opts => opts.Ignore())
                .ForMember(d => d.TaskId, opts => opts.Ignore())
                .AfterMap((s, d) =>
                {
                    if (d.IsPaperReferral)
                    {
                        ((Referral)d.SupportDelivery).IssuedByDisplayName = s.IssuedBy?.DisplayName;
                    }
                })
                ;

            CreateMap<SupportFlag, Shared.Contracts.Events.SupportFlag>()
                .IncludeAllDerived()
                .ReverseMap()
                .IncludeAllDerived()
                ;

            CreateMap<DuplicateSupportFlag, Shared.Contracts.Events.DuplicateSupportFlag>()
                .ReverseMap()
                ;

            CreateMap<AmountOverridenSupportFlag, Shared.Contracts.Events.AmountExceededSupportFlag>()
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Events.Referral, Referral>()
               .ForMember(d => d.IssuedByDisplayName, opts => opts.Ignore())
               .ForMember(d => d.SupplierId, opts => opts.MapFrom(s => s.SupplierDetails != null ? s.SupplierDetails.Id : null))
               .ReverseMap()
               .ValidateMemberList(MemberList.Destination)
               .IncludeAllDerived()
               .ForMember(d => d.SupplierDetails, opts => opts.MapFrom(s => s.SupplierId == null
                    ? null
                    : new Shared.Contracts.Events.SupplierDetails { Id = s.SupplierId }))
               ;

            CreateMap<Shared.Contracts.Events.SupportDelivery, SupportDelivery>()
               .IncludeAllDerived()
               .ReverseMap()
               .ValidateMemberList(MemberList.Destination)
               .IncludeAllDerived()
               ;

            CreateMap<Shared.Contracts.Events.ETransfer, ETransfer>()
                .IncludeAllDerived()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                .IncludeAllDerived()
                ;

            CreateMap<Shared.Contracts.Events.Interac, Interac>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                .IncludeAllDerived()
                .ForMember(d => d.SecurityQuestion, opts => opts.Ignore())
                .ForMember(d => d.SecurityAnswer, opts => opts.Ignore())
                .ForMember(d => d.RelatedPaymentId, opts => opts.Ignore())
                ;

            CreateMap<ClothingSupport, Shared.Contracts.Events.ClothingSupport>()
                .IncludeBase<Support, Shared.Contracts.Events.Support>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<IncidentalsSupport, Shared.Contracts.Events.IncidentalsSupport>()
                .IncludeBase<Support, Shared.Contracts.Events.Support>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<FoodGroceriesSupport, Shared.Contracts.Events.FoodGroceriesSupport>()
                .IncludeBase<Support, Shared.Contracts.Events.Support>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<FoodRestaurantSupport, Shared.Contracts.Events.FoodRestaurantSupport>()
                .IncludeBase<Support, Shared.Contracts.Events.Support>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<LodgingBilletingSupport, Shared.Contracts.Events.LodgingBilletingSupport>()
                .IncludeBase<Support, Shared.Contracts.Events.Support>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<LodgingGroupSupport, Shared.Contracts.Events.LodgingGroupSupport>()
                .IncludeBase<Support, Shared.Contracts.Events.Support>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<LodgingHotelSupport, Shared.Contracts.Events.LodgingHotelSupport>()
                .IncludeBase<Support, Shared.Contracts.Events.Support>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<TransportationTaxiSupport, Shared.Contracts.Events.TransportationTaxiSupport>()
                .IncludeBase<Support, Shared.Contracts.Events.Support>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<TransportationOtherSupport, Shared.Contracts.Events.TransportationOtherSupport>()
                .IncludeBase<Support, Shared.Contracts.Events.Support>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<Resources.Suppliers.Address, Shared.Contracts.Events.Address>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<Resources.Suppliers.Supplier, Shared.Contracts.Events.SupplierDetails>()
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.Contact == null ? null : s.Contact.Phone))
                ;

            CreateMap<Resources.Teams.TeamMember, Shared.Contracts.Events.TeamMember>()
                .ForMember(d => d.DisplayName, opts => opts.MapFrom(s => $"{s.LastName}, {s.FirstName}"))
                ;
        }

        private static Referral GetReferralOrNull(Support support) => support.SupportDelivery as Referral;
    }
}
