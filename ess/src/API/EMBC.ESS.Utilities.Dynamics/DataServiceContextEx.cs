using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;

namespace EMBC.ESS.Utilities.Dynamics
{
    public static class DataServiceContextEx
    {
        public static void DetachAll(this DataServiceContext context)
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

        public static void ActivateObject<TEntity>(this DataServiceContext context, TEntity entity, int activeStatusValue = -1)
             where TEntity : crmbaseentity => ModifyEntityStatus(context, entity, (int)EntityState.Active, activeStatusValue);

        public static void DeactivateObject<TEntity>(this DataServiceContext context, TEntity entity, int inactiveStatusValue = -1)
             where TEntity : crmbaseentity => ModifyEntityStatus(context, entity, (int)EntityState.Inactive, inactiveStatusValue);

        private static void ModifyEntityStatus<TEntity>(this DataServiceContext context, TEntity entity, int state, int status)
             where TEntity : crmbaseentity
        {
            var entityType = entity.GetType();
            var statusProp = entityType.GetProperty("statuscode");
            var stateProp = entityType.GetProperty("statecode");

            if (statusProp == null) throw new InvalidOperationException($"statuscode property not found in type {entityType.FullName}");
            if (stateProp == null) throw new InvalidOperationException($"stateProp property not found in type {entityType.FullName}");

            statusProp.SetValue(entity, status);
            if (state >= 0) stateProp.SetValue(entity, state);

            context.UpdateObject(entity);
        }

        public static async Task<T> SingleOrDefaultAsync<T>(this IQueryable<T> query, CancellationToken? ct = null)
            where T : crmbaseentity =>
            (await ((DataServiceQuery<T>)query).ExecuteAsync(ct ?? CancellationToken.None)).SingleOrDefault();

        public static async Task<IEnumerable<T>> GetAllPagesAsync<T>(this IQueryable<T> query, CancellationToken? ct = null)
            where T : crmbaseentity =>
            await ((DataServiceQuery<T>)query).GetAllPagesAsync(ct ?? CancellationToken.None);
    }
}
