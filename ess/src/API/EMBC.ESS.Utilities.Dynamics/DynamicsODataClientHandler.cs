// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System;
using System.Linq;
using Microsoft.Extensions.Options;
using Microsoft.OData.Client;
using Microsoft.OData.Extensions.Client;

namespace EMBC.ESS.Utilities.Dynamics
{
    public class DynamicsODataClientHandler : IODataClientHandler
    {
        private readonly DynamicsOptions options;

        public DynamicsODataClientHandler(IOptions<DynamicsOptions> options)
        {
            this.options = options.Value;
        }

        public void OnClientCreated(ClientCreatedArgs args)
        {
            var client = args.ODataClient;
            client.SaveChangesDefaultOptions = SaveChangesOptions.BatchWithSingleChangeset;
            client.EntityParameterSendOption = EntityParameterSendOption.SendOnlySetProperties;
            client.Configurations.RequestPipeline.OnEntryStarting((arg) =>
            {
                // do not send reference properties and null values to Dynamics
                arg.Entry.Properties = arg.Entry.Properties.Where((prop) => !prop.Name.StartsWith('_') && prop.Value != null);
            });
            client.BuildingRequest += Client_BuildingRequest;
        }

        private void Client_BuildingRequest(object sender, BuildingRequestEventArgs e)
        {
            e.RequestUri = RewriteRequestUri((DataServiceContext)sender, options.DynamicsApiEndpoint ?? null!, e.RequestUri);
        }

        private static Uri RewriteRequestUri(DataServiceContext ctx, Uri endpointUri, Uri requestUri) =>
           requestUri.IsAbsoluteUri
                 ? new Uri(endpointUri, (endpointUri.AbsolutePath == "/" ? string.Empty : endpointUri.AbsolutePath) + requestUri.AbsolutePath + requestUri.Query)
                 : new Uri(endpointUri, (endpointUri.AbsolutePath == "/" ? string.Empty : endpointUri.AbsolutePath) + ctx.BaseUri.AbsolutePath + requestUri.ToString());
    }
}
