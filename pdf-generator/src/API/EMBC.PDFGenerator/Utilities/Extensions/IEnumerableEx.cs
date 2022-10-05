﻿using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMBC.PDFGenerator.Utilities.Extensions
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
    }
}