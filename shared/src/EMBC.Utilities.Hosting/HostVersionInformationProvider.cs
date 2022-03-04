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
using System.Reflection;
using System.Threading.Tasks;
using EMBC.Utilities.Configuration;

namespace EMBC.Utilities.Hosting
{
    public class HostVersionInformationProvider : IVersionInformationProvider
    {
        public async Task<VersionInformation> Get()
        {
            await Task.CompletedTask;
            var name = Environment.GetEnvironmentVariable("APP_NAME") ?? Assembly.GetEntryAssembly()?.GetName().Name;
            var version = Environment.GetEnvironmentVariable("VERSION");
            return new VersionInformation
            {
                Name = name ?? null!,
                Version = version == null ? null : Version.Parse(version)
            };
        }
    }
}
