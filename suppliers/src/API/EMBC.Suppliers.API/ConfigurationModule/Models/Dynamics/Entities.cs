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

#pragma warning disable CA1707 // Identifiers should not contain underscores
#pragma warning disable SA1300 // Element should begin with upper-case letter

namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
    public class SupportEntity
    {
        public string era_supportid { get; set; }
        public string era_name { get; set; }
    }

    public class CountryEntity
    {
        public string era_countryid { get; set; }
        public string era_countrycode { get; set; }
        public string era_isocountrycode { get; set; }
        public string era_name { get; set; }
    }

    public class StateProvinceEntity
    {
        public string era_provinceterritoriesid { get; set; }
        public string era_code { get; set; }
        public string era_name { get; set; }
        public string _era_relatedcountry_value { get; set; }
    }

    public class JurisdictionEntity
    {
        public string era_jurisdictionid { get; set; }
        public string era_jurisdictionname { get; set; }
        public string era_type { get; set; }
        public string _era_relatedprovincestate_value { get; set; }
    }
}

#pragma warning restore CA1707 // Identifiers should not contain underscores
#pragma warning restore SA1300 // Element should begin with upper-case letter
