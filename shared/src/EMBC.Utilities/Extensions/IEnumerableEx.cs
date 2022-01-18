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
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace EMBC.ESS.Utilities.Extensions
{
    public static class IEnumerableEx
    {
        //https://devblogs.microsoft.com/pfxteam/implementing-a-simple-foreachasync-part-2/

        public static async Task ForEachAsync<T>(this IEnumerable<T> source, int dop, Func<T, Task> body)
        {
            var tasks = from partition in Partitioner.Create(source).GetPartitions(dop)
                        select Task.Run(async () =>
                        {
                            using (partition)
                            {
                                while (partition.MoveNext()) await body(partition.Current);
                            }
                        });
            await Task.WhenAll(tasks);
        }

        public static TProperty SingleOrDefaultProperty<TEntity, TProperty>(this IEnumerable<TEntity> source, Expression<Func<TEntity, TProperty>> propertyExpression) => source.SingleOrDefaultProperty(t => true, propertyExpression);

        public static TProperty SingleOrDefaultProperty<TEntity, TProperty>(this IEnumerable<TEntity> source, Func<TEntity, bool> predicate, Expression<Func<TEntity, TProperty>> propertyExpression)
        {
            var entity = source.SingleOrDefault(predicate);
            return entity == null ? default : propertyExpression.Compile().Invoke(entity);
        }
    }
}
