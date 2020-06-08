// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
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
