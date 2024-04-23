using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Anywhere.ArcGIS;
using Anywhere.ArcGIS.Common;
using Anywhere.ArcGIS.Operation;

namespace EMBC.ESS.Utilities.Spatial.ArcGISApi
{
    internal class ArcGISAdapter(PortalGateway portalGateway) : IArcGISAdapter
    {
        public async Task<IEnumerable<GISFeature>> QueryService(PointIntersectionQuery query)
        {
            var arcGisQuery = new Query(query.ServiceName.AsEndpoint())
            {
                Geometry = new Point
                {
                    X = query.Coordinates.Longitude,
                    Y = query.Coordinates.Latitude,
                    SpatialReference = SpatialReference.WGS84
                },
                SpatialRelationship = SpatialRelationshipTypes.Intersects,
            };

            var result = await portalGateway.Query(arcGisQuery);

            return result.Features.Select(f => new GISFeature(f.Attributes.ToDictionary(a => a.Key, a => a.Value))).ToList();
        }
    }
}
