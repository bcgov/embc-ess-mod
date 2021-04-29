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
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Cases
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<EvacuationFile, era_evacuationfile>(MemberList.None)
                .ForMember(d => d.era_essfilenumber, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.era_evacuationfiledate, opts => opts.MapFrom(s => s.EvacuationDate))
                .ForMember(d => d.era_needsassessment_EvacuationFile, opts => opts.MapFrom(s => s.NeedsAssessments))
                .ForMember(d => d.era_addressline1, opts => opts.MapFrom(s => s.EvacuatedFromAddress.AddressLine1))
                .ForMember(d => d.era_addressline2, opts => opts.MapFrom(s => s.EvacuatedFromAddress.AddressLine2))
                .ForMember(d => d.era_postalcode, opts => opts.MapFrom(s => s.EvacuatedFromAddress.PostalCode))
                .ForMember(d => d.era_city, opts => opts.MapFrom(s => s.EvacuatedFromAddress.Community))
                .ForMember(d => d.era_country, opts => opts.MapFrom(s => s.EvacuatedFromAddress.Country))
                .ForMember(d => d.era_province, opts => opts.MapFrom(s => s.EvacuatedFromAddress.StateProvince))
                ;

            CreateMap<era_evacuationfile, EvacuationFile>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_essfilenumber))
                .ForMember(d => d.PrimaryRegistrantId, opts => opts.MapFrom(s => s.era_Registrant.contactid.ToString()))
                .ForMember(d => d.SecretPhrase, opts => opts.MapFrom(s => s.era_secrettext))
                .ForMember(d => d.EvacuationDate, opts => opts.MapFrom(s => s.era_evacuationfiledate))
                .ForMember(d => d.NeedsAssessments, opts => opts.MapFrom(s => s.era_needsassessment_EvacuationFile))
                .ForMember(d => d.EvacuatedFromAddress, opts => opts.MapFrom(s => s))
                ;

            CreateMap<EvacuationAddress, era_evacuationfile>(MemberList.None)
                .ForMember(d => d.era_addressline1, opts => opts.MapFrom(s => s.AddressLine1))
                .ForMember(d => d.era_addressline2, opts => opts.MapFrom(s => s.AddressLine2))
                .ForMember(d => d.era_postalcode, opts => opts.MapFrom(s => s.PostalCode))
                .ForMember(d => d.era_Jurisdiction, opts => opts.Ignore())
                .ReverseMap()
                .ForMember(d => d.AddressLine1, opts => opts.MapFrom(s => s.era_addressline1))
                .ForMember(d => d.AddressLine2, opts => opts.MapFrom(s => s.era_addressline2))
                .ForMember(d => d.PostalCode, opts => opts.MapFrom(s => s.era_postalcode))
                .ForMember(d => d.Community, opts => opts.MapFrom(s => s.era_Jurisdiction.era_jurisdictionid))
                .ForMember(d => d.StateProvince, opts => opts.MapFrom(s => s.era_Jurisdiction.era_RelatedProvinceState.era_code))
                .ForMember(d => d.Country, opts => opts.MapFrom(s => s.era_Jurisdiction.era_RelatedProvinceState.era_RelatedCountry.era_countrycode))
                ;

            CreateMap<NeedsAssessment, era_needassessment>(MemberList.None)
                .ForMember(d => d.era_needassessmentid, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.era_needsassessmenttype, opts => opts.MapFrom(s => s.Type))
                .ForMember(d => d.era_canevacueeprovidefood, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideFood)))
                .ForMember(d => d.era_canevacueeprovideclothing, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideClothing)))
                .ForMember(d => d.era_canevacueeprovideincidentals, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideIncidentals)))
                .ForMember(d => d.era_canevacueeprovidelodging, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideLodging)))
                .ForMember(d => d.era_canevacueeprovidetransportation, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideTransportation)))
                .ForMember(d => d.era_dietaryrequirement, opts => opts.MapFrom(s => s.HaveSpecialDiet))
                .ForMember(d => d.era_dietaryrequirementdetails, opts => opts.MapFrom(s => s.SpecialDietDetails))
                .ForMember(d => d.era_medicationrequirement, opts => opts.MapFrom(s => s.HaveMedication))
                .ForMember(d => d.era_insurancecoverage, opts => opts.MapFrom(s => (int?)s.Insurance))
                .ForMember(d => d.era_haspetfood, opts => opts.MapFrom(s => Lookup(s.HasPetsFood)))
                ;

            CreateMap<era_needassessment, NeedsAssessment>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_needassessmentid))
                .ForMember(d => d.Type, opts => opts.MapFrom(s => s.era_needsassessmenttype))
                .ForMember(d => d.CanEvacueeProvideClothing, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovideclothing)))
                .ForMember(d => d.CanEvacueeProvideFood, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovidefood)))
                .ForMember(d => d.CanEvacueeProvideIncidentals, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovideincidentals)))
                .ForMember(d => d.CanEvacueeProvideLodging, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovidelodging)))
                .ForMember(d => d.CanEvacueeProvideTransportation, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovidetransportation)))
                .ForMember(d => d.HaveMedication, opts => opts.MapFrom(s => s.era_medicationrequirement))
                .ForMember(d => d.Insurance, opts => opts.MapFrom(s => (InsuranceOption)s.era_insurancecoverage))
                .ForMember(d => d.HaveSpecialDiet, opts => opts.MapFrom(s => s.era_dietaryrequirement))
                .ForMember(d => d.SpecialDietDetails, opts => opts.MapFrom(s => s.era_dietaryrequirementdetails))
                .ForMember(d => d.HasPetsFood, opts => opts.MapFrom(s => Lookup(s.era_haspetfood)))
                .ForMember(d => d.HouseholdMembers, opts => opts.MapFrom(s => Array.Empty<HouseholdMember>()))
                .ForMember(d => d.Pets, opts => opts.MapFrom(s => Array.Empty<Pet>()))
               ;

            //CreateMap<HouseholdMember, contact>()
            //    .ReverseMap()
            //    ;

            //CreateMap<HouseholdMember, era_householdmember>()
            //   .ReverseMap()
            //   ;

            //CreateMap<Pet, era_householdmember>()
            //   .ReverseMap()
            //   ;
        }

        private int Lookup(bool? value) => value.HasValue ? value.Value ? 174360000 : 174360001 : 174360002;

        private bool? Lookup(int? value) => value switch
        {
            174360000 => true,
            174360001 => false,
            174360002 => null,
            _ => null
        };
    }
}
