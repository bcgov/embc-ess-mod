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
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Utilities.Dynamics
{
    public static class EssContextLookupHelpers
    {
        public static era_provinceterritories? LookupStateProvinceByCode(this EssContext context, string code)
        {
            if (string.IsNullOrEmpty(code)) return null;
            return context.era_provinceterritories_cached.Value.Where(p => p.era_code == code).SingleOrDefault();
        }

        public static era_country? LookupCountryByCode(this EssContext context, string code)
        {
            if (string.IsNullOrEmpty(code)) return null;
            return context.era_countries_cached.Value.Where(p => p.era_countrycode == code).SingleOrDefault();
        }

        public static era_jurisdiction? LookupJurisdictionByCode(this EssContext context, string code)
        {
            if (string.IsNullOrEmpty(code) || !Guid.TryParse(code, out var parsedCode)) return null;
            return context.era_jurisdictions_cached.Value.Where(p => p.era_jurisdictionid == parsedCode).SingleOrDefault();
        }
    }
}
