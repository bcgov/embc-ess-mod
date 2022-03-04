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
using System.Linq;
using System.Threading.Tasks;
using EMBC.Utilities.Configuration;

namespace EMBC.ESS.Utilities.Dynamics
{
    public class DynamicSchemasVersionInformationProvider : IVersionInformationProvider
    {
        private readonly IEssContextFactory essContextFactory;

        public DynamicSchemasVersionInformationProvider(IEssContextFactory essContextFactory)
        {
            this.essContextFactory = essContextFactory;
        }

        public async Task<VersionInformation> Get()
        {
            await Task.CompletedTask;
            string? version = null;
            try
            {
                var ctx = essContextFactory.CreateReadOnly();
                version = ctx.solutions.Where(s => s.isvisible == true && s.uniquename == "ERAEntitySolution").FirstOrDefault()?.version;
            }
            catch (Exception)
            {
            }

            return new VersionInformation
            {
                Name = "Dynamics:ERAEntitySolution",
                Version = version == null ? null : Version.Parse(version)
            };
        }
    }
}
