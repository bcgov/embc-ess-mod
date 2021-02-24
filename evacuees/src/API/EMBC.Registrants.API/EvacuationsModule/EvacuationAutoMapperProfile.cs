// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
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

using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using AutoMapper;
using EMBC.Registrants.API.Shared;
using Microsoft.Dynamics.CRM;

namespace EMBC.Registrants.API.EvacuationsModule
{
    public class EvacuationAutoMapperProfile : AutoMapper.Profile
    {
        public EvacuationAutoMapperProfile()
        {
            CreateMap<era_needassessment, NeedsAssessment>() //.IncludeMembers(s => s.era_EvacuationFile)
                //.ForMember(d => d, opts => opts.MapFrom(s => s.era_EvacuationFile))
                .ForMember(d => d.CanEvacueeProvideClothing, opts => opts.MapFrom(s => s.era_canevacueeprovideclothing))
                .ForMember(d => d.CanEvacueeProvideFood, opts => opts.MapFrom(s => s.era_canevacueeprovidefood))
                .ForMember(d => d.CanEvacueeProvideIncidentals, opts => opts.MapFrom(s => s.era_canevacueeprovideincidentals))
                .ForMember(d => d.CanEvacueeProvideLodging, opts => opts.MapFrom(s => s.era_canevacueeprovidelodging))
                .ForMember(d => d.CanEvacueeProvideTransportation, opts => opts.MapFrom(s => s.era_canevacueeprovidetransportation))
                .ForMember(d => d.HaveMedication, opts => opts.MapFrom(s => s.era_medicationrequirement))
                .ForMember(d => d.Insurance, opts => opts.MapFrom(s => (NeedsAssessment.InsuranceOption)s.era_insurancecoverage))
                .ForMember(d => d.HaveSpecialDiet, opts => opts.MapFrom(s => s.era_dietaryrequirement))
                .ForMember(d => d.SpecialDietDetails, opts => opts.MapFrom(s => s.era_dietaryrequirementdetails))
                .ForMember(d => d.HasPetsFood, opts => opts.MapFrom(s => s.era_haspetfood))
                .ForMember(d => d.FamilyMembers, opts => opts.MapFrom(s => new List<PersonDetails>()))
                .ForMember(d => d.Pets, opts => opts.MapFrom(s => new List<Pet>()))
                .ForPath(d => d.EvacuatedFromAddress.AddressLine1, opts => opts.MapFrom(s => s.era_EvacuationFile.era_addressline1))
                .ForPath(d => d.EvacuatedFromAddress.AddressLine2, opts => opts.MapFrom(s => s.era_EvacuationFile.era_addressline2))
                .ForPath(d => d.EvacuatedFromAddress.PostalCode, opts => opts.MapFrom(s => s.era_EvacuationFile.era_postalcode))
                .ForPath(d => d.EvacuatedFromAddress.Country.Name, opts => opts.MapFrom(s => s.era_EvacuationFile.era_country))
                .ForPath(d => d.EvacuatedFromAddress.StateProvince.Name, opts => opts.MapFrom(s => s.era_EvacuationFile.era_province))
                .ForPath(d => d.EvacuatedFromAddress.Jurisdiction, opts => opts.MapFrom(s => s.era_EvacuationFile.era_Jurisdiction))

                .ReverseMap()

                //.ForMember(d => d.era_EvacuationFile, opts => opts.MapFrom(s => s))
                .ForMember(d => d.era_needsassessmenttype, opts => opts.MapFrom(s => NeedsAssessmentType.Preliminary))
                .ForMember(d => d.era_canevacueeprovidefood, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideFood)))
                .ForMember(d => d.era_canevacueeprovideclothing, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideClothing)))
                .ForMember(d => d.era_canevacueeprovideincidentals, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideIncidentals)))
                .ForMember(d => d.era_canevacueeprovidelodging, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideLodging)))
                .ForMember(d => d.era_canevacueeprovidetransportation, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideTransportation)))
                .ForMember(d => d.era_dietaryrequirement, opts => opts.MapFrom(s => s.HaveSpecialDiet))
                .ForMember(d => d.era_dietaryrequirementdetails, opts => opts.MapFrom(s => s.SpecialDietDetails))
                .ForMember(d => d.era_medicationrequirement, opts => opts.MapFrom(s => s.HaveMedication))
                .ForMember(d => (NeedsAssessment.InsuranceOption)d.era_insurancecoverage, opts => opts.MapFrom(s => s.Insurance))
                .ForMember(d => d.era_haspetfood, opts => opts.MapFrom(s => Lookup(s.HasPetsFood)))
                .ForPath(d => d.era_EvacuationFile.era_addressline1, opts => opts.MapFrom(s => s.EvacuatedFromAddress.AddressLine1))
                .ForPath(d => d.era_EvacuationFile.era_addressline2, opts => opts.MapFrom(s => s.EvacuatedFromAddress.AddressLine2))
                .ForPath(d => d.era_EvacuationFile.era_postalcode, opts => opts.MapFrom(s => s.EvacuatedFromAddress.PostalCode))
                .ForPath(d => d.era_EvacuationFile.era_country, opts => opts.MapFrom(s => s.EvacuatedFromAddress.Country.Name))
                .ForPath(d => d.era_EvacuationFile.era_province, opts => opts.MapFrom(s => s.EvacuatedFromAddress.StateProvince.Name))
                .ForPath(d => d.era_EvacuationFile.era_Jurisdiction, opts => opts.MapFrom(s => s.EvacuatedFromAddress.Jurisdiction));

            CreateMap<era_evacuationfile, NeedsAssessment>()
                .ForMember(d => d.CanEvacueeProvideClothing, opts => opts.MapFrom(s => false))
                .ForMember(d => d.CanEvacueeProvideFood, opts => opts.MapFrom(s => false))
                .ForMember(d => d.CanEvacueeProvideIncidentals, opts => opts.MapFrom(s => false))
                .ForMember(d => d.CanEvacueeProvideLodging, opts => opts.MapFrom(s => false))
                .ForMember(d => d.CanEvacueeProvideTransportation, opts => opts.MapFrom(s => false))
                .ForMember(d => d.HaveMedication, opts => opts.MapFrom(s => false))
                .ForMember(d => d.Insurance, opts => opts.MapFrom(s => NeedsAssessment.InsuranceOption.Unknown))
                .ForMember(d => d.HaveSpecialDiet, opts => opts.MapFrom(s => false))
                .ForMember(d => d.SpecialDietDetails, opts => opts.MapFrom(s => new string(string.Empty)))
                .ForMember(d => d.HasPetsFood, opts => opts.MapFrom(s => false))
                .ForMember(d => d.FamilyMembers, opts => opts.MapFrom(s => new List<PersonDetails>()))
                .ForMember(d => d.Pets, opts => opts.MapFrom(s => new List<Pet>()))
                .ForPath(d => d.EvacuatedFromAddress.AddressLine1, opts => opts.MapFrom(s => s.era_addressline1))
                .ForPath(d => d.EvacuatedFromAddress.AddressLine2, opts => opts.MapFrom(s => s.era_addressline2))
                .ForPath(d => d.EvacuatedFromAddress.PostalCode, opts => opts.MapFrom(s => s.era_postalcode))
                .ForPath(d => d.EvacuatedFromAddress.Country.Name, opts => opts.MapFrom(s => s.era_country))
                .ForPath(d => d.EvacuatedFromAddress.StateProvince.Name, opts => opts.MapFrom(s => s.era_province))
                .ForPath(d => d.EvacuatedFromAddress.Jurisdiction, opts => opts.MapFrom(s => s.era_Jurisdiction))

                .ReverseMap()

                .ForPath(d => d.era_addressline1, opts => opts.MapFrom(s => s.EvacuatedFromAddress.AddressLine1))
                .ForPath(d => d.era_addressline2, opts => opts.MapFrom(s => s.EvacuatedFromAddress.AddressLine2))
                .ForPath(d => d.era_postalcode, opts => opts.MapFrom(s => s.EvacuatedFromAddress.PostalCode))
                .ForPath(d => d.era_country, opts => opts.MapFrom(s => s.EvacuatedFromAddress.Country.Name))
                .ForPath(d => d.era_province, opts => opts.MapFrom(s => s.EvacuatedFromAddress.StateProvince.Name))
                .ForPath(d => d.era_Jurisdiction, opts => opts.MapFrom(s => s.EvacuatedFromAddress.Jurisdiction));

            CreateMap<era_needsassessmentevacuee, Pet>()
                .ForMember(d => d.Quantity, opts => opts.MapFrom(s => s.era_numberofpets))
                .ForMember(d => d.Type, opts => opts.MapFrom(s => s.era_typeofpet))

                .ReverseMap()

                .ForMember(d => d.era_numberofpets, opts => opts.MapFrom(s => s.Quantity))
                .ForMember(d => d.era_typeofpet, opts => opts.MapFrom(s => s.Type));
        }

        private int Lookup(bool? value) => value.HasValue ? value.Value ? 174360000 : 174360001 : 174360002;
    }
}
