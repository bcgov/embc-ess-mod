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
using System.Globalization;
using EMBC.Registrants.API.Controllers;
using EMBC.Registrants.API.SecurityModule;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Edm;

namespace EMBC.Registrants.API.ProfilesModule
{
    public class ProfileAutoMapperProfile : AutoMapper.Profile
    {
        public ProfileAutoMapperProfile()
        {
            CreateMap<contact, Profile>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_bcservicescardid))
                .ForMember(d => d.RestrictedAccess, opts => opts.MapFrom(s => s.era_restriction ?? false))
                .ForMember(d => d.SecretPhrase, opts => opts.MapFrom(s => s.era_secrettext))

                .ForMember(d => d.PersonalDetails, opts => opts.MapFrom(s => s))
                .ForMember(d => d.ContactDetails, opts => opts.MapFrom(s => s))

                .ForPath(d => d.PrimaryAddress.AddressLine1, opts => opts.MapFrom(s => s.address1_line1))
                .ForPath(d => d.PrimaryAddress.AddressLine2, opts => opts.MapFrom(s => s.address1_line2))
                .ForPath(d => d.PrimaryAddress.PostalCode, opts => opts.MapFrom(s => s.address1_postalcode))
                .ForPath(d => d.PrimaryAddress.Country, opts => opts.MapFrom(s => s.era_Country != null ? s.era_Country.era_countrycode : s.address1_country))
                .ForPath(d => d.PrimaryAddress.StateProvince, opts => opts.MapFrom(s => s.era_ProvinceState != null ? s.era_ProvinceState.era_code : s.address1_stateorprovince))
                .ForPath(d => d.PrimaryAddress.Community, opts => opts.MapFrom(s => s.era_City != null ? s.era_City.era_jurisdictionid.ToString() : s.address1_city))

                .ForPath(d => d.MailingAddress.AddressLine1, opts => opts.MapFrom(s => s.address2_line1))
                .ForPath(d => d.MailingAddress.AddressLine2, opts => opts.MapFrom(s => s.address2_line2))
                .ForPath(d => d.MailingAddress.PostalCode, opts => opts.MapFrom(s => s.address2_postalcode))
                .ForPath(d => d.MailingAddress.Country, opts => opts.MapFrom(s => s.era_MailingCountry != null ? s.era_MailingCountry.era_countrycode : s.address2_country))
                .ForPath(d => d.MailingAddress.StateProvince, opts => opts.MapFrom(s => s.era_MailingProvinceState != null ? s.era_MailingProvinceState.era_code : s.address2_stateorprovince))
                .ForPath(d => d.MailingAddress.Community, opts => opts.MapFrom(s => s.era_MailingCity != null ? s.era_MailingCity.era_jurisdictionid.ToString() : s.address2_city))

                .ForMember(d => d.IsMailingAddressSameAsPrimaryAddress, opts => opts.MapFrom(s => s.era_issamemailingaddress))

                .ReverseMap()

                .ForMember(d => d.era_registranttype, opts => opts.MapFrom(s => 174360000))
                .ForMember(d => d.era_collectionandauthorization, opts => opts.MapFrom(s => true))
                .ForMember(d => d.era_restriction, opts => opts.MapFrom(s => s.RestrictedAccess))

                .ForMember(d => d.address1_country, opts => opts.MapFrom(s => s.PrimaryAddress.Country))
                .ForMember(d => d.address1_stateorprovince, opts => opts.MapFrom(s => s.PrimaryAddress.StateProvince))
                .ForMember(d => d.address1_city, opts => opts.MapFrom(s => s.PrimaryAddress.Community))
                .ForMember(d => d.era_primarybcresident, opts => opts.MapFrom(s => s.PrimaryAddress.StateProvince == "BC"))

                .ForMember(d => d.address2_country, opts => opts.MapFrom(s => s.MailingAddress.Country))
                .ForMember(d => d.address2_stateorprovince, opts => opts.MapFrom(s => s.MailingAddress.StateProvince))
                .ForMember(d => d.address2_city, opts => opts.MapFrom(s => s.MailingAddress.Community))
                .ForMember(d => d.era_isbcmailingaddress, opts => opts.MapFrom(s => s.MailingAddress.StateProvince == "BC"))
                .ForMember(d => d.era_issamemailingaddress, opts => opts.MapFrom(s =>
                    s.MailingAddress.Country == s.PrimaryAddress.Country &&
                    s.MailingAddress.StateProvince == s.PrimaryAddress.StateProvince &&
                    s.MailingAddress.Community == s.PrimaryAddress.Community &&
                    s.MailingAddress.PostalCode == s.PrimaryAddress.PostalCode &&
                    s.MailingAddress.AddressLine1 == s.PrimaryAddress.AddressLine1 &&
                    s.MailingAddress.AddressLine2 == s.PrimaryAddress.AddressLine2))
                ;

