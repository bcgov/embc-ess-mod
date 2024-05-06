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

        public static TProperty? SingleOrDefaultProperty<TEntity, TProperty>(this IEnumerable<TEntity> source, Expression<Func<TEntity, TProperty>> propertyExpression)
            where TEntity : class => source.SingleOrDefaultProperty(t => true, propertyExpression);

        public static TProperty? SingleOrDefaultProperty<TEntity, TProperty>(this IEnumerable<TEntity> source, Func<TEntity, bool> predicate, Expression<Func<TEntity, TProperty>> propertyExpression)
            where TEntity : class
        {
            var entity = source.SingleOrDefault(predicate);
            return entity == default ? default : propertyExpression.Compile().Invoke(entity);
        }

        public static async Task<IEnumerable<TResult>> SelectManyAsync<T, TResult>(this IEnumerable<T> enumeration, Func<T, Task<IEnumerable<TResult>>> selector) =>
            (await Task.WhenAll(enumeration.Select(selector))).SelectMany(s => s);

        public static async Task<IEnumerable<TResult>> SelectAsync<T, TResult>(this IEnumerable<T> enumeration, Func<T, Task<TResult>> selector) =>
            await Task.WhenAll(enumeration.Select(selector));

        /// <summary>
        /// Filters a sequence for elements with a property matching a predefined list of values (`in` filter)
        /// </summary>
        /// <typeparam name="TSource"></typeparam>
        /// <typeparam name="TValue"></typeparam>
        /// <param name="source">The source query</param>
        /// <param name="valueSelector">The value selector to filter by</param>
        /// <param name="values">The list of values to include</param>
        /// <returns>The query with the added filter</returns>
        public static IQueryable<TSource> WhereIn<TSource, TValue>(this IQueryable<TSource> source, Expression<Func<TSource, TValue>> valueSelector, IEnumerable<TValue> values)
        {
            ArgumentNullException.ThrowIfNull(source);
            ArgumentNullException.ThrowIfNull(valueSelector);
            ArgumentNullException.ThrowIfNull(values);

            var element = valueSelector.Parameters.Single();
            var body = values.Select(v => Expression.Equal(valueSelector.Body, Expression.Constant(v))).Aggregate(Expression.OrElse);

            var lambda = Expression.Lambda<Func<TSource, bool>>(body, element);

            return source.Where(lambda);
        }

        /// <summary>
        /// Filters a sequence for elements with a property not matching a predefined list of values (`not in` filter)
        /// </summary>
        /// <typeparam name="TSource"></typeparam>
        /// <typeparam name="TValue"></typeparam>
        /// <param name="source">The source query</param>
        /// <param name="valueSelector">The value selector to filter by</param>
        /// <param name="values">The list of values to exclude</param>
        /// <returns>The query with the added filter</returns>
        public static IQueryable<TSource> WhereNotIn<TSource, TValue>(this IQueryable<TSource> source, Expression<Func<TSource, TValue>> valueSelector, IEnumerable<TValue> values)
        {
            ArgumentNullException.ThrowIfNull(source);
            ArgumentNullException.ThrowIfNull(valueSelector);
            ArgumentNullException.ThrowIfNull(values);

            var element = valueSelector.Parameters.Single();
            var body = values.Select(v => Expression.NotEqual(valueSelector.Body, Expression.Constant(v))).Aggregate(Expression.AndAlso);

            var lambda = Expression.Lambda<Func<TSource, bool>>(body, element);

            return source.Where(lambda);
        }
    }
}
