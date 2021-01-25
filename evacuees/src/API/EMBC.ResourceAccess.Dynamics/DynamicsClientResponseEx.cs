using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.OData.Client;

namespace EMBC.ResourceAccess.Dynamics
{
    public static class DynamicsClientResponseEx
    {
        public static async Task<T> SaveChangesAsync<T>(this DynamicsClientContext dynamicsClient, SaveChangesOptions options) where T : BaseEntityType
        {
            var response = await dynamicsClient.SaveChangesAsync(SaveChangesOptions.BatchWithSingleChangeset);

            //TODO: handle errors properly
            var change = response.First() as ChangeOperationResponse;
            var descriptor = change.Descriptor as EntityDescriptor;
            return descriptor.Entity as T;
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
    }
}