            CreateMap<contact, PersonDetails>()
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => s.birthdate.HasValue
                    ? $"{s.birthdate.Value.Month:D2}/{s.birthdate.Value.Day:D2}/{s.birthdate.Value.Year:D2}"
                    : null))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.firstname))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.lastname))
                .ForMember(d => d.Gender, opts => opts.ConvertUsing<GenderConverter, int?>(s => s.gendercode))
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.era_initial))
                .ForMember(d => d.PreferredName, opts => opts.MapFrom(s => s.era_preferredname))
                .ReverseMap()
                .ForMember(d => d.gendercode, opts => opts.ConvertUsing<GenderConverter, string>(s => s.Gender))
                .ForMember(d => d.birthdate, opts => opts.MapFrom(s => Date.Parse(s.DateOfBirth)))
                ;

            CreateMap<contact, ContactDetails>()
                .ForPath(d => d.Email, opts => opts.MapFrom(s => s.emailaddress1))
                .ForPath(d => d.Phone, opts => opts.MapFrom(s => s.telephone1))
                .ForPath(d => d.HideEmailRequired, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.emailaddress1)))
                .ForPath(d => d.HidePhoneRequired, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.telephone1)))
                .ReverseMap()
                .ForPath(d => d.emailaddress1, opts => opts.MapFrom(s => s.Email ?? string.Empty))
                .ForPath(d => d.telephone1, opts => opts.MapFrom(s => s.Phone ?? string.Empty))
                .ForPath(d => d.era_emailrefusal, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.Email)))
                .ForPath(d => d.era_phonenumberrefusal, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.Phone)))
;
            CreateMap<User, Profile>(AutoMapper.MemberList.None)
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.ContactDetails, opts => opts.MapFrom(s => new ContactDetails()))
                // Email is not mapped from BCSC
                .ForPath(d => d.ContactDetails.Email, opts => opts.Ignore())
                .ForMember(d => d.PersonalDetails, opts => opts.MapFrom(s => s))
                .ForMember(d => d.PrimaryAddress, opts => opts.MapFrom(s => s))
                ;

            CreateMap<User, Address>()
                .ForMember(d => d.AddressLine1, opts => opts.MapFrom(s => s.PrimaryAddress.AddressLine1))
                .ForMember(d => d.AddressLine2, opts => opts.Ignore())
                .ForMember(d => d.Jurisdiction, opts => opts.Ignore())
                .ForMember(d => d.Community, opts => opts.MapFrom(s => s.PrimaryAddress.Community))
                .ForMember(d => d.StateProvince, opts => opts.MapFrom(s => s.PrimaryAddress.StateProvince))
                .ForMember(d => d.Country, opts => opts.MapFrom(s => s.PrimaryAddress.Country))
                .ForMember(d => d.PostalCode, opts => opts.MapFrom(s => s.PrimaryAddress.PostalCode));

            CreateMap<User, PersonDetails>(AutoMapper.MemberList.None)
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.PersonalDetails.DateOfBirth)
                    ? null
                    : DateTime.ParseExact(s.PersonalDetails.DateOfBirth, "yyyy-MM-dd", CultureInfo.InvariantCulture).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)))
                // Gender is not mapped from BCSC
                //.ForMember(d => d.Gender, opts => opts.ConvertUsing<BcscGenderConverter, string>(s => s.Gender))
                .ForMember(d => d.Gender, opts => opts.Ignore())
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.PersonalDetails.FirstName))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.PersonalDetails.LastName));
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

    public class BcscGenderConverter : AutoMapper.IValueConverter<string, string>
    {
        public string Convert(string sourceMember, AutoMapper.ResolutionContext context) => sourceMember.ToLowerInvariant() switch
        {
            "male" => "Male",
            "female" => "Female",
            _ => "X"
        };
    }
}
