using System;

namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
    public class FileBasedCachedListsOptions
    {
        public string CachePath { get; set; } = "./ConfigurationModule/Models/Data/";
        public TimeSpan UpdateFrequency { get; set; } = TimeSpan.FromMinutes(60);
    }
}
