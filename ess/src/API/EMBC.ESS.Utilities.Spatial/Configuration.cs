using System;
using EMBC.ESS.Utilities.Spatial.ArcGISApi;
using EMBC.ESS.Utilities.Spatial.GeocoderApi;
using EMBC.Utilities.Configuration;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Refit;

namespace EMBC.ESS.Utilities.Spatial
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var settings = configurationServices.Configuration.GetSection("Spatial").Get<SpatialSettings>();
            if (settings == null || !settings.IsValid())
            {
                configurationServices.Logger.Report(EMBC.Utilities.Telemetry.ReportType.Warning, "Spatial settings are incomplete, skipping configuration");
                return;
            }
            configurationServices.Services.AddRefitClient<IGeocoderApi>().ConfigureHttpClient(c => c.BaseAddress = settings.GeocoderUrl!);
            configurationServices.Services.AddSingleton(new Anywhere.ArcGIS.PortalGateway(settings.ArcGISUrl!.ToString()));
            configurationServices.Services.AddTransient<IGeocoderAdapter, GeocoderAdapter>();
            configurationServices.Services.AddTransient<IArcGISAdapter, ArcGISAdapter>();
            configurationServices.Services.AddTransient<IAddressLocator, AddressLocator>();
        }
    }

    public record SpatialSettings
    {
        public Uri? ArcGISUrl { get; set; }
        public Uri? GeocoderUrl { get; set; }

        public bool IsValid() => ArcGISUrl != null && GeocoderUrl != null;
    }
}
