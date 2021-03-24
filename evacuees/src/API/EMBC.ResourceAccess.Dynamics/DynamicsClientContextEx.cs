using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.OData;
using Microsoft.OData.Client;

namespace EMBC.ResourceAccess.Dynamics
{
    public static class DynamicsClientContextEx
    {
        public static async Task<T> SaveChangesAsync<T>(this DynamicsClientContext dynamicsClient, SaveChangesOptions options) where T : BaseEntityType
        {
            var response = await dynamicsClient.SaveChangesAsync(SaveChangesOptions.BatchWithSingleChangeset);

            //TODO: handle errors properly
            var changeDescriptor = response.Cast<ChangeOperationResponse>().Where(c => (c.Descriptor as EntityDescriptor)?.Entity is T).First().Descriptor as EntityDescriptor;
            return changeDescriptor.Entity as T;
        }

        public static bool TryAddLink<S, T>(this DynamicsClientContext dynamicsClient, S source, string sourceProperty, T target)
            where S : BaseEntityType
            where T : BaseEntityType
        {
            if (source == null || target == null) return false;
            if (!typeof(S).GetProperties().Any(p => p.Name.Equals(sourceProperty, StringComparison.OrdinalIgnoreCase)))
            {
                throw new ArgumentException($"Property {sourceProperty} not found in type {typeof(S).FullName}", nameof(sourceProperty));
            }

            dynamicsClient.AddLink(source, sourceProperty, target);
            return true;
        }

        public static DataServiceQuerySingle<T> GetSingleEntityByKey<T>(this DataServiceQuery<T> source, IDictionary<string, object> alternateKeys)
        {
            var keys = string.Join(',', alternateKeys.Select(kv => $"{kv.Key}={ODataUriUtils.ConvertToUriLiteral(kv.Value, ODataVersion.V4)}"));
            return new DataServiceQuerySingle<T>(source.Context, source.GetKeyPath(keys));
        }

        public static void DetachAll(this DynamicsClientContext context)
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
    }
}
