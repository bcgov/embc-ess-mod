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
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;

namespace EMBC.ESS.Utilities.Dynamics
{
    public class EssContext : Microsoft.Dynamics.CRM.System
    {
        public EssContext(Uri serviceRoot) : base(serviceRoot)
        {
            era_countries_cached = new Lazy<DataServiceQuery<era_country>>(() => era_countries);
            era_provinceterritories_cached = new Lazy<DataServiceQuery<era_provinceterritories>>(() => era_provinceterritorieses);
            era_jurisdictions_cached = new Lazy<DataServiceQuery<era_jurisdiction>>(() => era_jurisdictions);
        }

#pragma warning disable SA1310 // Field names should not contain underscore
#pragma warning disable SA1304 // Non-private readonly fields should begin with upper-case letter
#pragma warning disable SA1307 // Accessible fields should begin with upper-case letter
#pragma warning disable SA1401 // Fields should be private

        internal readonly Lazy<DataServiceQuery<era_country>> era_countries_cached;
        internal readonly Lazy<DataServiceQuery<era_provinceterritories>> era_provinceterritories_cached;
        internal readonly Lazy<DataServiceQuery<era_jurisdiction>> era_jurisdictions_cached;

#pragma warning restore SA1310 // Field names should not contain underscore
#pragma warning restore SA1307 // Accessible fields should begin with upper-case letter
#pragma warning restore SA1304 // Non-private readonly fields should begin with upper-case letter
#pragma warning restore SA1401 // Fields should be private
    }
}
