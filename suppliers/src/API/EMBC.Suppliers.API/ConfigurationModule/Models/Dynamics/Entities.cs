namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
#pragma warning disable CA1707 // Identifiers should not contain underscores

    public class CountryEntity
    {
        public string era_countryid { get; set; }
        public string era_countrycode { get; set; }
        public string era_isocountrycode { get; set; }
        public string era_name { get; set; }
    }

    public class StateProvinceEntity
    {
        public string era_provinceterritoriesid { get; set; }
        public string era_code { get; set; }
        public string era_name { get; set; }
    }

#pragma warning restore CA1707 // Identifiers should not contain underscores
}
