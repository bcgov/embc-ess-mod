using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Reflection;

namespace EMBC.Utilities.Csv
{
    public static class CsvConverter
    {
        private static void CreateHeader<T>(IEnumerable<T> list, TextWriter sw, string quoteIdentifier = "")
        {
            var properties = typeof(T).GetProperties();
            for (var i = 0; i < properties.Length - 1; i++)
            {
                var attr = properties[i].GetCustomAttribute<DisplayAttribute>();
                sw.Write(Quote(attr != null && attr.Name != null ? attr.Name : properties[i].Name, quoteIdentifier) + ",");
            }
            var lastAttr = properties[properties.Length - 1].GetCustomAttribute<DisplayAttribute>();
            var lastProp = lastAttr != null && lastAttr.Name != null ? lastAttr.Name : properties[properties.Length - 1].Name;
            sw.Write(Quote(lastProp, quoteIdentifier) + sw.NewLine);
        }

        private static void CreateRows<T>(IEnumerable<T> list, TextWriter sw, string quoteIdentifier = "")
        {
            foreach (var item in list)
            {
                var properties = typeof(T).GetProperties();
                for (var i = 0; i < properties.Length - 1; i++)
                {
                    var prop = properties[i];
                    sw.Write(Quote(prop.GetValue(item), quoteIdentifier) + ",");
                }
                var lastProp = properties[properties.Length - 1];
                sw.Write(Quote(lastProp.GetValue(item), quoteIdentifier) + sw.NewLine);
            }
        }

        private static string Quote(object value, string quoteIdentifier)
        {
            if (value == null) return string.Empty;
            return quoteIdentifier + value + quoteIdentifier;
        }

        public static void CreateCSV<T>(this IEnumerable<T> list, string filePath)
        {
            using (var sw = new StreamWriter(filePath))
            {
                CreateHeader(list, sw);
                CreateRows(list, sw);
            }
        }

        public static string ToCSV<T>(this IEnumerable<T> list, string quoteIdentifier = "")
        {
            using (var sw = new StringWriter())
            {
                CreateHeader(list, sw, quoteIdentifier);
                CreateRows(list, sw, quoteIdentifier);
                return sw.ToString();
            }
        }

        public static string ToCSV<T>(this IEnumerable<T> list, object headerObj, string quoteIdentifier = "")
        {
            using (var sw = new StringWriter())
            {
                AddHeaderObj(sw, headerObj);
                CreateHeader(list, sw, quoteIdentifier);
                CreateRows(list, sw, quoteIdentifier);
                return sw.ToString();
            }
        }

        private static void AddHeaderObj(StringWriter sw, object headerObj)
        {
            var properties = headerObj.GetType().GetProperties();

            // Add Search header
            sw.Write("Search Parameters");
            sw.Write(sw.NewLine);

            for (var i = 0; i < properties.Length; i++)
            {
                var attr = properties[i].GetCustomAttribute<DisplayAttribute>();
                var propName = attr != null ? attr.Name : properties[i].Name;
                var propValue = properties[i].GetValue(headerObj, null);
                sw.Write(propName + ":" + ",");
                sw.Write(propValue != null ? propValue.ToString() : string.Empty);
                sw.Write(sw.NewLine);
            }
            sw.Write(sw.NewLine);
        }
    }
}
