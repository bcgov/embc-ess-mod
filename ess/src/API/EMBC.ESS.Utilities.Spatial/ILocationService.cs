using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace EMBC.ESS.Utilities.Spatial
{
    public interface ILocationService
    {
        Task<Geocode> ResolveGeocode(Location location, CancellationToken ct);

        Task<IEnumerable<IEnumerable<LocationAttribute>>> GetGeocodeAttributes(Coordinates coordinates, CancellationToken ct);
    }

    public record Location(string AddressString);

    public record Geocode(Coordinates Coordinates, int Score, Location ResolvedLocation);

    public record Coordinates(double Latitude, double Longitude);

    public record LocationAttribute(string Name, string? Value);
}
