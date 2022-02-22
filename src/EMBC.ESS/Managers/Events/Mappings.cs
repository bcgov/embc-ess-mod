﻿// -------------------------------------------------------------------------
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
using EMBC.ESS.Managers.Events.PrintReferrals;
using EMBC.ESS.Resources.Evacuations;
using EMBC.ESS.Resources.Evacuees;
using EMBC.ESS.Resources.Supports;
using EMBC.ESS.Utilities.Extensions;

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
                ;
            CreateMap<Evacuee, Shared.Contracts.Events.RegistrantProfile>()
                .ForMember(d => d.AuthenticatedUser, opts => opts.MapFrom(s => s.Authenticated))
                .ForMember(d => d.VerifiedUser, opts => opts.MapFrom(s => s.Verified))
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
                ;

            CreateMap<HouseholdMember, Shared.Contracts.Events.EvacuationFileSearchResultHouseholdMember>()
                .ForMember(d => d.IsSearchMatch, opts => opts.Ignore())
                .ForMember(d => d.RestrictedAccess, opts => opts.MapFrom(s => s.HasAccessRestriction))
                ;

            CreateMap<Support, Shared.Contracts.Events.Support>()
                .ForMember(d => d.CreatedBy, opts => opts.MapFrom(s => s.CreatedByTeamMemberId == null
                    ? null
                    : new Shared.Contracts.Events.TeamMember { Id = s.CreatedByTeamMemberId }))
                .ForMember(d => d.IssuedBy, opts => opts.Ignore())
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                .IncludeAllDerived()
                .ForMember(d => d.CreatedByTeamMemberId, opts => opts.MapFrom(s => s.CreatedBy.Id))
                ;

            CreateMap<Referral, Shared.Contracts.Events.Referral>()
                .IncludeBase<Support, Shared.Contracts.Events.Support>()
                .ForMember(d => d.SupplierDetails, opts => opts.MapFrom(s => s.SupplierId == null
                    ? null
                    : new Shared.Contracts.Events.SupplierDetails { Id = s.SupplierId }))
                .ForMember(d => d.IssuedBy, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.IssuedByDisplayName)
                    ? null
                    : new Shared.Contracts.Events.TeamMember { DisplayName = s.IssuedByDisplayName }))
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination)
                .IncludeAllDerived()
                .ForMember(d => d.SupplierId, opts => opts.MapFrom(s => s.SupplierDetails != null ? s.SupplierDetails.Id : null))
                .ForMember(d => d.IssuedByDisplayName, opts => opts.MapFrom(s => s.IssuedBy == null ? null : s.IssuedBy.DisplayName))
                ;

            CreateMap<ClothingReferral, Shared.Contracts.Events.ClothingReferral>()
                .IncludeBase<Referral, Shared.Contracts.Events.Referral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<IncidentalsReferral, Shared.Contracts.Events.IncidentalsReferral>()
                .IncludeBase<Referral, Shared.Contracts.Events.Referral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<FoodGroceriesReferral, Shared.Contracts.Events.FoodGroceriesReferral>()
                .IncludeBase<Referral, Shared.Contracts.Events.Referral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<FoodRestaurantReferral, Shared.Contracts.Events.FoodRestaurantReferral>()
                .IncludeBase<Referral, Shared.Contracts.Events.Referral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<LodgingBilletingReferral, Shared.Contracts.Events.LodgingBilletingReferral>()
                .IncludeBase<Referral, Shared.Contracts.Events.Referral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<LodgingGroupReferral, Shared.Contracts.Events.LodgingGroupReferral>()
                .IncludeBase<Referral, Shared.Contracts.Events.Referral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<LodgingHotelReferral, Shared.Contracts.Events.LodgingHotelReferral>()
                .IncludeBase<Referral, Shared.Contracts.Events.Referral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<TransportationTaxiReferral, Shared.Contracts.Events.TransportationTaxiReferral>()
                .IncludeBase<Referral, Shared.Contracts.Events.Referral>()
                .ReverseMap()
                .ValidateMemberList(MemberList.Destination);

            CreateMap<TransportationOtherReferral, Shared.Contracts.Events.TransportationOtherReferral>()
                .IncludeBase<Referral, Shared.Contracts.Events.Referral>()
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

            CreateMap<Shared.Contracts.Events.Referral, PrintReferral>()
                .IncludeAllDerived()
                .ForMember(d => d.Id, m => m.MapFrom(s => s.Id))
                .ForMember(d => d.PurchaserName, opts => opts.MapFrom(s => s.IssuedToPersonName))
                .ForMember(d => d.FromDate, m => m.MapFrom(s => s.From.ToPST().ToString("dd-MMM-yyyy")))
                .ForMember(d => d.FromTime, m => m.MapFrom(s => s.From.ToPST().ToString("hh:mm tt")))
                .ForMember(d => d.ToDate, m => m.MapFrom(s => s.To.ToPST().ToString("dd-MMM-yyyy")))
                .ForMember(d => d.ToTime, m => m.MapFrom(s => s.To.ToPST().ToString("hh:mm tt")))
                .ForMember(d => d.Type, m => m.MapFrom(s => MapSupportType(s)))
                .ForMember(d => d.PrintDate, m => m.MapFrom(s => DateTime.Now.ToString("dd-MMM-yyyy")))
                .ForMember(d => d.Comments, opts => opts.MapFrom(s => s.SupplierNotes))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(s => s.SupplierDetails))
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

            CreateMap<Shared.Contracts.Events.FoodRestaurantReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.NumBreakfasts, opts => opts.MapFrom(s => s.NumberOfBreakfastsPerPerson))
                .ForMember(d => d.NumLunches, opts => opts.MapFrom(s => s.NumberOfLunchesPerPerson))
                .ForMember(d => d.NumDinners, opts => opts.MapFrom(s => s.NumberOfDinnersPerPerson))
                ;

            CreateMap<Shared.Contracts.Events.ClothingReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                ;

            CreateMap<Shared.Contracts.Events.IncidentalsReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.ApprovedItems, opts => opts.MapFrom(s => s.ApprovedItems))
                ;

            CreateMap<Shared.Contracts.Events.FoodGroceriesReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.NumDaysMeals, opts => opts.MapFrom(s => s.NumberOfDays))
                ;

            CreateMap<Shared.Contracts.Events.LodgingHotelReferral, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.NumRooms, opts => opts.MapFrom(s => s.NumberOfRooms))
                ;

            CreateMap<Shared.Contracts.Events.LodgingBilletingReferral, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(s => new PrintSupplier
                {
                    Address = s.HostAddress,
                    City = s.HostCity,
                    Telephone = s.HostPhone,
                    Name = s.HostName
                }))
                ;

            CreateMap<Shared.Contracts.Events.LodgingGroupReferral, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(supplier => new PrintSupplier
                {
                    Address = supplier.FacilityAddress,
                    City = supplier.FacilityCity,
                    Telephone = supplier.FacilityContactPhone,
                    Name = supplier.FacilityName
                }))
                ;

            CreateMap<Shared.Contracts.Events.TransportationOtherReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.OtherTransportModeDetails, opts => opts.MapFrom(s => s.TransportMode))
                ;

            CreateMap<Shared.Contracts.Events.TransportationTaxiReferral, PrintReferral>()
                .ForMember(d => d.FromAddress, opts => opts.MapFrom(s => s.FromAddress))
                .ForMember(d => d.ToAddress, opts => opts.MapFrom(s => s.ToAddress))
                ;

            CreateMap<Shared.Contracts.Events.SupplierDetails, PrintSupplier>()
                .ForMember(d => d.Address, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.Address.AddressLine2) ? s.Address.AddressLine1 : s.Address.AddressLine1 + "," + s.Address.AddressLine2))
                .ForMember(d => d.City, opts => opts.MapFrom(s => s.Address.City))
                .ForMember(d => d.Name, opts => opts.MapFrom(s => s.Name))
                .ForMember(d => d.Province, opts => opts.MapFrom(s => s.Address.StateProvince))
                .ForMember(d => d.PostalCode, opts => opts.MapFrom(s => s.Address.PostalCode))
                .ForMember(d => d.Telephone, opts => opts.MapFrom(s => s.Phone))
                ;

            Func<Shared.Contracts.Events.HouseholdMember, string> mapEvacueeTType = m =>
                m.IsPrimaryRegistrant
                    ? "M" //main
                    : m.IsUnder19
                        ? "C" //child
                        : "A"; //adult

            CreateMap<Shared.Contracts.Events.HouseholdMember, PrintEvacuee>()
                .ForMember(d => d.EvacueeTypeCode, opts => opts.MapFrom(s => mapEvacueeTType(s)))
                ;
        }

        private static PrintReferralType MapSupportType(Shared.Contracts.Events.Support support) =>
            support switch
            {
                Shared.Contracts.Events.ClothingReferral _ => PrintReferralType.Clothing,
                Shared.Contracts.Events.FoodGroceriesReferral _ => PrintReferralType.Groceries,
                Shared.Contracts.Events.FoodRestaurantReferral _ => PrintReferralType.Meals,
                Shared.Contracts.Events.IncidentalsReferral _ => PrintReferralType.Incidentals,
                Shared.Contracts.Events.LodgingBilletingReferral _ => PrintReferralType.Billeting,
                Shared.Contracts.Events.LodgingGroupReferral _ => PrintReferralType.GroupLodging,
                Shared.Contracts.Events.LodgingHotelReferral _ => PrintReferralType.Hotel,
                Shared.Contracts.Events.TransportationOtherReferral _ => PrintReferralType.Transportation,
                Shared.Contracts.Events.TransportationTaxiReferral _ => PrintReferralType.Taxi,
                _ => throw new NotImplementedException()
            };
    }
}
