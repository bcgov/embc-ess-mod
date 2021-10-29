// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using EMBC.ESS.Managers.Submissions.PrintReferrals;

namespace EMBC.ESS.Managers.Submissions
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Shared.Contracts.Submissions.EvacuationFile, Resources.Cases.EvacuationFile>()
                .ForMember(d => d.NeedsAssessment, opts => opts.MapFrom(s => s.NeedsAssessment))
                .ForPath(d => d.NeedsAssessment.EvacuatedFrom, opts => opts.MapFrom(s => s.EvacuatedFromAddress))
                .ForMember(d => d.HouseholdMembers, opts => opts.Ignore())
                .ForMember(d => d.EvacuationDate, opts => opts.MapFrom(s => !s.EvacuationDate.HasValue ? DateTime.UtcNow : s.EvacuationDate))
                .ForMember(d => d.CreatedOn, opts => opts.Ignore())
                .ForMember(d => d.LastModified, opts => opts.Ignore())
                .ForMember(d => d.IsSecurityPhraseMasked, opts => opts.Ignore())
                .ForMember(d => d.TaskId, opts => opts.MapFrom(s => s.RelatedTask == null ? null : s.RelatedTask.Id))
                .ForMember(d => d.TaskLocationCommunityCode, opts => opts.Ignore())
                ;

            CreateMap<Resources.Cases.EvacuationFile, Shared.Contracts.Submissions.EvacuationFile>()
                .ForMember(d => d.EvacuatedFromAddress, opts => opts.MapFrom(s => s.EvacuatedFrom))
                .ForMember(d => d.RelatedTask, opts => opts.MapFrom(s => new Shared.Contracts.Submissions.IncidentTask { Id = s.TaskId }))
                ;

            CreateMap<Shared.Contracts.Submissions.Address, Resources.Cases.EvacuationAddress>()
                .ForMember(d => d.CommunityCode, opts => opts.MapFrom(s => s.Community))
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                .ForMember(d => d.Community, opts => opts.MapFrom(s => s.CommunityCode))
                .ForMember(d => d.City, opts => opts.Ignore())
                .ForMember(d => d.StateProvince, opts => opts.Ignore())
                .ForMember(d => d.Country, opts => opts.Ignore())
                ;

            CreateMap<Shared.Contracts.Submissions.HouseholdMember, Resources.Cases.HouseholdMember>()
                .ForMember(d => d.HasAccessRestriction, opts => opts.Ignore())
                .ForMember(d => d.IsVerifiedRegistrant, opts => opts.Ignore())
                .ForMember(d => d.IsAuthenticatedRegistrant, opts => opts.Ignore())
                ;

            CreateMap<Resources.Cases.HouseholdMember, Shared.Contracts.Submissions.HouseholdMember>()
                .ForMember(d => d.RestrictedAccess, opts => opts.MapFrom(s => s.HasAccessRestriction))
                .ForMember(d => d.Verified, opts => opts.MapFrom(s => s.IsVerifiedRegistrant))
                .ForMember(d => d.Authenticated, opts => opts.MapFrom(s => s.IsAuthenticatedRegistrant))
                ;

            CreateMap<Shared.Contracts.Submissions.Pet, Resources.Cases.Pet>()
                .ForMember(d => d.Id, opts => opts.Ignore())
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                ;

            CreateMap<Shared.Contracts.Submissions.NeedsAssessment, Resources.Cases.NeedsAssessment>()
                .ForMember(d => d.EvacuatedFrom, opts => opts.Ignore())
                .ForMember(d => d.LastModified, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedTeamMemberId, opts => opts.Ignore())
                .ForMember(d => d.CompletedByTeamMemberId, opts => opts.MapFrom(s => s.CompletedBy == null ? null : s.CompletedBy.Id))
                .ForMember(d => d.CompletedOn, opts => opts.MapFrom(s => s.CompletedOn == default ? DateTime.UtcNow : s.CompletedOn))
                ;

            CreateMap<Resources.Cases.NeedsAssessment, Shared.Contracts.Submissions.NeedsAssessment>()
                .ForMember(d => d.CompletedBy, opts => opts.MapFrom(s => s.CompletedByTeamMemberId == null
                    ? null
                    : new Shared.Contracts.Submissions.TeamMember { Id = s.CompletedByTeamMemberId }))
                ;

            CreateMap<Shared.Contracts.Submissions.Note, Resources.Cases.Note>()
                .ForMember(d => d.CreatingTeamMemberId, opts => opts.MapFrom(s => s.CreatedBy == null ? null : s.CreatedBy.Id))
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                .ForMember(d => d.CreatedBy, opts => opts.MapFrom(s => new Shared.Contracts.Submissions.TeamMember { Id = s.CreatingTeamMemberId }))
                ;

            CreateMap<Shared.Contracts.Submissions.RegistrantProfile, Resources.Contacts.Contact>()
                .ForMember(d => d.Authenticated, opts => opts.MapFrom(s => s.AuthenticatedUser))
                .ForMember(d => d.Verified, opts => opts.MapFrom(s => s.VerifiedUser))
                ;
            CreateMap<Resources.Contacts.Contact, Shared.Contracts.Submissions.RegistrantProfile>()
                .ForMember(d => d.AuthenticatedUser, opts => opts.MapFrom(s => s.Authenticated))
                .ForMember(d => d.VerifiedUser, opts => opts.MapFrom(s => s.Verified))
                ;

            CreateMap<Shared.Contracts.Submissions.Address, Resources.Contacts.Address>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                ;

            CreateMap<Shared.Contracts.Submissions.SecurityQuestion, Resources.Contacts.SecurityQuestion>()
                .ForMember(d => d.AnswerIsMasked, opts => opts.MapFrom(s => !s.AnswerChanged))
                .ReverseMap()
                .ForMember(d => d.AnswerChanged, opts => opts.MapFrom(s => false))
                .ValidateMemberList(MemberList.Destination)
                ;

            CreateMap<Resources.Tasks.EssTask, Shared.Contracts.Submissions.IncidentTask>();

            CreateMap<Resources.Cases.EvacuationFile, Shared.Contracts.Submissions.EvacuationFileSearchResult>()
                .ForMember(d => d.EvacuationAddress, opts => opts.MapFrom(s => s.EvacuatedFrom))
                ;

            CreateMap<Resources.Contacts.Contact, Shared.Contracts.Submissions.ProfileSearchResult>()
                .ForMember(d => d.RecentEvacuationFiles, opts => opts.Ignore())
                .ForMember(d => d.RegistrationDate, opts => opts.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.IsVerified, opts => opts.MapFrom(s => s.Verified))
                .ForMember(d => d.IsAuthenticated, opts => opts.MapFrom(s => s.Authenticated))
                ;

            CreateMap<Resources.Cases.HouseholdMember, Shared.Contracts.Submissions.EvacuationFileSearchResultHouseholdMember>()
                .ForMember(d => d.IsSearchMatch, opts => opts.Ignore())
                .ForMember(d => d.RestrictedAccess, opts => opts.MapFrom(s => s.HasAccessRestriction))
                ;

            CreateMap<Resources.Cases.Support, Shared.Contracts.Submissions.Support>()
                .IncludeAllDerived()
                .ForMember(d => d.IssuedBy, opts => opts.MapFrom(s => s.IssuedByTeamMemberId == null
                    ? null
                    : new Shared.Contracts.Submissions.TeamMember { Id = s.IssuedByTeamMemberId }))
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                .IncludeAllDerived()
                .ForMember(d => d.IssuedByTeamMemberId, opts => opts.MapFrom(s => s.IssuedBy == null ? null : s.IssuedBy.Id))
                ;

            CreateMap<Resources.Cases.Referral, Shared.Contracts.Submissions.Referral>()
                .IncludeAllDerived()
                .ForMember(d => d.SupplierDetails, opts => opts.MapFrom(s => s.SupplierId == null
                    ? null
                    : new Shared.Contracts.Submissions.SupplierDetails { Id = s.SupplierId }))
               .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                .IncludeAllDerived()
                .ForMember(d => d.SupplierId, opts => opts.MapFrom(s => s.SupplierDetails != null ? s.SupplierDetails.Id : null));

            CreateMap<Resources.Cases.ClothingReferral, Shared.Contracts.Submissions.ClothingReferral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<Resources.Cases.IncidentalsReferral, Shared.Contracts.Submissions.IncidentalsReferral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<Resources.Cases.FoodGroceriesReferral, Shared.Contracts.Submissions.FoodGroceriesReferral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<Resources.Cases.FoodRestaurantReferral, Shared.Contracts.Submissions.FoodRestaurantReferral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<Resources.Cases.LodgingBilletingReferral, Shared.Contracts.Submissions.LodgingBilletingReferral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<Resources.Cases.LodgingGroupReferral, Shared.Contracts.Submissions.LodgingGroupReferral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<Resources.Cases.LodgingHotelReferral, Shared.Contracts.Submissions.LodgingHotelReferral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<Resources.Cases.TransportationTaxiReferral, Shared.Contracts.Submissions.TransportationTaxiReferral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<Resources.Cases.TransportationOtherReferral, Shared.Contracts.Submissions.TransportationOtherReferral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<Resources.Suppliers.Address, Shared.Contracts.Submissions.Address>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<Resources.Suppliers.Supplier, Shared.Contracts.Submissions.SupplierDetails>()
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.Contact == null ? null : s.Contact.Phone))
                .ForMember(d => d.Name, opts => opts.MapFrom(s => s.LegalName))
                ;

            //referral printing mappings

            CreateMap<Shared.Contracts.Submissions.Referral, PrintReferral>()
                .IncludeAllDerived()
                .ForMember(d => d.Id, m => m.MapFrom(s => s.Id))
                .ForMember(d => d.PurchaserName, opts => opts.MapFrom(s => s.IssuedToPersonName))
                .ForMember(d => d.FromDate, m => m.MapFrom(s => s.From.ToString("dd-MMM-yyyy")))
                .ForMember(d => d.FromTime, m => m.MapFrom(s => s.From.ToString("hh:mm tt")))
                .ForMember(d => d.ToDate, m => m.MapFrom(s => s.To.ToString("dd-MMM-yyyy")))
                .ForMember(d => d.ToTime, m => m.MapFrom(s => s.To.ToString("hh:mm tt")))
                .ForMember(d => d.Type, m => m.MapFrom(s => MapSupportType(s)))
                .ForMember(d => d.PrintDate, m => m.MapFrom(s => DateTime.UtcNow.ToString("dd-MMM-yyyy")))
                .ForMember(d => d.Comments, opts => opts.MapFrom(s => s.SupplierNotes))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(s => s.SupplierDetails))
                .ForMember(d => d.IncidentTaskNumber, opts => opts.Ignore())
                .ForMember(d => d.EssNumber, opts => opts.Ignore())
                .ForMember(d => d.HostCommunity, opts => opts.Ignore())
                .ForMember(d => d.Evacuees, opts => opts.Ignore())
                .AfterMap((s, d, ctx) =>
                {
                    var file = (Shared.Contracts.Submissions.EvacuationFile)ctx.Items["evacuationFile"];
                    if (file == null) return;
                    d.IncidentTaskNumber = file.RelatedTask.Id;
                    d.EssNumber = file.Id;
                    //TODO: add community name resolution
                    d.HostCommunity = file.RelatedTask.CommunityCode;
                    d.Evacuees = ctx.Mapper.Map<IEnumerable<PrintEvacuee>>(file.HouseholdMembers.Where(m => s.IncludedHouseholdMembers.Contains(m.Id)));
                })
                .ForAllOtherMembers(opts => opts.Ignore())
                ;

            CreateMap<Shared.Contracts.Submissions.FoodRestaurantReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.NumBreakfasts, opts => opts.MapFrom(s => s.NumberOfBreakfastsPerPerson))
                .ForMember(d => d.NumLunches, opts => opts.MapFrom(s => s.NumberOfLunchesPerPerson))
                .ForMember(d => d.NumDinners, opts => opts.MapFrom(s => s.NumberOfDinnersPerPerson))
                ;

            CreateMap<Shared.Contracts.Submissions.ClothingReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                ;

            CreateMap<Shared.Contracts.Submissions.IncidentalsReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.ApprovedItems, opts => opts.MapFrom(s => s.ApprovedItems))
                ;

            CreateMap<Shared.Contracts.Submissions.FoodGroceriesReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.NumDaysMeals, opts => opts.MapFrom(s => s.NumberOfDays))
                ;

            CreateMap<Shared.Contracts.Submissions.LodgingHotelReferral, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.NumRooms, opts => opts.MapFrom(s => s.NumberOfRooms))
                ;

            CreateMap<Shared.Contracts.Submissions.LodgingBilletingReferral, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(s => new PrintSupplier
                {
                    Address = s.HostAddress,
                    City = s.HostCity,
                    Telephone = s.HostPhone,
                    Name = s.HostName
                }))
                ;

            CreateMap<Shared.Contracts.Submissions.LodgingGroupReferral, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(supplier => new PrintSupplier
                {
                    Address = supplier.FacilityAddress,
                    City = supplier.FacilityCity,
                    Telephone = supplier.FacilityContactPhone,
                    Name = supplier.FacilityName
                }))
                ;

            CreateMap<Shared.Contracts.Submissions.TransportationOtherReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.OtherTransportModeDetails, opts => opts.MapFrom(s => s.TransportMode))
                ;

            CreateMap<Shared.Contracts.Submissions.TransportationTaxiReferral, PrintReferral>()
                .ForMember(d => d.FromAddress, opts => opts.MapFrom(s => s.FromAddress))
                .ForMember(d => d.ToAddress, opts => opts.MapFrom(s => s.ToAddress))
                ;

            CreateMap<Shared.Contracts.Submissions.SupplierDetails, PrintSupplier>()
                .ForMember(d => d.Address, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.Address.AddressLine2) ? s.Address.AddressLine1 : s.Address.AddressLine1 + "," + s.Address.AddressLine2))
                .ForMember(d => d.City, opts => opts.MapFrom(s => s.Address.City))
                .ForMember(d => d.Name, opts => opts.MapFrom(s => s.Name))
                .ForMember(d => d.Province, opts => opts.MapFrom(s => s.Address.StateProvince))
                .ForMember(d => d.PostalCode, opts => opts.MapFrom(s => s.Address.PostalCode))
                .ForMember(d => d.Telephone, opts => opts.MapFrom(s => s.Phone))
                ;

            Func<Shared.Contracts.Submissions.HouseholdMember, string> mapEvacueeTType = m =>
                m.IsPrimaryRegistrant
                    ? "M" //main
                    : m.IsUnder19
                        ? "C" //child
                        : "A"; //adult

            CreateMap<Shared.Contracts.Submissions.HouseholdMember, PrintEvacuee>()
                .ForMember(d => d.EvacueeTypeCode, opts => opts.MapFrom(s => mapEvacueeTType(s)))
                ;
        }

        private static PrintReferralType MapSupportType(Shared.Contracts.Submissions.Support support) =>
            support switch
            {
                Shared.Contracts.Submissions.ClothingReferral _ => PrintReferralType.Clothing,
                Shared.Contracts.Submissions.FoodGroceriesReferral _ => PrintReferralType.Groceries,
                Shared.Contracts.Submissions.FoodRestaurantReferral _ => PrintReferralType.Meals,
                Shared.Contracts.Submissions.IncidentalsReferral _ => PrintReferralType.Incidentals,
                Shared.Contracts.Submissions.LodgingBilletingReferral _ => PrintReferralType.Billeting,
                Shared.Contracts.Submissions.LodgingGroupReferral _ => PrintReferralType.GroupLodging,
                Shared.Contracts.Submissions.LodgingHotelReferral _ => PrintReferralType.Hotel,
                Shared.Contracts.Submissions.TransportationOtherReferral _ => PrintReferralType.Transportation,
                Shared.Contracts.Submissions.TransportationTaxiReferral _ => PrintReferralType.Taxi,
                _ => throw new NotImplementedException()
            };
    }
}
