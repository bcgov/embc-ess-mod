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
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Metadata
{
    public interface IMetadataRepository
    {
        Task<IEnumerable<Country>> GetCountries();

        Task<IEnumerable<StateProvince>> GetStateProvinces();

        Task<IEnumerable<Community>> GetCommunities();

        Task<string[]> GetSecurityQuestions();

        Task<IEnumerable<OutageInformation>> GetPlannedOutages(OutageQuery query);
    }

    public class Country
    {
        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class StateProvince
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string CountryCode { get; set; }
    }

    public class Community
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public CommunityType Type { get; set; }
        public string StateProvinceCode { get; set; }
        public string CountryCode { get; set; }
        public string DistrictCode { get; set; }
        public string DistrictName { get; set; }
    }

#pragma warning disable CA1008 // Enums should have zero value

    public enum CommunityType
#pragma warning restore CA1008 // Enums should have zero value
    {
        Undefined = -1,
        City = 1,
        Village = 2,
        Town = 4,
        ResortMunicipality = 5,
        UrbanCommunity = 10,
        FirstNationsCommunity = 12,
        IndianReserve = 13,
        Community = 16,
        DistrictMunicipality = 100000014,
        IndianGovernmentDistrict = 100000015,
    }

    public class OutageQuery
    {
        public DateTime DisplayDate { get; set; }
        public PortalType PortalType { get; set; }
    }

    public enum PortalType
    {
        Registrants = 174360000,
        Responders = 174360001,
        Suppliers = 174360002
    }

    public class OutageInformation
    {
        public string Content { get; set; }
        public DateTime OutageStartDate { get; set; }
        public DateTime OutageEndDate { get; set; }
    }
}
