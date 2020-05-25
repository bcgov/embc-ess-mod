namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
    public class FileBasedCachedListsOptions
    {
        public string CachePath { get; set; } = "./ConfigurationModule/Models/Data/";
        public int UpdateFrequency { get; set; } = 60;
    }
}
