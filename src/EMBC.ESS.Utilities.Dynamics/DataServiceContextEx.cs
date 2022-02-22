﻿// -------------------------------------------------------------------------
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
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData;
using Microsoft.OData.Client;

namespace EMBC.ESS.Utilities.Dynamics
{
    public static class DataServiceContextEx
    {
        public static DataServiceQuerySingle<T> GetSingleEntityByKey<T>(this DataServiceQuery<T> source, IDictionary<string, object> alternateKeys)
        {
            var keys = string.Join(',', alternateKeys.Select(kv => $"{kv.Key}={ODataUriUtils.ConvertToUriLiteral(kv.Value, ODataVersion.V4)}"));
            return new DataServiceQuerySingle<T>(source.Context, source.GetKeyPath(keys));
        }

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

        /// <summary>
        /// Check if the entity is already tracked by the context, if no, then attach and return, if yes, return the tracked entity instead
        /// </summary>
        /// <typeparam name="TEntity">entity type</typeparam>
        /// <param name="context">Dynamics context</param>
        /// <param name="entitySetName">name of the entity set</param>
        /// <param name="entity">the entity to attach</param>
        /// <param name="entityKeyGetter"> a function to resolve the entity id</param>
        /// <returns>a tracked entity - either existing or newly attached</returns>
        public static TEntity AttachOrGetTracked<TEntity>(this DataServiceContext context, string entitySetName, TEntity entity, Func<TEntity, Guid?> entityKeyGetter)
            where TEntity : crmbaseentity
        {
            var currentEntityKey = entityKeyGetter(entity);
            if (!currentEntityKey.HasValue) return entity;
            var matchedEntity = context.EntityTracker.Entities
                .Where(ed => ed.Entity is TEntity && entityKeyGetter((TEntity)ed.Entity) == currentEntityKey)
                .SingleOrDefault()?.Entity as TEntity;

            if (matchedEntity == null) context.AttachTo(entitySetName, entity);

            return matchedEntity ?? entity;
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

            if (statusProp == null) throw new Exception($"statuscode property not found in type {entityType.FullName}");
            if (stateProp == null) throw new Exception($"stateProp property not found in type {entityType.FullName}");

            statusProp.SetValue(entity, status);
            if (state >= 0) stateProp.SetValue(entity, state);

            context.UpdateObject(entity);
        }
    }
}
