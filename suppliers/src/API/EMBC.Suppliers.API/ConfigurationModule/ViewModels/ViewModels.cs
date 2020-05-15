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
        public string Name { get; set; }
        public string ProvinceCode { get; set; }
        public string CountryCode { get; set; }
    }

    public class Community
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string Region { get; set; }
        public string ProvinceCode { get; set; }
        public string CountryCode { get; set; }
    }
}
