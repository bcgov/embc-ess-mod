﻿using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Utilities.Spatial.EsriApi;

internal interface IArcGISAdapter
{
    Task<IEnumerable<GISFeature>> QueryService(PointIntersectionQuery query);
}

internal record PointIntersectionQuery(string ServiceName, Geocode Point);

internal record GISFeature(IEnumerable<(string, object)> Attributes);