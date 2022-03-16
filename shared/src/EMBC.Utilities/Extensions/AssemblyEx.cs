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
using System.IO;
using System.Linq;
using System.Reflection;

namespace EMBC.Utilities.Extensions
{
    public static class AssemblyEx
    {
        public static string GetManifestResourceString(this Assembly assembly, string manifestName)
        {
            using (var stream = assembly.GetManifestResourceStream(manifestName))
            {
                using (var reader = new StreamReader(stream))
                {
                    var template = reader.ReadToEnd();
                    return template;
                }
            }
        }

        public static Type[] Discover<I>(this Assembly assembly) =>
         assembly.DefinedTypes.Where(t => t.IsClass && !t.IsAbstract && t.IsPublic && typeof(I).IsAssignableFrom(t)).ToArray();

        public static I[] CreateInstancesOf<I>(this Assembly assembly) =>
            assembly.Discover<I>().Select(t => (I)Activator.CreateInstance(t)).ToArray();
    }
}
