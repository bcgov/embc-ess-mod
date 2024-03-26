using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Anywhere.ArcGIS;
using Anywhere.ArcGIS.Common;
using Anywhere.ArcGIS.Operation;

namespace EMBC.ESS.Utilities.Spatial.EsriApi;

internal class ArcGISAdapter(PortalGateway portalGateway) : IArcGISAdapter
{
    public async Task<IEnumerable<GISFeature>> QueryService(PointIntersectionQuery query)
    {
        var arcGisQuery = new Query(query.ServiceName.AsEndpoint())
        {
            Geometry = new Point
            {
                X = query.Point.Longitude,
                Y = query.Point.Latitude,
                SpatialReference = SpatialReference.WGS84
            },
            SpatialRelationship = SpatialRelationshipTypes.Intersects,
        };

        var result = await portalGateway.Query(arcGisQuery);

        return result.Features.Select(f => new GISFeature(f.Attributes.Select(a => (a.Key, a.Value)))).ToList();
        //{
        //    Active = f.Attributes.ContainsKey("ESS_STATUS") && f.Attributes["ESS_STATUS"].ToString()!.Equals("active", StringComparison.OrdinalIgnoreCase),
        //    EssTaskNumber = f.Attributes["ESS_TASK_NUMBER"]?.ToString() ?? string.Empty
        //});
    }
}
