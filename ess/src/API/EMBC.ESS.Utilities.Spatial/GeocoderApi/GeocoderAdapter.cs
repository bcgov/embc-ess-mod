using System;
using System.Threading;
using System.Threading.Tasks;

namespace EMBC.ESS.Utilities.Spatial.GeocoderApi
{
    internal class GeocoderAdapter(IGeocoderApi geocoderApi) : IGeocoderAdapter
    {
        public async Task<Geocode> Resolve(string address, CancellationToken ct)
        {
            var response = await geocoderApi.GetAddress(new GetAddressRequest { addressString = address });
            if (response == null) throw new InvalidOperationException($"not response was received for address {address}");
            var coordinates = response.features?[0].geometry?.coordinates;
            var score = Convert.ToInt32(response.features?[0].properties?.score ?? 0);
            if (coordinates == null || coordinates.Length != 2) throw new InvalidOperationException("cannot parse coordinates");
            var resolvedAddress = response.features?[0].properties?.fullAddress ?? string.Empty;
            return new Geocode(new Coordinates(coordinates[1], coordinates[0]), score, new Location(resolvedAddress));
        }
    }
}
