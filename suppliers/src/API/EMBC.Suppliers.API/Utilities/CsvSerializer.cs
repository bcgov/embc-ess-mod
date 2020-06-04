using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Suppliers.API.Utilities
{
    public static class CsvSerializer
    {
        public static async Task ToCsv<T>(this IEnumerable<T> list, Stream stream)
        {
            using var sw = new StreamWriter(stream, leaveOpen: true);
            await sw.WriteLineAsync(CreateHeader<T>());
            foreach (var row in CreateRows(list)) await sw.WriteLineAsync(row);
        }

        public static async Task ToCsv<T>(this IEnumerable<T> list, Stream stream, char quoteCharacter)
        {
            using var sw = new StreamWriter(stream, leaveOpen: true);
            await sw.WriteLineAsync(CreateHeader<T>(quoteCharacter));
            foreach (var row in CreateRows(list, quoteCharacter)) await sw.WriteLineAsync(row);
        }

        public static string ToCsv<T>(this IEnumerable<T> list)
        {
            var sb = new StringBuilder();
            sb.AppendLine(CreateHeader<T>());
            foreach (var row in CreateRows(list)) sb.AppendLine(row);
            return sb.ToString();
        }

        public static string ToCsv<T>(this IEnumerable<T> list, char quoteCharacter)
        {
            var sb = new StringBuilder();
            sb.AppendLine(CreateHeader<T>(quoteCharacter));
            foreach (var row in CreateRows(list, quoteCharacter)) sb.AppendLine(row);
            return sb.ToString();
        }

        private static string CreateHeader<T>()
        {
            return string.Join(',', typeof(T).GetProperties().Select(p => p.Name));
        }

        private static string CreateHeader<T>(char quoteCharacter)
        {
            return string.Join(',', typeof(T).GetProperties().Select(p => $"{quoteCharacter}{p.Name}{quoteCharacter}"));
        }

        private static IEnumerable<string> CreateRows<T>(IEnumerable<T> rows)
        {
            var properties = typeof(T).GetProperties();
            return rows.Select(r => string.Join(',', properties.Select(p => p.GetValue(r)?.ToString())));
        }

        private static IEnumerable<string> CreateRows<T>(IEnumerable<T> rows, char quoteCharacter)
        {
            var properties = typeof(T).GetProperties();
            return rows.Select(r => string.Join(',', properties.Select(p => $"{quoteCharacter}{p.GetValue(r)?.ToString()}{quoteCharacter}")));
        }
    }
}
