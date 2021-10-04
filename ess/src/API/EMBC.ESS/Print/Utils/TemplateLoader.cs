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

using System.IO;
using System.Reflection;

namespace EMBC.ESS.Print.Utils
{
    public class TemplateLoader
    {
        public static string LoadTemplate(string name)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var manifestName = $"EMBC.ESS.Print.Supports.Views.{name}.hbs";
            using (var stream = assembly.GetManifestResourceStream(manifestName))
            {
                using (var reader = new StreamReader(stream))
                {
                    string template = reader.ReadToEnd();
                    return template;
                }
            }
        }
    }
}
