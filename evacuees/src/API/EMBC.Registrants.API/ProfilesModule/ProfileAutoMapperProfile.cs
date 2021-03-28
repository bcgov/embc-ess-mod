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

using System;
using System.Globalization;
using System.Linq;
using AutoMapper;
using EMBC.Registrants.API.LocationModule;
using EMBC.Registrants.API.SecurityModule;
using EMBC.Registrants.API.Shared;
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
                .ForPath(d => d.PrimaryAddress.Country, opts => opts.MapFrom(s => s.era_Country ?? new era_country { era_name = s.address1_country }))
                .ForPath(d => d.PrimaryAddress.Jurisdiction, opts => opts.MapFrom(s => s.era_City ?? new era_jurisdiction { era_jurisdictionname = s.address1_city }))
                .ForPath(d => d.PrimaryAddress.StateProvince, opts => opts.MapFrom(s => s.era_ProvinceState ?? new era_provinceterritories { era_name = s.address1_stateorprovince }))

                .ForPath(d => d.MailingAddress.AddressLine1, opts => opts.MapFrom(s => s.address2_line1))
                .ForPath(d => d.MailingAddress.AddressLine2, opts => opts.MapFrom(s => s.address2_line2))
                .ForPath(d => d.MailingAddress.PostalCode, opts => opts.MapFrom(s => s.address2_postalcode))
                .ForPath(d => d.MailingAddress.Country, opts => opts.MapFrom(s => s.era_MailingCountry ?? new era_country { era_name = s.address2_country }))
                .ForPath(d => d.MailingAddress.Jurisdiction, opts => opts.MapFrom(s => s.era_MailingCity ?? new era_jurisdiction { era_jurisdictionname = s.address2_city }))
                .ForPath(d => d.MailingAddress.StateProvince, opts => opts.MapFrom(s => s.era_MailingProvinceState ?? new era_provinceterritories { era_name = s.address2_stateorprovince }))

                .ForMember(d => d.IsMailingAddressSameAsPrimaryAddress, opts => opts.MapFrom(s => s.era_issamemailingaddress))

                .ReverseMap()

                .ForMember(d => d.era_registranttype, opts => opts.MapFrom(s => 174360000))
                .ForMember(d => d.era_collectionandauthorization, opts => opts.MapFrom(s => true))
                .ForMember(d => d.era_restriction, opts => opts.MapFrom(s => s.RestrictedAccess))

                .ForMember(d => d.address1_country, opts => opts.MapFrom(s => s.PrimaryAddress.Country.Name))
                .ForMember(d => d.address1_stateorprovince, opts => opts.MapFrom(s => s.PrimaryAddress.StateProvince.Name))
                .ForMember(d => d.address1_city, opts => opts.MapFrom(s => s.PrimaryAddress.Jurisdiction.Name))
                .ForMember(d => d.era_primarybcresident, opts => opts.MapFrom(s => s.PrimaryAddress.StateProvince.Code == "BC"))

                .ForMember(d => d.address2_country, opts => opts.MapFrom(s => s.MailingAddress.Country.Name))
                .ForMember(d => d.address2_stateorprovince, opts => opts.MapFrom(s => s.MailingAddress.StateProvince.Name))
                .ForMember(d => d.address2_city, opts => opts.MapFrom(s => s.MailingAddress.Jurisdiction.Name))
                .ForMember(d => d.era_isbcmailingaddress, opts => opts.MapFrom(s => s.MailingAddress.StateProvince.Code == "BC"))
                .ForMember(d => d.era_issamemailingaddress, opts => opts.MapFrom(s =>
                    s.MailingAddress.Country.Name == s.PrimaryAddress.Country.Name &&
                    s.MailingAddress.StateProvince.Name == s.PrimaryAddress.StateProvince.Name &&
                    s.MailingAddress.Jurisdiction.Name == s.PrimaryAddress.Jurisdiction.Name &&
                    s.MailingAddress.PostalCode == s.PrimaryAddress.PostalCode &&
                    s.MailingAddress.AddressLine1 == s.PrimaryAddress.AddressLine1 &&
                    s.MailingAddress.AddressLine2 == s.PrimaryAddress.AddressLine2))

                .ForMember(d => d.era_issamemailingaddress, opts => opts.MapFrom(s => s.IsMailingAddressSameAsPrimaryAddress))
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
            CreateMap<User, Profile>(MemberList.None)
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.ContactDetails, opts => opts.MapFrom(s => new ContactDetails()))
                // Email is not mapped from BCSC
                .ForPath(d => d.ContactDetails.Email, opts => opts.Ignore())
                .ForMember(d => d.PersonalDetails, opts => opts.MapFrom(s => s))
                .ForMember(d => d.PrimaryAddress, opts => opts.MapFrom(s => s))
                ;

            CreateMap<User, Address>()
                .ForMember(d => d.AddressLine1, opts => opts.MapFrom(s => s.StreetAddress))
                .ForMember(d => d.AddressLine2, opts => opts.Ignore())
                .ForMember(d => d.Jurisdiction, opts => opts.ConvertUsing<BcscCityConverter, string>(s => s.City))
                .ForMember(d => d.StateProvince, opts => opts.ConvertUsing<BcscStateProvinceConverter, string>(s => s.StateProvince))
                .ForMember(d => d.Country, opts => opts.ConvertUsing<BcscCountryConverter, string>(s => s.Country))
                .ForMember(d => d.PostalCode, opts => opts.MapFrom(s => s.PostalCode));

            CreateMap<User, PersonDetails>(MemberList.None)
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.BirthDate)
                    ? null
                    : DateTime.ParseExact(s.BirthDate, "yyyy-MM-dd", CultureInfo.InvariantCulture).ToString("MM/dd/yyyy", CultureInfo.InvariantCulture)))
                // Gender is not mapped from BCSC
                //.ForMember(d => d.Gender, opts => opts.ConvertUsing<BcscGenderConverter, string>(s => s.Gender))
                .ForMember(d => d.Gender, opts => opts.Ignore())
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.FirstName))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.LastName));
        }
    }

    public class GenderConverter : IValueConverter<string, int?>, IValueConverter<int?, string>
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

    public class BcscGenderConverter : IValueConverter<string, string>
    {
        public string Convert(string sourceMember, ResolutionContext context) => sourceMember.ToLowerInvariant() switch
        {
            "male" => "Male",
            "female" => "Female",
            _ => "X"
        };
    }

    public class BcscCountryConverter : IValueConverter<string, Country>
    {
        public Country Convert(string sourceMember, ResolutionContext context) => sourceMember.ToUpperInvariant() switch
        {
            "CA" => new Country { Code = "CAN", Name = "Canada" },
            _ => null
        };
    }

    public class BcscStateProvinceConverter : IValueConverter<string, StateProvince>
    {
        public StateProvince Convert(string sourceMember, ResolutionContext context) => sourceMember.ToUpperInvariant() switch
        {
            "BC" => new StateProvince { Code = "BC", Name = "British Columbia" },
            _ => null
        };
    }

    public class BcscCityConverter : IValueConverter<string, Jurisdiction>
    {
        private readonly Jurisdiction[] jurisdictions;

        public BcscCityConverter(ILocationManager locationManager)
        {
            jurisdictions = locationManager.GetJurisdictions("CAN", "BC").GetAwaiter().GetResult().ToArray();
        }

        public Jurisdiction Convert(string sourceMember, ResolutionContext context) =>
            this.jurisdictions.FirstOrDefault(j => j.Name.Equals(sourceMember, System.StringComparison.CurrentCultureIgnoreCase)) ?? null;
    }
}
