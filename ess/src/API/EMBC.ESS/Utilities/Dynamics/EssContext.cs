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
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.Extensions.Logging;
using Microsoft.OData;
using Microsoft.OData.Client;

namespace EMBC.ESS.Utilities.Dynamics
{
    public class EssContext : Microsoft.Dynamics.CRM.System
    {
        private readonly ILogger logger;

        public EssContext(Uri uri, Uri url, Func<Task<string>> tokenFactory, ILogger logger) : base(uri)
        {
            this.logger = logger;
            this.SaveChangesDefaultOptions = SaveChangesOptions.BatchWithSingleChangeset;
            BuildingRequest += (sender, args) =>
            {
                args.Headers.Add("Authorization", $"Bearer {tokenFactory().GetAwaiter().GetResult()}");
                if (args.RequestUri.IsAbsoluteUri)
                {
                    args.RequestUri = new Uri(url, (url.AbsolutePath == "/" ? string.Empty : url.AbsolutePath) + args.RequestUri.AbsolutePath + args.RequestUri.Query);
                }
                else
                {
                    args.RequestUri = new Uri(url, (url.AbsolutePath == "/" ? string.Empty : url.AbsolutePath) + uri.AbsolutePath + args.RequestUri.ToString());
                }
            };
            SendingRequest2 += (sender, args) =>
            {
                logger.LogDebug("{0} SendingRequest2 {1} {2} ", nameof(EssContext), args.RequestMessage.Method, args.RequestMessage.Url);
            };
            ReceivingResponse += (sender, args) =>
            {
                logger.LogDebug("{0} ReceivingResponse {1} response", nameof(EssContext), args.ResponseMessage?.StatusCode);
            };
            Configurations.RequestPipeline.OnEntryStarting((arg) =>
            {
                // do not send reference properties and null values to Dynamics
                arg.Entry.Properties = arg.Entry.Properties.Where((prop) => !prop.Name.StartsWith('_') && prop.Value != null);
                logger.LogDebug("{0} OnEntryStarting: {1}", nameof(EssContext), JsonSerializer.Serialize(arg.Entity));
            });

            Configurations.RequestPipeline.OnEntityReferenceLink((arg) =>
            {
                logger.LogDebug("{0} OnEntityReferenceLink url {1}", nameof(EssContext), arg.EntityReferenceLink.Url);
            });
        }
    }

    public static class EssContextEx
    {
        public static async Task<T> SaveChangesAsync<T>(this EssContext context, SaveChangesOptions options)
            where T : BaseEntityType
        {
            var response = await context.SaveChangesAsync(SaveChangesOptions.BatchWithSingleChangeset);

            //TODO: handle errors properly
            var change = response.First() as ChangeOperationResponse;
            var descriptor = change.Descriptor as EntityDescriptor;
            return descriptor.Entity as T;
        }

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

        public static void SoftDeleteObject(this EssContext context, object entity) => ModifyEntityStatus(context, entity, EntityStatus.SoftDelete);

        public static void ActivateObject(this EssContext context, object entity) => ModifyEntityStatus(context, entity, EntityStatus.Active);

        public static void DeactivateObject(this EssContext context, object entity) => ModifyEntityStatus(context, entity, EntityStatus.Inactive);

        private static void ModifyEntityStatus(this EssContext context, object entity, EntityStatus status)
        {
            var entityType = entity.GetType();
            if (!typeof(crmbaseentity).IsAssignableFrom(entityType)) throw new InvalidOperationException($"entity {entityType.FullName} is not a valid {typeof(crmbaseentity).FullName}");
            var statusProp = entity.GetType().GetProperty("statuscode");
            var stateProp = entity.GetType().GetProperty("statecode");

            statusProp.SetValue(entity, (int)status);
            stateProp.SetValue(entity, (int)MapStatusToState(status));

            context.UpdateObject(entity);
        }

        private static EntityState MapStatusToState(EntityStatus state) => state switch
        {
            EntityStatus.Active => EntityState.Active,
            EntityStatus.Inactive => EntityState.Active,
            EntityStatus.SoftDelete => EntityState.Inactive,
            _ => throw new NotImplementedException()
        };
    }

    public static class EssContextLookupHelpers
    {
        public static era_provinceterritories LookupStateProvinceByCode(this EssContext context, string code)
        {
            if (string.IsNullOrEmpty(code)) return null;
            return context.era_provinceterritorieses.Where(p => p.era_code == code).FirstOrDefault();
        }

        public static era_country LookupCountryByCode(this EssContext context, string code)
        {
            if (string.IsNullOrEmpty(code)) return null;
            return context.era_countries.Where(p => p.era_countrycode == code).FirstOrDefault();
        }

        public static era_jurisdiction LookupJurisdictionByCode(this EssContext context, string code)
        {
            if (string.IsNullOrEmpty(code)) return null;
            return context.era_jurisdictions.Where(p => p.era_jurisdictionid == Guid.Parse(code)).FirstOrDefault();
        }
    }
}
