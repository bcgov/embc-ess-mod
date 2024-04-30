using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Spatial.ArcGISApi;
using EMBC.ESS.Utilities.Spatial.GeocoderApi;

namespace EMBC.ESS.Utilities.Spatial
{
    internal class LocationService(IGeocoderAdapter geocoder, IArcGISAdapter arcGisAdapter) : ILocationService
    {
        public async Task<IEnumerable<LocationAttribute>> GetGeocodeAttributes(Coordinates coordinates, CancellationToken ct)
        {
            var features = await arcGisAdapter.QueryService(new PointIntersectionQuery("TASK_OA_24/FeatureServer/0", coordinates));
            return features.FirstOrDefault()?.Attributes.Select(a => new LocationAttribute(a.Key, a.Value?.ToString())) ?? Array.Empty<LocationAttribute>();
        }

        public async Task<Geocode> ResolveGeocode(Location location, CancellationToken ct)
        {
            return await geocoder.Resolve(location.AddressString, ct);
        }
    }
}
