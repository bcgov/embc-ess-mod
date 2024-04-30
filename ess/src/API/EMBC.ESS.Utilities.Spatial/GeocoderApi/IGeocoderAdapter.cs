using System.Threading;
using System.Threading.Tasks;

namespace EMBC.ESS.Utilities.Spatial.GeocoderApi
{
    internal interface IGeocoderAdapter
    {
        Task<Geocode> Resolve(string address, CancellationToken ct);
    }
}