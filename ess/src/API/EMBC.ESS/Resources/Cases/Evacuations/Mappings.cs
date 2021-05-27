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
using Microsoft.OData.Edm;

namespace EMBC.ESS.Resources.Cases.Evacuations
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<EvacuationFile, era_evacuationfile>(MemberList.None)
                .ForMember(d => d.era_name, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.era_evacuationfiledate, opts => opts.MapFrom(s => s.EvacuationDate))
                .ForMember(d => d.era_needsassessment_EvacuationFile, opts => opts.MapFrom(s => s.NeedsAssessments))
                .ForMember(d => d.era_addressline1, opts => opts.MapFrom(s => s.EvacuatedFromAddress.AddressLine1))
                .ForMember(d => d.era_addressline2, opts => opts.MapFrom(s => s.EvacuatedFromAddress.AddressLine2))
                .ForMember(d => d.era_postalcode, opts => opts.MapFrom(s => s.EvacuatedFromAddress.PostalCode))
                .ForMember(d => d.era_city, opts => opts.MapFrom(s => s.EvacuatedFromAddress.Community))
                .ForMember(d => d.era_country, opts => opts.MapFrom(s => s.EvacuatedFromAddress.Country))
                .ForMember(d => d.era_province, opts => opts.MapFrom(s => s.EvacuatedFromAddress.StateProvince))
                .ForMember(d => d.era_secrettext, opts => opts.MapFrom(s => s.SecretPhrase))
                ;

            CreateMap<era_evacuationfile, EvacuationFile>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_name))
                .ForMember(d => d.PrimaryRegistrantId, opts => opts.MapFrom(s => s.era_Registrant.contactid.ToString()))
                .ForMember(d => d.SecretPhrase, opts => opts.MapFrom(s => s.era_secrettext))
                .ForMember(d => d.EvacuationDate, opts => opts.MapFrom(s => s.era_evacuationfiledate.HasValue ? s.era_evacuationfiledate.Value.UtcDateTime : (DateTime?)null))
                .ForMember(d => d.NeedsAssessments, opts => opts.MapFrom(s => s.era_needsassessment_EvacuationFile))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.statuscode))
                .ForMember(d => d.EvacuatedFromAddress, opts => opts.MapFrom(s => s))
                .ForMember(d => d.IsSecretPhraseMasked, opts => opts.Ignore())
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
                .ForMember(d => d.era_needsassessmenttype, opts => opts.MapFrom(s => (int?)Enum.Parse<NeedsAssessmentTypeOptionSet>(s.Type.ToString())))
                .ForMember(d => d.era_canevacueeprovidefood, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideFood)))
                .ForMember(d => d.era_canevacueeprovideclothing, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideClothing)))
                .ForMember(d => d.era_canevacueeprovideincidentals, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideIncidentals)))
                .ForMember(d => d.era_canevacueeprovidelodging, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideLodging)))
                .ForMember(d => d.era_canevacueeprovidetransportation, opts => opts.MapFrom(s => Lookup(s.CanEvacueeProvideTransportation)))
                .ForMember(d => d.era_dietaryrequirement, opts => opts.MapFrom(s => s.HaveSpecialDiet))
                .ForMember(d => d.era_dietaryrequirementdetails, opts => opts.MapFrom(s => s.SpecialDietDetails))
                .ForMember(d => d.era_medicationrequirement, opts => opts.MapFrom(s => s.HaveMedication))
                .ForMember(d => d.era_insurancecoverage, opts => opts.MapFrom(s => (int?)Enum.Parse<InsuranceOptionOptionSet>(s.Insurance.ToString())))
                .ForMember(d => d.era_haspetfood, opts => opts.MapFrom(s => Lookup(s.HasPetsFood)))
                ;

            CreateMap<era_needassessment, NeedsAssessment>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_needassessmentid))
                .ForMember(d => d.Type, opts => opts.MapFrom(s => (int?)Enum.Parse<NeedsAssessmentType>(((NeedsAssessmentTypeOptionSet)s.era_needsassessmenttype).ToString())))
                .ForMember(d => d.CanEvacueeProvideClothing, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovideclothing)))
                .ForMember(d => d.CanEvacueeProvideFood, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovidefood)))
                .ForMember(d => d.CanEvacueeProvideIncidentals, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovideincidentals)))
                .ForMember(d => d.CanEvacueeProvideLodging, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovidelodging)))
                .ForMember(d => d.CanEvacueeProvideTransportation, opts => opts.MapFrom(s => Lookup(s.era_canevacueeprovidetransportation)))
                .ForMember(d => d.HaveMedication, opts => opts.MapFrom(s => s.era_medicationrequirement))
                .ForMember(d => d.Insurance, opts => opts.MapFrom(s => Enum.Parse<InsuranceOption>(((InsuranceOptionOptionSet)s.era_insurancecoverage).ToString())))
                .ForMember(d => d.HaveSpecialDiet, opts => opts.MapFrom(s => s.era_dietaryrequirement))
                .ForMember(d => d.SpecialDietDetails, opts => opts.MapFrom(s => s.era_dietaryrequirementdetails))
                .ForMember(d => d.HasPetsFood, opts => opts.MapFrom(s => Lookup(s.era_haspetfood)))
                .ForMember(d => d.HouseholdMembers, opts => opts.MapFrom(s => Array.Empty<HouseholdMember>()))
                .ForMember(d => d.Pets, opts => opts.MapFrom(s => Array.Empty<Pet>()))
               ;

            CreateMap<era_householdmember, HouseholdMember>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_householdmemberid.ToString()))
                .ForMember(d => d.LinkedRegistrantId, opts => opts.MapFrom(s => s.era_Registrant.contactid))
                .ForMember(d => d.IsPrimaryRegistrant, opts => opts.MapFrom(s => s.era_isprimaryregistrant))
                .ForMember(d => d.IsUnder19, opts => opts.MapFrom(s => s.era_isunder19))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.era_Registrant.firstname.ToString()))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.era_Registrant.lastname.ToString()))
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => !s.era_Registrant.birthdate.HasValue
                    ? null
                    : $"{s.era_Registrant.birthdate.Value.Month:D2}/{s.era_Registrant.birthdate.Value.Day:D2}/{s.era_Registrant.birthdate.Value.Year:D4}"))
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.era_Registrant.era_initial.ToString()))
                .ForMember(d => d.PreferredName, opts => opts.MapFrom(s => s.era_Registrant.era_preferredname.ToString()))
                .ForMember(d => d.Gender, opts => opts.ConvertUsing<GenderConverter, int?>(s => s.era_Registrant.gendercode))
                ;

            CreateMap<HouseholdMember, era_householdmember>(MemberList.None)
                .ForMember(d => d.era_householdmemberid, opts => opts.MapFrom(s => Guid.Parse(s.Id)))
                .ForMember(d => d.era_isprimaryregistrant, opts => opts.MapFrom(s => s.IsPrimaryRegistrant))
                .ForMember(d => d.era_isunder19, opts => opts.MapFrom(s => s.IsUnder19))
                .ForMember(d => d.era_Registrant, opts => opts.MapFrom(s => s))
                ;

            CreateMap<HouseholdMember, contact>(MemberList.None)
                .ForMember(d => d.contactid, opts => opts.MapFrom(s => s.LinkedRegistrantId))
                .ForMember(d => d.era_registranttype, opts => opts.MapFrom(s => (int)(s.IsPrimaryRegistrant ? RegistrantType.Primary : RegistrantType.Member)))
                .ForMember(d => d.firstname, opts => opts.MapFrom(s => s.FirstName))
                .ForMember(d => d.lastname, opts => opts.MapFrom(s => s.LastName))
                .ForMember(d => d.era_initial, opts => opts.MapFrom(s => s.Initials))
                .ForMember(d => d.era_preferredname, opts => opts.MapFrom(s => s.PreferredName))
                .ForMember(d => d.gendercode, opts => opts.ConvertUsing<GenderConverter, string>(s => s.Gender))
                .ForMember(d => d.birthdate, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.DateOfBirth) ? (Date?)null : Date.Parse(s.DateOfBirth)))

                .ReverseMap()

                .ForMember(d => d.Gender, opts => opts.ConvertUsing<GenderConverter, int?>(s => s.gendercode))
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => !s.birthdate.HasValue
                    ? null
                    : $"{s.birthdate.Value.Month:D2}/{s.birthdate.Value.Day:D2}/{s.birthdate.Value.Year:D4}"))
                .ForMember(d => d.IsUnder19, opts => opts.MapFrom(s => s.birthdate.HasValue ? CheckIfUnder19Years(s.birthdate.Value, Date.Now) : (bool?)null))
               ;

            CreateMap<era_needsassessmentanimal, Pet>()
                .ForMember(d => d.Quantity, opts => opts.MapFrom(s => s.era_numberofpets))
                .ForMember(d => d.Type, opts => opts.MapFrom(s => s.era_name))

                .ReverseMap()

                .ForMember(d => d.era_numberofpets, opts => opts.MapFrom(s => s.Quantity))
                .ForMember(d => d.era_name, opts => opts.MapFrom(s => s.Type));
        }

        private static int Lookup(bool? value) => value.HasValue ? value.Value ? 174360000 : 174360001 : 174360002;

        private static bool? Lookup(int? value) => value switch
        {
            174360000 => true,
            174360001 => false,
            174360002 => null,
            _ => null
        };

        public static bool CheckIfUnder19Years(Date birthdate, Date currentDate)
        {
            return birthdate.AddYears(19) >= currentDate;
        }
    }

    public enum InsuranceOptionOptionSet
    {
        No = 174360000,
        Yes = 174360001,
        Unsure = 174360002,
        Unknown = 174360003
    }

    public enum NeedsAssessmentTypeOptionSet
    {
        Preliminary = 174360000,
        Assessed = 174360001
    }

    public enum RegistrantType
    {
        Primary = 174360000,
        Member = 174360001
    }

    public class GenderConverter : IValueConverter<string, int?>, IValueConverter<int?, string>
    {
        public int? Convert(string sourceMember, ResolutionContext context) => sourceMember?.ToLower() switch
        {
            "male" => 1,
            "female" => 2,
            "x" => 3,
            _ => null
        };

        public string Convert(int? sourceMember, ResolutionContext context) => sourceMember switch
        {
            1 => "Male",
            2 => "Female",
            3 => "X",
            _ => null
        };
    }
}
