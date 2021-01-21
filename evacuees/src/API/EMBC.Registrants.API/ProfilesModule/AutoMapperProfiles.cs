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

using EMBC.Registrants.API.Shared;
using Microsoft.Dynamics.CRM;

namespace EMBC.Registrants.API.ProfilesModule
{
    public class ProfileMap : AutoMapper.Profile
    {
        public ProfileMap()
        {
            CreateMap<contact, Profile>()
                .ForMember(d => d.PersonalDetails, opts => opts.MapFrom(s => s))
                .ForMember(d => d.ContactDetails, opts => opts.MapFrom(s => s))

                .ForPath(d => d.PrimaryAddress.AddressLine1, opts => opts.MapFrom(s => s.address1_line1))
                .ForPath(d => d.PrimaryAddress.AddressLine2, opts => opts.MapFrom(s => s.address1_line2))
                .ForPath(d => d.PrimaryAddress.PostalCode, opts => opts.MapFrom(s => s.address1_postalcode))
                .ForPath(d => d.PrimaryAddress.Country, opts => opts.MapFrom(s => s.era_Country ?? new era_country { era_name = s.address1_country }))
                .ForPath(d => d.PrimaryAddress.Jurisdiction, opts => opts.MapFrom(s => s.era_City ?? new era_jurisdiction { era_jurisdictionname = s.address1_city }))
                .ForPath(d => d.PrimaryAddress.StateProvince, opts => opts.MapFrom(s => s.era_ProvinceState ?? new era_provinceterritories { era_name = s.address1_stateorprovince }))

                .ForPath(d => d.MailingAddress.AddressLine1, opts => opts.MapFrom(s => s.address2_line1))
                .ForPath(d => d.MailingAddress.AddressLine2, opts => opts.MapFrom(s => s.address2_line2))
                .ForPath(d => d.MailingAddress.PostalCode, opts => opts.MapFrom(s => s.address2_postalcode))
                .ForPath(d => d.MailingAddress.Country, opts => opts.MapFrom(s => s.era_MailingCountry ?? new era_country { era_name = s.address2_country }))
                .ForPath(d => d.MailingAddress.Jurisdiction, opts => opts.MapFrom(s => s.era_MailingCity ?? new era_jurisdiction { era_jurisdictionname = s.address2_city }))
                .ForPath(d => d.MailingAddress.StateProvince, opts => opts.MapFrom(s => s.era_MailingProvinceState ?? new era_provinceterritories { era_name = s.address2_stateorprovince }))
               ;

            CreateMap<contact, PersonDetails>(AutoMapper.MemberList.Destination)
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => s.birthdate))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.firstname))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.lastname))
                .ForMember(d => d.Gender, opts => opts.ConvertUsing<GenderConverter, int?>(s => s.gendercode))
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.era_initial))
                .ForMember(d => d.PreferredName, opts => opts.MapFrom(s => s.era_preferredname));

            CreateMap<contact, ContactDetails>(AutoMapper.MemberList.Destination)
                .ForPath(d => d.Email, opts => opts.MapFrom(s => s.emailaddress1))
                .ForPath(d => d.Phone, opts => opts.MapFrom(s => s.telephone1))
                .ForPath(d => d.HideEmailRequired, opts => opts.MapFrom(s => s.era_emailrefusal ?? false))
                .ForPath(d => d.HidePhoneRequired, opts => opts.MapFrom(s => s.era_phonenumberrefusal ?? false));
        }
    }

    public class LocationMap : AutoMapper.Profile
    {
        public LocationMap()
        {
            CreateMap<era_jurisdiction, Jurisdiction>()
                .ForMember(j => j.Code, opts => opts.MapFrom(o => o.era_jurisdictionid))
                .ForMember(j => j.Name, opts => opts.MapFrom(o => o.era_jurisdictionname))
                .ForMember(j => j.CountryCode, opts => opts.MapFrom(o => o.era_RelatedProvinceState == null
                    ? null
                    : o.era_RelatedProvinceState.era_RelatedCountry == null
                        ? null
                        : o.era_RelatedProvinceState.era_RelatedCountry.era_countrycode))
                .ForMember(j => j.StateProvinceCode, opts => opts.MapFrom(o => o.era_RelatedProvinceState == null
                        ? null
                        : o.era_RelatedProvinceState.era_code))
                .ForMember(j => j.Type, opts => opts.MapFrom(o => (JurisdictionType)o.era_type))
                ;

            CreateMap<era_provinceterritories, StateProvince>()
                .ForMember(j => j.Code, opts => opts.MapFrom(o => o.era_code))
                .ForMember(j => j.Name, opts => opts.MapFrom(o => o.era_name))
                .ForMember(j => j.CountryCode, opts => opts.MapFrom(o => o.era_RelatedCountry == null
                    ? null
                    : o.era_RelatedCountry.era_countrycode))
             ;

            CreateMap<era_country, Country>()
                .ForMember(j => j.Code, opts => opts.MapFrom(o => o.era_countrycode))
                .ForMember(j => j.Name, opts => opts.MapFrom(o => o.era_name))
                ;
        }
    }

    public class GenderConverter : AutoMapper.IValueConverter<string, int?>, AutoMapper.IValueConverter<int?, string>
    {
        public int? Convert(string sourceMember, AutoMapper.ResolutionContext context) => sourceMember switch
        {
            "Male" => 1,
            "Female" => 2,
            "X" => 3,
            _ => null
        };

        public string Convert(int? sourceMember, AutoMapper.ResolutionContext context) => sourceMember switch
        {
            1 => "Male",
            2 => "Female",
            3 => "X",
            _ => null
        };
    }
}
