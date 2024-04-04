using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Anywhere.ArcGIS;
using Anywhere.ArcGIS.Common;
using Anywhere.ArcGIS.Operation;

namespace EMBC.ESS.Utilities.Spatial.ArcGISApi
{
    internal class ArcGISAdapter : IArcGISAdapter
    {
        private readonly PortalGateway portalGateway;

        public ArcGISAdapter(PortalGateway portalGateway)
        {
            this.portalGateway = portalGateway;
        }

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

            return result.Features.Select(f => new GISFeature(f.Attributes.ToDictionary(a => a.Key, a => a.Value))).ToList();
        }
    }
}
