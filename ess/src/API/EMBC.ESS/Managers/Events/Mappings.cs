using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting;
using EMBC.ESS.Resources.Evacuations;
using EMBC.ESS.Resources.Evacuees;
using EMBC.ESS.Resources.Supports;
using EMBC.Utilities.Extensions;

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
                .ForMember(d => d.RelatedTask, opts => opts.MapFrom(s => new Shared.Contracts.Events.IncidentTask { Id = s.TaskId }))
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
                ;

            CreateMap<Evacuee, Shared.Contracts.Events.ProfileSearchResult>()
                .ForMember(d => d.RecentEvacuationFiles, opts => opts.Ignore())
                .ForMember(d => d.RegistrationDate, opts => opts.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.IsVerified, opts => opts.MapFrom(s => s.Verified))
                .ForMember(d => d.IsAuthenticated, opts => opts.MapFrom(s => s.Authenticated))
                .ForMember(d => d.IsMinor, opts => opts.MapFrom(s => s.Minor))
                ;

            CreateMap<HouseholdMember, Shared.Contracts.Events.EvacuationFileSearchResultHouseholdMember>()
                .ForMember(d => d.IsSearchMatch, opts => opts.Ignore())
                .ForMember(d => d.RestrictedAccess, opts => opts.MapFrom(s => s.HasAccessRestriction))
                ;

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
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                .IncludeAllDerived()
                .ForMember(d => d.CreatedByTeamMemberId, opts => opts.MapFrom(s => s.CreatedBy.Id))
                .AfterMap((s, d) =>
                {
                    if (d.IsPaperReferral)
                    {
                        ((Referral)d.SupportDelivery).IssuedByDisplayName = s.IssuedBy?.DisplayName;
                    }
                })
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
                .ValidateMemberList(MemberList.Destination)
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
                .ForMember(d => d.Name, opts => opts.MapFrom(s => s.LegalName))
                ;

            //referral printing mappings
            CreateMap<Shared.Contracts.Events.Support, PrintReferral>()
                .IncludeAllDerived()
                .ForMember(d => d.Id, m => m.MapFrom(s => s.Id))
                .ForMember(d => d.PurchaserName, opts => opts.MapFrom(s => s.SupportDelivery is Shared.Contracts.Events.Referral
                    ? ((Shared.Contracts.Events.Referral)s.SupportDelivery).IssuedToPersonName
                    : null))
                .ForMember(d => d.FromDate, m => m.MapFrom(s => s.From.ToPST().ToString("dd-MMM-yyyy")))
                .ForMember(d => d.FromTime, m => m.MapFrom(s => s.From.ToPST().ToString("hh:mm tt")))
                .ForMember(d => d.ToDate, m => m.MapFrom(s => s.To.ToPST().ToString("dd-MMM-yyyy")))
                .ForMember(d => d.ToTime, m => m.MapFrom(s => s.To.ToPST().ToString("hh:mm tt")))
                .ForMember(d => d.Type, m => m.MapFrom(s => MapSupportType(s)))
                .ForMember(d => d.PrintDate, m => m.MapFrom(s => DateTime.Now.ToString("dd-MMM-yyyy")))
                .ForMember(d => d.Comments, opts => opts.MapFrom(s => GetReferralOrNull(s) == null ? null : GetReferralOrNull(s).SupplierNotes))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(s => GetReferralOrNull(s) == null ? null : GetReferralOrNull(s).SupplierDetails))
                .ForMember(d => d.IncidentTaskNumber, opts => opts.Ignore())
                .ForMember(d => d.EssNumber, opts => opts.Ignore())
                .ForMember(d => d.HostCommunity, opts => opts.Ignore())
                .ForMember(d => d.Evacuees, opts => opts.Ignore())
                .ForMember(d => d.TotalAmountPrinted, opts => opts.Ignore())
                .ForMember(d => d.ApprovedItems, opts => opts.Ignore())
                .ForMember(d => d.VolunteerFirstName, opts => opts.Ignore())
                .ForMember(d => d.VolunteerLastName, opts => opts.Ignore())
                .ForMember(d => d.DisplayWatermark, opts => opts.Ignore())
                .ForMember(d => d.NumBreakfasts, opts => opts.Ignore())
                .ForMember(d => d.NumLunches, opts => opts.Ignore())
                .ForMember(d => d.NumDinners, opts => opts.Ignore())
                .ForMember(d => d.NumDaysMeals, opts => opts.Ignore())
                .ForMember(d => d.NumNights, opts => opts.Ignore())
                .ForMember(d => d.NumRooms, opts => opts.Ignore())
                .ForMember(d => d.FromAddress, opts => opts.Ignore())
                .ForMember(d => d.ToAddress, opts => opts.Ignore())
                .ForMember(d => d.OtherTransportModeDetails, opts => opts.Ignore())
                .ForMember(d => d.PrintableEvacuees, opts => opts.Ignore())
                .AfterMap((s, d, ctx) =>
                {
                    var file = (Shared.Contracts.Events.EvacuationFile)ctx.Items["evacuationFile"];
                    if (file == null) return;
                    d.IncidentTaskNumber = file.RelatedTask.Id;
                    d.EssNumber = file.Id;
                    d.HostCommunity = file.RelatedTask.CommunityCode;
                    d.Evacuees = ctx.Mapper.Map<IEnumerable<PrintEvacuee>>(file.HouseholdMembers.Where(m => s.IncludedHouseholdMembers.Contains(m.Id)));
                })
                ;

            CreateMap<Shared.Contracts.Events.FoodRestaurantSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.NumBreakfasts, opts => opts.MapFrom(s => s.NumberOfBreakfastsPerPerson))
                .ForMember(d => d.NumLunches, opts => opts.MapFrom(s => s.NumberOfLunchesPerPerson))
                .ForMember(d => d.NumDinners, opts => opts.MapFrom(s => s.NumberOfDinnersPerPerson))
                ;

            CreateMap<Shared.Contracts.Events.ClothingSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                ;

            CreateMap<Shared.Contracts.Events.IncidentalsSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.ApprovedItems, opts => opts.MapFrom(s => s.ApprovedItems))
                ;

            CreateMap<Shared.Contracts.Events.FoodGroceriesSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.NumDaysMeals, opts => opts.MapFrom(s => s.NumberOfDays))
                ;

            CreateMap<Shared.Contracts.Events.LodgingHotelSupport, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.NumRooms, opts => opts.MapFrom(s => s.NumberOfRooms))
                ;

            CreateMap<Shared.Contracts.Events.LodgingBilletingSupport, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(s => new PrintSupplier
                {
                    Address = s.HostAddress,
                    City = s.HostCity,
                    Telephone = s.HostPhone,
                    Name = s.HostName
                }))
                ;

            CreateMap<Shared.Contracts.Events.LodgingGroupSupport, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(supplier => new PrintSupplier
                {
                    Address = supplier.FacilityAddress,
                    City = supplier.FacilityCity,
                    Telephone = supplier.FacilityContactPhone,
                    Name = supplier.FacilityName
                }))
                ;

            CreateMap<Shared.Contracts.Events.TransportationOtherSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.OtherTransportModeDetails, opts => opts.MapFrom(s => s.TransportMode))
                ;

            CreateMap<Shared.Contracts.Events.TransportationTaxiSupport, PrintReferral>()
                .ForMember(d => d.FromAddress, opts => opts.MapFrom(s => s.FromAddress))
                .ForMember(d => d.ToAddress, opts => opts.MapFrom(s => s.ToAddress))
                ;

            CreateMap<Shared.Contracts.Events.SupplierDetails, PrintSupplier>()
                .ForMember(d => d.Address, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.Address.AddressLine2) ? s.Address.AddressLine1 : s.Address.AddressLine1 + "," + s.Address.AddressLine2))
                .ForMember(d => d.City, opts => opts.MapFrom(s => s.Address.City))
                .ForMember(d => d.Community, opts => opts.MapFrom(s => s.Address.Community))
                .ForMember(d => d.Name, opts => opts.MapFrom(s => s.Name))
                .ForMember(d => d.Province, opts => opts.MapFrom(s => s.Address.StateProvince))
                .ForMember(d => d.PostalCode, opts => opts.MapFrom(s => s.Address.PostalCode))
                .ForMember(d => d.Telephone, opts => opts.MapFrom(s => s.Phone))
                ;

            Func<Shared.Contracts.Events.HouseholdMember, string> mapEvacueeTType = m =>
                m.IsPrimaryRegistrant
                    ? "M" //main
                    : m.IsMinor
                        ? "C" //child
                        : "A"; //adult

            CreateMap<Shared.Contracts.Events.HouseholdMember, PrintEvacuee>()
                .ForMember(d => d.EvacueeTypeCode, opts => opts.MapFrom(s => mapEvacueeTType(s)))
                ;
        }

        private static PrintReferralType MapSupportType(Shared.Contracts.Events.Support support) =>
            support switch
            {
                Shared.Contracts.Events.ClothingSupport _ => PrintReferralType.Clothing,
                Shared.Contracts.Events.FoodGroceriesSupport _ => PrintReferralType.Groceries,
                Shared.Contracts.Events.FoodRestaurantSupport _ => PrintReferralType.Meals,
                Shared.Contracts.Events.IncidentalsSupport _ => PrintReferralType.Incidentals,
                Shared.Contracts.Events.LodgingBilletingSupport _ => PrintReferralType.Billeting,
                Shared.Contracts.Events.LodgingGroupSupport _ => PrintReferralType.GroupLodging,
                Shared.Contracts.Events.LodgingHotelSupport _ => PrintReferralType.Hotel,
                Shared.Contracts.Events.TransportationOtherSupport _ => PrintReferralType.Transportation,
                Shared.Contracts.Events.TransportationTaxiSupport _ => PrintReferralType.Taxi,
                _ => throw new NotImplementedException()
            };

        private static Referral GetReferralOrNull(Support support) => support.SupportDelivery as Referral;

        private static Shared.Contracts.Events.Referral GetReferralOrNull(Shared.Contracts.Events.Support support) => support.SupportDelivery as Shared.Contracts.Events.Referral;
    }
}
