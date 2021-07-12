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
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.OData;
using Microsoft.OData.Client;

namespace EMBC.ESS.Utilities.Dynamics
{
    public class EssContext : Microsoft.Dynamics.CRM.System
    {
        private readonly Uri serviceRoot;
        private readonly Uri endpointUrl;
        private readonly Func<Task<string>> tokenFactory;
        private readonly ILogger<EssContext> logger;

        public EssContext(Uri serviceRoot, Uri endpointUrl, Func<Task<string>> tokenFactory, ILogger<EssContext> logger) : base(serviceRoot)
        {
            this.serviceRoot = serviceRoot;
            this.endpointUrl = endpointUrl;
            this.tokenFactory = tokenFactory;
            this.logger = logger;
            this.SaveChangesDefaultOptions = SaveChangesOptions.BatchWithSingleChangeset;
            this.EntityParameterSendOption = EntityParameterSendOption.SendOnlySetProperties;

            Func<Uri, Uri> formatUri = requestUri => requestUri.IsAbsoluteUri
                    ? new Uri(endpointUrl, (endpointUrl.AbsolutePath == "/" ? string.Empty : endpointUrl.AbsolutePath) + requestUri.AbsolutePath + requestUri.Query)
                    : new Uri(endpointUrl, (endpointUrl.AbsolutePath == "/" ? string.Empty : endpointUrl.AbsolutePath) + serviceRoot.AbsolutePath + requestUri.ToString());

            BuildingRequest += (sender, args) =>
            {
                args.Headers.Add("Authorization", $"Bearer {tokenFactory().GetAwaiter().GetResult()}");
                args.RequestUri = formatUri(args.RequestUri);
            };

            Configurations.RequestPipeline.OnEntryStarting((arg) =>
            {
                // do not send reference properties and null values to Dynamics
                arg.Entry.Properties = arg.Entry.Properties.Where((prop) => !prop.Name.StartsWith('_') && prop.Value != null);
            });
        }

        public EssContext Clone()
        {
            return new EssContext(serviceRoot, endpointUrl, tokenFactory, logger);
        }
    }

    public static class EssContextEx
    {
        public static DataServiceQuerySingle<T> GetSingleEntityByKey<T>(this DataServiceQuery<T> source, IDictionary<string, object> alternateKeys)
        {
            var keys = string.Join(',', alternateKeys.Select(kv => $"{kv.Key}={ODataUriUtils.ConvertToUriLiteral(kv.Value, ODataVersion.V4)}"));
            return new DataServiceQuerySingle<T>(source.Context, source.GetKeyPath(keys));
        }

        public static void DetachAll(this EssContext context)
        {
            foreach (var descriptor in context.EntityTracker.Entities)
            {
                context.Detach(descriptor.Entity);
            }
            foreach (var link in context.EntityTracker.Links)
            {
                context.DetachLink(link.Source, link.SourceProperty, link.Target);
            }
        }

        public static void Detach(this EssContext context, params object[] entities)
        {
            foreach (var entity in entities)
            {
                context.Detach(entity);
            }
        }

        public static void ActivateObject(this EssContext context, object entity, int activeStatusValue) =>
            ModifyEntityStatus(context, entity, (int)EntityState.Active, activeStatusValue);

        public static void DeactivateObject(this EssContext context, object entity, int inactiveStatusValue) =>
            ModifyEntityStatus(context, entity, (int)EntityState.Inactive, inactiveStatusValue);

        private static void ModifyEntityStatus(this EssContext context, object entity, int state, int status)
        {
            var entityType = entity.GetType();
            if (!typeof(crmbaseentity).IsAssignableFrom(entityType)) throw new InvalidOperationException($"entity {entityType.FullName} is not a valid {typeof(crmbaseentity).FullName}");
            var statusProp = entity.GetType().GetProperty("statuscode");
            var stateProp = entity.GetType().GetProperty("statecode");

            statusProp.SetValue(entity, status);
            stateProp.SetValue(entity, state);

            context.UpdateObject(entity);
        }
    }

    public static class EssContextLookupHelpers
    {
        public static era_provinceterritories LookupStateProvinceByCode(this EssContext context, string code)
        {
            if (string.IsNullOrEmpty(code)) return null;
            return context.era_provinceterritorieses.Where(p => p.era_code == code).FirstOrDefault();
        }

        public static era_provinceterritories LookupStateProvinceById(this EssContext context, string id)
        {
            if (string.IsNullOrEmpty(id)) return null;
            return context.era_provinceterritorieses.Where(p => p.era_provinceterritoriesid == Guid.Parse(id)).FirstOrDefault();
        }

        public static era_country LookupCountryByCode(this EssContext context, string code)
        {
            if (string.IsNullOrEmpty(code)) return null;
            return context.era_countries.Where(p => p.era_countrycode == code).FirstOrDefault();
        }

        public static era_jurisdiction LookupJurisdictionByCode(this EssContext context, string code)
        {
            if (string.IsNullOrEmpty(code) || !Guid.TryParse(code, out var parsedCode)) return null;
            return context.era_jurisdictions.Where(p => p.era_jurisdictionid == parsedCode).FirstOrDefault();
        }
    }
}
