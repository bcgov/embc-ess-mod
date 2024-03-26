using System.Threading;
using System.Threading.Tasks;

namespace EMBC.ESS.Utilities.Spatial.GeocoderApi;

internal class GeocoderAdapter(IGeocoderApi geocoderApi) : IGeocoderAdapter
{
    public async Task<Geocode?> Resolve(string address, CancellationToken ct)
    {
        var response = await geocoderApi.GetAddress(new GetAddressRequest { addressString = address });
        var coordinates = response?.features?[0].geometry?.coordinates;
        var score = response?.features?[0].properties?.score ?? 0;
        if (coordinates == null || coordinates.Length != 2) return null;
        return new Geocode(coordinates[1], coordinates[0], score);
    }
}
