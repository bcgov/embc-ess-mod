using System;
using System.Collections.Generic;
using System.Linq;

namespace EMBC.Suppliers.API.Utilities
{
    public static class CsvDeserializer
    {
        public static IEnumerable<T> ParseCsv<T>(this IEnumerable<string> lines, Func<string[], int, T> map, string delimiter = ",", bool firstLineIsHeader = true)
        {
            var firstLine = firstLineIsHeader ? 1 : 0;

            return lines
                .Skip(firstLine)
                .Where(l => !string.IsNullOrWhiteSpace(l))
                .Select((l, seq) => map(l.Split(delimiter), seq));
        }

        public static IEnumerable<T> ParseCsv<T>(this IEnumerable<string> lines, Func<string[], int, T> map, char quoteCharacter, string delimiter = ",", bool firstLineIsHeader = true)
        {
            var firstLine = firstLineIsHeader ? 1 : 0;
            delimiter = quoteCharacter + delimiter + quoteCharacter;

            return lines
                .Skip(firstLine)
                .Where(l => !string.IsNullOrWhiteSpace(l))
                .Select((l, seq) => map(l[1..^1].Split(delimiter), seq));
        }
    }
}
