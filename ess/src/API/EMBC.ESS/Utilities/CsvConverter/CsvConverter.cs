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

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Reflection;

namespace EMBC.ESS.Utilities.CsvConverter
{
    public static class CsvConverter
    {
        private static void CreateHeader<T>(IEnumerable<T> list, TextWriter sw, string quoteIdentifier = "")
        {
            PropertyInfo[] properties = typeof(T).GetProperties();
            for (int i = 0; i < properties.Length - 1; i++)
            {
                var attr = properties[i].GetCustomAttribute<DisplayAttribute>();
                sw.Write(Quote(attr != null ? attr.Name : properties[i].Name, quoteIdentifier) + ",");
            }
            var lastProp = properties[properties.Length - 1].Name;
            sw.Write(Quote(lastProp, quoteIdentifier) + sw.NewLine);
        }

        private static void CreateRows<T>(IEnumerable<T> list, TextWriter sw, string quoteIdentifier = "")
        {
            foreach (var item in list)
            {
                PropertyInfo[] properties = typeof(T).GetProperties();
                for (int i = 0; i < properties.Length - 1; i++)
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
            PropertyInfo[] properties = headerObj.GetType().GetProperties();

            // Add Search header
            sw.Write("Search Parameters");
            sw.Write(sw.NewLine);

            for (int i = 0; i < properties.Length; i++)
            {
                var attr = properties[i].GetCustomAttribute<DisplayAttribute>();
                string propName = attr != null ? attr.Name : properties[i].Name;
                object propValue = properties[i].GetValue(headerObj, null);
                sw.Write(propName + ":" + ",");
                sw.Write(propValue != null ? propValue.ToString() : string.Empty);
                sw.Write(sw.NewLine);
            }
            sw.Write(sw.NewLine);
        }
    }
}
