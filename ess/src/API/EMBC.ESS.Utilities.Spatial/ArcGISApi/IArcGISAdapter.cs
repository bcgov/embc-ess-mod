using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Utilities.Spatial.ArcGISApi
{
    internal interface IArcGISAdapter
    {
        Task<IEnumerable<GISFeature>> QueryService(PointIntersectionQuery query);
    }

    internal record PointIntersectionQuery(string ServiceName, Coordinates Coordinates);

    internal record GISFeature(IEnumerable<KeyValuePair<string, object>> Attributes);
}
