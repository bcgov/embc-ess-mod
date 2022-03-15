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
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Supports
{
    public class Mappings : Profile
    {
        private Support SupportConstructor(era_evacueesupport s, ResolutionContext ctx) =>
            (SupportType)s.era_supporttype switch
            {
                SupportType.Clothing => new ClothingReferral(),
                SupportType.Incidentals => new IncidentalsReferral(),
                SupportType.FoodGroceries => new FoodGroceriesReferral(),
                SupportType.FoodRestaurant => new FoodRestaurantReferral(),
                SupportType.LodgingBilleting => new LodgingBilletingReferral(),
                SupportType.LodgingGroup => new LodgingGroupReferral(),
                SupportType.LodgingHotel => new LodgingHotelReferral(),
                SupportType.TransporationTaxi => new TransportationTaxiReferral(),
                SupportType.TransportationOther => new TransportationOtherReferral(),
                _ => throw new NotImplementedException($"No known type for support type value '{s.era_supporttype}'")
            };

        public Mappings()
        {
            CreateMap<IEnumerable<era_evacueesupport>, IEnumerable<Support>>().ConvertUsing<SupportConverter>();

            CreateMap<era_evacueesupport, Support>()
                .ConstructUsing(SupportConstructor)
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_name))
                .ForMember(d => d.FileId, opts => opts.MapFrom(s => s.era_EvacuationFileId.era_name))
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.createdon.Value.UtcDateTime))
                .ForMember(d => d.CreatedByTeamMemberId, opts => opts.MapFrom(s => s._era_issuedbyid_value))
                .ForMember(d => d.IssuedOn, opts => opts.MapFrom(s => s.createdon.Value.UtcDateTime))
                .ForMember(d => d.OriginatingNeedsAssessmentId, opts => opts.MapFrom(s => s._era_needsassessmentid_value))
                .ForMember(d => d.From, opts => opts.MapFrom(s => s.era_validfrom.HasValue ? s.era_validfrom.Value.UtcDateTime : DateTime.MinValue))
                .ForMember(d => d.To, opts => opts.MapFrom(s => s.era_validto.HasValue ? s.era_validto.Value.UtcDateTime : DateTime.MinValue))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.statuscode))
                .ForMember(d => d.IncludedHouseholdMembers, opts => opts.MapFrom(s => s.era_era_householdmember_era_evacueesupport.Select(m => m.era_householdmemberid)))
                .ReverseMap()
                .IncludeAllDerived()
                .ValidateMemberList(MemberList.Source)
                .ForSourceMember(s => s.IncludedHouseholdMembers, opts => opts.DoNotValidate())
                .ForSourceMember(s => s.Status, opts => opts.DoNotValidate())
                .ForSourceMember(s => s.FileId, opts => opts.DoNotValidate())
                .ForMember(d => d.era_name, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.era_validfrom, opts => opts.MapFrom(s => s.From))
                .ForMember(d => d.era_validto, opts => opts.MapFrom(s => s.To))
                .ForMember(d => d.statuscode, opts => opts.MapFrom(s => s.To < DateTime.UtcNow ? SupportStatus.Expired : SupportStatus.Active))
                .ForMember(d => d.era_era_householdmember_era_evacueesupport,
                    opts => opts.MapFrom(s => s.IncludedHouseholdMembers.Select(m => new era_householdmember { era_householdmemberid = Guid.Parse(m) })))
                ;

            CreateMap<era_evacueesupport, Referral>()
                .IncludeBase<era_evacueesupport, Support>()
                .ForMember(d => d.IssuedToPersonName, opts => opts.MapFrom(s => s.era_purchaserofgoods))
                .ForMember(d => d.SupplierId, opts => opts.MapFrom(s => s._era_supplierid_value))
                .ForMember(d => d.SupplierNotes, opts => opts.MapFrom(s => s.era_suppliernote))
                .ForMember(d => d.ExternalReferenceId, opts => opts.MapFrom(s => s.era_manualsupport))
                .ForMember(d => d.IssuedOn, opts => opts.MapFrom(s => s.era_paperreferralcompletedon.HasValue
                    ? s.era_paperreferralcompletedon.Value.UtcDateTime
                    : s.createdon.Value.UtcDateTime))
                .ForMember(d => d.IssuedByDisplayName, opts => opts.MapFrom(s => s.era_paperissuedby))
                .ReverseMap()
                .IncludeAllDerived()
                .ValidateMemberList(MemberList.Source)
                .ForSourceMember(s => s.IssuedByDisplayName, opts => opts.DoNotValidate())
                .ForMember(d => d._era_supplierid_value, opts => opts.MapFrom(s => s.SupplierId))
                .ForMember(d => d.era_suppliernote, opts => opts.MapFrom(s => s.SupplierNotes))
                .ForMember(d => d.era_supportdeliverytype, opts => opts.MapFrom(s => SupportMethod.Referral))
                .ForMember(d => d.era_manualsupport, opts => opts.MapFrom(s => s.ExternalReferenceId))
                .ForMember(d => d.era_paperissuedby, opts => opts.MapFrom(s => s.ExternalReferenceId != null ? s.IssuedByDisplayName : null))
                .ForMember(d => d.era_paperreferralcompletedon, opts => opts.MapFrom(s => s.ExternalReferenceId != null ? s.IssuedOn : (DateTimeOffset?)null))
                ;

            CreateMap<era_evacueesupport, ClothingReferral>()
                .IncludeBase<era_evacueesupport, Referral>()
                .ForMember(d => d.TotalAmount, opts => opts.MapFrom(s => s.era_totalamount))
                .ForMember(d => d.ExtremeWinterConditions, opts => opts.MapFrom(s => s.era_extremewinterconditions == (int)EraTwoOptions.Yes))
                .ForMember(d => d.ApproverName, opts => opts.MapFrom(s => s.era_supportoverrideauthority))
                .ReverseMap()
                .ForMember(d => d.era_extremewinterconditions, opts => opts.MapFrom(s => s.ExtremeWinterConditions ? EraTwoOptions.Yes : EraTwoOptions.No))
                .ForMember(d => d.era_supporttype, opts => opts.MapFrom(s => SupportType.Clothing))
                .ForMember(d => d.era_amountoverride, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.ApproverName)))
                ;

            CreateMap<era_evacueesupport, IncidentalsReferral>()
                .IncludeBase<era_evacueesupport, Referral>()
                .ForMember(d => d.TotalAmount, opts => opts.MapFrom(s => s.era_totalamount))
                .ForMember(d => d.ApprovedItems, opts => opts.MapFrom(s => s.era_approveditems))
                .ForMember(d => d.ApproverName, opts => opts.MapFrom(s => s.era_supportoverrideauthority))
                .ReverseMap()
                .ForMember(d => d.era_supporttype, opts => opts.MapFrom(s => SupportType.Incidentals))
                .ForMember(d => d.era_amountoverride, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.ApproverName)))
                ;

            CreateMap<era_evacueesupport, FoodGroceriesReferral>()
                .IncludeBase<era_evacueesupport, Referral>()
                .ForMember(d => d.TotalAmount, opts => opts.MapFrom(s => s.era_totalamount))
                .ForMember(d => d.NumberOfDays, opts => opts.MapFrom(s => s.era_numberofmeals))
                .ForMember(d => d.ApproverName, opts => opts.MapFrom(s => s.era_supportoverrideauthority))
                .ReverseMap()
                .ForMember(d => d.era_supporttype, opts => opts.MapFrom(s => SupportType.FoodGroceries))
                .ForMember(d => d.era_amountoverride, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.ApproverName)))
                ;

            CreateMap<era_evacueesupport, FoodRestaurantReferral>()
                .IncludeBase<era_evacueesupport, Referral>()
                .ForMember(d => d.TotalAmount, opts => opts.MapFrom(s => s.era_totalamount))
                .ForMember(d => d.NumberOfBreakfastsPerPerson, opts => opts.MapFrom(s => s.era_numberofbreakfasts))
                .ForMember(d => d.NumberOfLunchesPerPerson, opts => opts.MapFrom(s => s.era_numberoflunches))
                .ForMember(d => d.NumberOfDinnersPerPerson, opts => opts.MapFrom(s => s.era_numberofdinners))
                .ReverseMap()
                .ForMember(d => d.era_supporttype, opts => opts.MapFrom(s => SupportType.FoodRestaurant))
                ;

            CreateMap<era_evacueesupport, LodgingBilletingReferral>()
                .IncludeBase<era_evacueesupport, Referral>()
                .ForMember(d => d.NumberOfNights, opts => opts.MapFrom(s => s.era_numberofnights))
                .ForMember(d => d.HostAddress, opts => opts.MapFrom(s => s.era_lodgingaddress))
                .ForMember(d => d.HostCity, opts => opts.MapFrom(s => s.era_lodgingcity))
                .ForMember(d => d.HostEmail, opts => opts.MapFrom(s => s.era_lodgingemailaddress))
                .ForMember(d => d.HostPhone, opts => opts.MapFrom(s => s.era_lodgingcontactnumber))
                .ForMember(d => d.HostName, opts => opts.MapFrom(s => s.era_lodgingname))
                .ReverseMap()
                .ForMember(d => d.era_supporttype, opts => opts.MapFrom(s => SupportType.LodgingBilleting))
                ;

            CreateMap<era_evacueesupport, LodgingGroupReferral>()
                .IncludeBase<era_evacueesupport, Referral>()
                .ForMember(d => d.NumberOfNights, opts => opts.MapFrom(s => s.era_numberofnights))
                .ForMember(d => d.FacilityAddress, opts => opts.MapFrom(s => s.era_lodgingaddress))
                .ForMember(d => d.FacilityCity, opts => opts.MapFrom(s => s.era_lodgingcity))
                .ForMember(d => d.FacilityCommunityCode, opts => opts.MapFrom(s => s._era_grouplodgingcityid_value))
                .ForMember(d => d.FacilityContactPhone, opts => opts.MapFrom(s => s.era_lodgingcontactnumber))
                .ForMember(d => d.FacilityName, opts => opts.MapFrom(s => s.era_lodgingname))
                .ReverseMap()
                .ForMember(d => d.era_supporttype, opts => opts.MapFrom(s => SupportType.LodgingGroup))
                ;

            CreateMap<era_evacueesupport, LodgingHotelReferral>()
                .IncludeBase<era_evacueesupport, Referral>()
                .ForMember(d => d.NumberOfNights, opts => opts.MapFrom(s => s.era_numberofnights))
                .ForMember(d => d.NumberOfRooms, opts => opts.MapFrom(s => s.era_numberofrooms))
                .ReverseMap()
                .ForMember(d => d.era_supporttype, opts => opts.MapFrom(s => SupportType.LodgingHotel))
                ;

            CreateMap<era_evacueesupport, TransportationOtherReferral>()
                .IncludeBase<era_evacueesupport, Referral>()
                .ForMember(d => d.TotalAmount, opts => opts.MapFrom(s => s.era_totalamount))
                .ForMember(d => d.TransportMode, opts => opts.MapFrom(s => s.era_transportmode))
                .ReverseMap()
                .ForMember(d => d.era_supporttype, opts => opts.MapFrom(s => SupportType.TransportationOther))
               ;

            CreateMap<era_evacueesupport, TransportationTaxiReferral>()
                .IncludeBase<era_evacueesupport, Referral>()
                .ForMember(d => d.FromAddress, opts => opts.MapFrom(s => s.era_fromaddress))
                .ForMember(d => d.ToAddress, opts => opts.MapFrom(s => s.era_toaddress))
                .ReverseMap()
                .ForMember(d => d.era_supporttype, opts => opts.MapFrom(s => SupportType.TransporationTaxi))
                ;
        }
    }

    /// <summary>
    /// Automapper converter to help transforming Dynamics support entity into the correct Support concrete object
    /// </summary>
    public class SupportConverter :
       ITypeConverter<IEnumerable<era_evacueesupport>, IEnumerable<Support>>
    {
        public IEnumerable<Support> Convert(IEnumerable<era_evacueesupport> source, IEnumerable<Support> destination, ResolutionContext context)
        {
            return source.Select(s => (Support)context.Mapper.Map(s, typeof(era_evacueesupport), supportTypeResolver((SupportType?)s.era_supporttype)));
        }

        private Type supportTypeResolver(SupportType? supportType) =>
            supportType switch
            {
                SupportType.Clothing => typeof(ClothingReferral),
                SupportType.Incidentals => typeof(IncidentalsReferral),
                SupportType.FoodGroceries => typeof(FoodGroceriesReferral),
                SupportType.FoodRestaurant => typeof(FoodRestaurantReferral),
                SupportType.LodgingBilleting => typeof(LodgingBilletingReferral),
                SupportType.LodgingGroup => typeof(LodgingGroupReferral),
                SupportType.LodgingHotel => typeof(LodgingHotelReferral),
                SupportType.TransporationTaxi => typeof(TransportationTaxiReferral),
                SupportType.TransportationOther => typeof(TransportationOtherReferral),

                _ => throw new NotImplementedException($"No known type for support type value '{supportType}'")
            };
    }
}
