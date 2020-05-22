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
        public string Type { get; set; }
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
}
