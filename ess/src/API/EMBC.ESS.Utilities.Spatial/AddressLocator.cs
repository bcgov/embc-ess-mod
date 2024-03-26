using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Spatial.ArcGISApi;
using EMBC.ESS.Utilities.Spatial.GeocoderApi;

namespace EMBC.ESS.Utilities.Spatial
{
    internal class AddressLocator(IGeocoderAdapter geocoder, IArcGISAdapter arcGisAdapter) : IAddressLocator
    {
        public async Task<AddressInformation> LocateAsync(Location location, CancellationToken ct)
        {
            if (location is null)
            {
                throw new ArgumentNullException(nameof(location));
            }

            var geocode = await geocoder.Resolve(location.FullAddress, ct);
            if (geocode == null) return new AddressInformation(location, null, null);
            var features = await arcGisAdapter.QueryService(new PointIntersectionQuery("TASK_OA_24/FeatureServer/0", geocode));

            return new AddressInformation(location, geocode, features.FirstOrDefault()?.Attributes.Select(a => new LocationAttribute(a.Item1, a.Item2?.ToString())));
        }
    }
}
