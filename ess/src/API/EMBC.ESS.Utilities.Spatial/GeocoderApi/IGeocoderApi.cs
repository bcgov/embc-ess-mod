using System.Threading.Tasks;
using Refit;

namespace EMBC.ESS.Utilities.Spatial.GeocoderApi
{
    internal interface IGeocoderApi
    {
        [Get("/addresses.json?")]
        Task<GetAddressResponse> GetAddress([Query] GetAddressRequest request);
    }

    internal record GetAddressRequest
    {
        public string? addressString { get; set; }
    }

    internal class GetAddressResponse
    {
        public string? baseDataDate { get; set; }
        public string? copyrightLicense { get; set; }
        public string? copyrightNotice { get; set; }
        public Crs? crs { get; set; }
        public string? disclaimer { get; set; }
        public string? echo { get; set; }
        public float? executionTime { get; set; }
        public Feature[]? features { get; set; }
        public string? interpolation { get; set; }
        public string? locationDescriptor { get; set; }
        public int? maxResults { get; set; }
        public int? minScore { get; set; }
        public string? privacyStatement { get; set; }
        public string? queryAddress { get; set; }
        public string? searchTimestamp { get; set; }
        public int? setBack { get; set; }
        public string? type { get; set; }
        public string? version { get; set; }
    }

    internal record Crs
    {
        public CrsProperties? properties { get; set; }
        public string? type { get; set; }
    }

    internal record CrsProperties
    {
        public int code { get; set; }
    }

    internal record Feature
    {
        public Geometry? geometry { get; set; }
        public FeatureProperties? properties { get; set; }
        public string? type { get; set; }
    }

    internal record Geometry
    {
        public double[]? coordinates { get; set; }
        public Crs? crs { get; set; }
        public string? type { get; set; }
    }

    internal record FeatureProperties
    {
        // public string? accessNotes { get; set; }
        //  public string? blockID { get; set; }
        // public string? changeDate { get; set; }
        // public string? civicNumber { get; set; }
        // public string? civicNumberSuffix { get; set; }
        // public string? electoralArea { get; set; }
        // public object[]? faults { get; set; }
        public string? fullAddress { get; set; }
        // public string? fullSiteDescriptor { get; set; }
        // public string? isOfficial { get; set; }
        // public string? isStreetDirectionPrefix { get; set; }
        // public string? isStreetTypePrefix { get; set; }
        // public string? localityName { get; set; }
        // public string? localityType { get; set; }
        // public string? locationDescriptor { get; set; }
        // public string? locationPositionalAccuracy { get; set; }
        // public string? matchPrecision { get; set; }
        // public int? precisionPoints { get; set; }
        // public string? provinceCode { get; set; }
        public double? score { get; set; }
        // public string? siteID { get; set; }
        // public string? siteName { get; set; }
        // public string? siteRetireDate { get; set; }
        // public string? siteStatus { get; set; }
        // public string? streetDirection { get; set; }
        // public string? streetName { get; set; }
        // public string? streetQualifier { get; set; }
        // public string? streetType { get; set; }
        // public string? unitDesignator { get; set; }
        // public int? unitNumber { get; set; }
        // public string? unitNumberSuffix { get; set; }
    }
}
