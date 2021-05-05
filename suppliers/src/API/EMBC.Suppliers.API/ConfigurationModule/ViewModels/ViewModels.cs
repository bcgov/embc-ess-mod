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

using System.Text.Json.Serialization;

namespace EMBC.Suppliers.API.ConfigurationModule.ViewModels
{
    public class ConfigResult
    {
        public string NoticeMsg { get; set; }
        public string MaintMsg { get; set; }
        public string MaintTime { get; set; }
        public bool SiteDown { get; set; }
        public string Environment { get; set; }
        public OidcConfiguration Oidc { get; set; }
    }

    public class OidcConfiguration
    {
        public string Issuer { get; set; }
        public string ClientId { get; set; }
    }

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

    public class Community
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string RegionCode { get; set; }
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

    public class District
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string RegionCode { get; set; }
        public string StateProvinceCode { get; set; }
        public string CountryCode { get; set; }
    }

    public class Support
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum JurisdictionType
    {
        Undefined = 0,
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
}
