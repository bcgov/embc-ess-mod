using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace EMBC.Utilities.Extensions
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

        public static TProperty? SingleOrDefaultProperty<TEntity, TProperty>(this IEnumerable<TEntity> source,
            Expression<Func<TEntity, TProperty>> propertyExpression) => source.SingleOrDefaultProperty(t => true, propertyExpression);

        public static TProperty? SingleOrDefaultProperty<TEntity, TProperty>(this IEnumerable<TEntity> source, Func<TEntity, bool> predicate,
            Expression<Func<TEntity, TProperty>> propertyExpression)
        {
            var entity = source.SingleOrDefault(predicate);
            return entity == null ? default : propertyExpression.Compile().Invoke(entity);
        }

        public static async Task<IEnumerable<TResult>> SelectManyAsync<T, TResult>(this IEnumerable<T> enumeration, Func<T, Task<IEnumerable<TResult>>> selector) =>
            (await Task.WhenAll(enumeration.Select(selector))).SelectMany(s => s);

        public static async Task<IEnumerable<TResult>> SelectAsync<T, TResult>(this IEnumerable<T> enumeration, Func<T, Task<TResult>> selector) =>
            await Task.WhenAll(enumeration.Select(selector));
    }
}
