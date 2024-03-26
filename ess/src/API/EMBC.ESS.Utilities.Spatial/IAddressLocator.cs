using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace EMBC.ESS.Utilities.Spatial
{
    public interface IAddressLocator
    {
        Task<AddressInformation> LocateAsync(Location location, CancellationToken ct);
    }

    public record Location(string FullAddress)
    {
    }

    public record AddressInformation(Location Location, Geocode? geocode, IEnumerable<LocationAttribute>? Attributes);
    public record Geocode(double Latitude, double Longitude, double score);

    public record LocationAttribute(string Name, string? Value);
}
