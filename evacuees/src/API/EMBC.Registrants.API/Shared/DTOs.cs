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

using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace EMBC.Registrants.API.Shared
{
    public class Country
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class StateProvince
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string CountryCode { get; set; }
    }

    public class Region
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string StateProvinceCode { get; set; }
        public string CountryCode { get; set; }
    }

    public class Jurisdiction
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public JurisdictionType Type { get; set; }
        public string StateProvinceCode { get; set; }
        public string CountryCode { get; set; }
    }

    [JsonConverter(typeof(StringEnumConverter))]
#pragma warning disable CA1008 // Enums should have zero value

    public enum JurisdictionType
#pragma warning restore CA1008 // Enums should have zero value
    {
        Undefined = -1,
        City = 1,
        Town = 4,
        Village = 2,
        District = 12,
        DistrictMunicipality = 100000014,
        Township = 3,
        IndianGovernmentDistrict = 100000015,
        IslandMunicipality = 13,
        IslandTrust = 10,
        MountainResortMunicipality = 8,
        MunicipalityDistrict = 9,
        RegionalDistrict = 14,
        RegionalMunicipality = 6,
        ResortMunicipality = 5,
        RuralMunicipalities = 7
    }

    /// <summary>
    /// Address data with optional lookup code
    /// </summary>
    public class Address
    {
        [Required]
        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }

        [Required]
        public Jurisdiction Jurisdiction { get; set; }

        public StateProvince StateProvince { get; set; }

        [Required]
        public Country Country { get; set; }

        public string PostalCode { get; set; }
    }

    /// <summary>
    /// Profile personal details
    /// </summary>
    public class PersonDetails
    {
        [Required]
        public string Id { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        public string Initials { get; set; }
        public string PreferredName { get; set; }

        [Required]
        public string Gender { get; set; }

        [Required]
        public string DateOfBirth { get; set; }
    }

    /// <summary>
    /// Profile contact information
    /// </summary>
    public class ContactDetails
    {
        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string Phone { get; set; }

        public bool HidePhoneRequired { get; set; }

        public bool HideEmailRequired { get; set; }
    }
}
