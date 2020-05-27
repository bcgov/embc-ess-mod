using System.Text.Json.Serialization;

namespace EMBC.Suppliers.API.ConfigurationModule.ViewModels
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
