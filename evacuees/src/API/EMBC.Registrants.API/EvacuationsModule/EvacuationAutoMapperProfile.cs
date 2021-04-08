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
using System.Linq;
using AutoMapper;
using EMBC.Registrants.API.LocationModule;
using EMBC.Registrants.API.Shared;
using Microsoft.Dynamics.CRM;

namespace EMBC.Registrants.API.EvacuationsModule
{
    public class EvacuationAutoMapperProfile : Profile
    {
        public EvacuationAutoMapperProfile()
        {
            CreateMap<era_evacuationfile, EvacuationFile>()
                .ForMember(d => d.EssFileNumber, opts => opts.MapFrom(s => s.era_essfilenumber))
                .ForMember(d => d.EvacuationFileDate, opts => opts.MapFrom(s => s.era_evacuationfiledate))
                .ForMember(d => d.NeedsAssessments, opts => opts.MapFrom(s => s.era_needsassessment_EvacuationFile))
                .ForMember(d => d.EvacuatedFromAddress, opts => opts.MapFrom(s => s))
                .ReverseMap()
                .ForMember(d => d.era_essfilenumber, opts => opts.MapFrom(s => s.EssFileNumber))
                .ForMember(d => d.era_evacuationfiledate, opts => opts.MapFrom(s => s.EvacuationFileDate))
                .ForMember(d => d.era_needsassessment_EvacuationFile, opts => opts.MapFrom(s => s.NeedsAssessments))
                .ForPath(d => d.era_addressline1, opts => opts.MapFrom(s => s.EvacuatedFromAddress.AddressLine1))
                .ForPath(d => d.era_addressline2, opts => opts.MapFrom(s => s.EvacuatedFromAddress.AddressLine2))
                .ForPath(d => d.era_postalcode, opts => opts.MapFrom(s => s.EvacuatedFromAddress.PostalCode))
                .ForPath(d => d.era_city, opts => opts.MapFrom(s => s.EvacuatedFromAddress.Jurisdiction.Name))
                .ForPath(d => d.era_country, opts => opts.MapFrom(s => s.EvacuatedFromAddress.Country.Name))
                .ForPath(d => d.era_province, opts => opts.MapFrom(s => s.EvacuatedFromAddress.StateProvince.Name))
                ;

            CreateMap<era_evacuationfile, Address>(MemberList.None)
                .ForMember(d => d.AddressLine1, opts => opts.MapFrom(s => s.era_addressline1))
                .ForMember(d => d.AddressLine2, opts => opts.MapFrom(s => s.era_addressline2))
                .ForMember(d => d.PostalCode, opts => opts.MapFrom(s => s.era_postalcode))
                .ForMember(d => d.Jurisdiction, opts => opts.ConvertUsing<LocationConverter, era_jurisdiction>(s => s.era_Jurisdiction))
                .ForMember(d => d.StateProvince, opts => opts.ConvertUsing<LocationConverter, era_jurisdiction>(s => s.era_Jurisdiction))
                .ForMember(d => d.Country, opts => opts.ConvertUsing<LocationConverter, era_jurisdiction>(s => s.era_Jurisdiction))
                .ReverseMap();

            CreateMap<era_needassessment, NeedsAssessment>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_needassessmentid))
                .ForMember(d => d.Type, opts => opts.MapFrom(s => s.era_needsassessmenttype))
                .ForMember(d => d.CanEvacueeProvideClothing, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovideclothing)))
                .ForMember(d => d.CanEvacueeProvideFood, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovidefood)))
                .ForMember(d => d.CanEvacueeProvideIncidentals, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovideincidentals)))
                .ForMember(d => d.CanEvacueeProvideLodging, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovidelodging)))
                .ForMember(d => d.CanEvacueeProvideTransportation, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovidetransportation)))
                .ForMember(d => d.HaveMedication, opts => opts.MapFrom(s => s.era_medicationrequirement))
                .ForMember(d => d.Insurance, opts => opts.MapFrom(s => (NeedsAssessment.InsuranceOption)s.era_insurancecoverage))
                .ForMember(d => d.HaveSpecialDiet, opts => opts.MapFrom(s => s.era_dietaryrequirement))
                .ForMember(d => d.SpecialDietDetails, opts => opts.MapFrom(s => s.era_dietaryrequirementdetails))
                .ForMember(d => d.HasPetsFood, opts => opts.MapFrom(s => Lookup(s.era_haspetfood)))
                .ForMember(d => d.HouseholdMembers, opts => opts.MapFrom(s => new List<HouseholdMember>()))
                .ForMember(d => d.Pets, opts => opts.MapFrom(s => new List<Pet>()))

                .ReverseMap()

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
                .ForMember(d => d.era_haspetfood, opts => opts.MapFrom(s => Lookup(s.HasPetsFood)));

            CreateMap<era_evacuationfile, NeedsAssessment>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => string.Empty))
                .ForMember(d => d.Type, opts => opts.MapFrom(s => NeedsAssessment.NeedsAssessmentType.Preliminary))
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
                .ForMember(d => d.HouseholdMembers, opts => opts.MapFrom(s => new List<HouseholdMember>()))
                .ForMember(d => d.Pets, opts => opts.MapFrom(s => new List<Pet>()));

            CreateMap<HouseholdMember, contact>(MemberList.None).IncludeMembers(s => s.Details)
                .ForMember(d => d.contactid, opts => opts.MapFrom(s => s.Id))

                .ReverseMap()

                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.contactid));

            CreateMap<HouseholdMember, era_needsassessmentevacuee>(MemberList.None)
                .ForMember(d => d.era_isunder19, opts => opts.MapFrom(s => s.isUnder19))
                .ForPath(d => d.era_RegistrantID.contactid, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.era_RegistrantID, opts => opts.MapFrom(s => s.Details))

                .ReverseMap()

                .ForMember(d => d.isUnder19, opts => opts.MapFrom(s => s.era_isunder19))
                .ForPath(d => d.Id, opts => opts.MapFrom(s => s.era_RegistrantID.contactid))
                .ForMember(d => d.Details, opts => opts.MapFrom(s => s.era_RegistrantID));

            CreateMap<era_needsassessmentevacuee, Pet>()
                .ForMember(d => d.Quantity, opts => opts.MapFrom(s => s.era_numberofpets))
                .ForMember(d => d.Type, opts => opts.MapFrom(s => s.era_typeofpet))

                .ReverseMap()

                .ForMember(d => d.era_numberofpets, opts => opts.MapFrom(s => s.Quantity))
                .ForMember(d => d.era_typeofpet, opts => opts.MapFrom(s => s.Type));
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

    public class LocationConverter :
        IValueConverter<era_jurisdiction, Jurisdiction>,
        IValueConverter<era_jurisdiction, StateProvince>,
        IValueConverter<era_jurisdiction, Country>
    {
        private readonly Jurisdiction[] jurisdictions;
        private readonly StateProvince[] stateProvinces;
        private readonly Country[] countries;

        public LocationConverter(ILocationManager locationManager)
        {
            jurisdictions = locationManager.GetJurisdictions().GetAwaiter().GetResult().ToArray();
            stateProvinces = locationManager.GetStateProvinces().GetAwaiter().GetResult().ToArray();
            countries = locationManager.GetCountries().GetAwaiter().GetResult().ToArray();
        }

        public Jurisdiction Convert(era_jurisdiction sourceMember, ResolutionContext context)
        {
            return jurisdictions.FirstOrDefault(j => j.Code == sourceMember.era_jurisdictionid?.ToString()) ?? null;
        }

        StateProvince IValueConverter<era_jurisdiction, StateProvince>.Convert(era_jurisdiction sourceMember, ResolutionContext context)
        {
            var jurisdiction = jurisdictions.FirstOrDefault(j => j.Code == sourceMember.era_jurisdictionid?.ToString());
            if (jurisdiction == null) return null;
            return stateProvinces.FirstOrDefault(sp => sp.Code == jurisdiction.StateProvinceCode);
        }

        Country IValueConverter<era_jurisdiction, Country>.Convert(era_jurisdiction sourceMember, ResolutionContext context)
        {
            var jurisdiction = jurisdictions.FirstOrDefault(j => j.Code == sourceMember.era_jurisdictionid?.ToString());
            if (jurisdiction == null) return null;
            return countries.FirstOrDefault(c => c.Code == jurisdiction.CountryCode);
        }
    }
}
