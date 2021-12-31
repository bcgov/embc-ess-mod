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
using System.Net.Http.Headers;
using EMBC.Utilities.Configuration;
using EMBC.Utilities.Extensions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.OData.Client;
using Microsoft.OData.Extensions.Client;

namespace EMBC.ESS.Utilities.Dynamics
{
    public class Configuration : IConfigureComponentServices
    {
        public void ConfigureServices(ConfigurationServices configurationServices)
        {
            var services = configurationServices.Services;
            var configuration = configurationServices.Configuration;

            services.Configure<DynamicsOptions>(opts => configuration.GetSection("Dynamics").Bind(opts));

            services
                .AddHttpClient("adfs_token")
                .AddCircuitBreaker((sp, e, t) =>
                {
                    var logger = sp.GetRequiredService<ILoggerFactory>().CreateLogger("adfs_token");
                    logger.LogError(e, "adfs_token break");
                },
                sp =>
                {
                    var logger = sp.GetRequiredService<ILoggerFactory>().CreateLogger("adfs_token");
                    logger.LogInformation("adfs_token reset");
                })
                ;

            services.AddTransient<ISecurityTokenProvider, CachedADFSSecurityTokenProvider>();

            services
                .AddODataClient("dynamics")
                .AddODataClientHandler<DynamicsODataClientHandler>()
                .AddHttpClient()
                .ConfigureHttpClient((sp, c) =>
                {
                    var options = sp.GetRequiredService<IOptions<DynamicsOptions>>().Value;
                    var tokenProvider = sp.GetRequiredService<ISecurityTokenProvider>();
                    c.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenProvider.AcquireToken().GetAwaiter().GetResult());
                })

                .AddCircuitBreaker((sp, e, t) =>
                {
                    var logger = sp.GetRequiredService<ILoggerFactory>().CreateLogger("dynamics");
                    logger.LogError("dynamics break at {1}: {0}", e.GetType().FullName, t);
                }, sp =>
                {
                    var logger = sp.GetRequiredService<ILoggerFactory>().CreateLogger("dynamics");
                    logger.LogInformation("dynamics reset");
                }, 1, 5, 120);

            services.AddScoped<IEssContextFactory, EssContextFactory>();
            services.AddTransient(sp => sp.GetRequiredService<IEssContextFactory>().Create());
        }
    }

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
            e.RequestUri = RewriteRequestUri((DataServiceContext)sender, options.DynamicsApiEndpoint, e.RequestUri);
        }

        private static Uri RewriteRequestUri(DataServiceContext ctx, Uri endpointUri, Uri requestUri) =>
           requestUri.IsAbsoluteUri
                 ? new Uri(endpointUri, (endpointUri.AbsolutePath == "/" ? string.Empty : endpointUri.AbsolutePath) + requestUri.AbsolutePath + requestUri.Query)
                 : new Uri(endpointUri, (endpointUri.AbsolutePath == "/" ? string.Empty : endpointUri.AbsolutePath) + ctx.BaseUri.AbsolutePath + requestUri.ToString());
    }
}
