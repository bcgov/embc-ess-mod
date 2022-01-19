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
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Cache;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;

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

    public class MetadataRepository : IMetadataRepository
    {
        private readonly EssContext essContext;
        private readonly IMapper mapper;
        private readonly ICache cache;
        private static TimeSpan cacheEntryLifetime = TimeSpan.FromHours(6);

        public MetadataRepository(IEssContextFactory essContextFactory, IMapper mapper, ICache cache)
        {
            this.essContext = essContextFactory.CreateReadOnly();
            this.mapper = mapper;
            this.cache = cache;
        }

        public async Task<IEnumerable<Country>> GetCountries()
        {
            return await cache.GetOrSet("metadata:countries",
                async () => mapper.Map<IEnumerable<Country>>(await essContext.era_countries.GetAllPagesAsync()),
                cacheEntryLifetime);
        }

        public async Task<IEnumerable<StateProvince>> GetStateProvinces()
        {
            return await cache.GetOrSet("metadata:stateprovinces",
                async () => mapper.Map<IEnumerable<StateProvince>>(await essContext.era_provinceterritorieses.Expand(c => c.era_RelatedCountry).GetAllPagesAsync()),
                cacheEntryLifetime);
        }

        public async Task<IEnumerable<Community>> GetCommunities()
        {
            return await cache.GetOrSet("metadata:communities",
                async () =>
                {
                    var jurisdictions = await essContext.era_jurisdictions
                        .Expand(j => j.era_RelatedProvinceState)
                        .Expand(j => j.era_RegionalDistrict)
                        .GetAllPagesAsync();

                    var communities = mapper.Map<IEnumerable<Community>>(jurisdictions);

                    // a hack to map country codes to communities because Dynamics v9.0 doesn't allow multi step expansion (i.e. province->country)
                    var stateProvinces = essContext.era_provinceterritorieses
                           .Select(sp => new { code = sp.era_code, countryId = sp.era_RelatedCountry.era_countryid, countryCode = sp.era_RelatedCountry.era_countrycode })
                           .ToArray();

                    foreach (var community in communities)
                    {
                        community.CountryCode = stateProvinces.SingleOrDefault(sp => sp.code == community.StateProvinceCode)?.countryCode;
                    }
                    return communities;
                },
                cacheEntryLifetime);
        }

        public async Task<string[]> GetSecurityQuestions()
        {
            return await cache.GetOrSet("metadata:securityquestions",
                async () =>
                {
                    var optionSetDefinitions = await essContext.GlobalOptionSetDefinitions.GetAllPagesAsync();
                    var securityQuestionsOptionSet = (OptionSetMetadata)optionSetDefinitions.Where(t => t.Name.Equals("era_registrantsecretquestions")).SingleOrDefault();
                    var options = securityQuestionsOptionSet.Options.Select(o => o.Label.UserLocalizedLabel.Label).ToArray();
                    return options;
                },
                cacheEntryLifetime);
        }

        public async Task<IEnumerable<OutageInformation>> GetPlannedOutages(OutageQuery query)
        {
            return await cache.GetOrSet("metadata:plannedoutages",
                 async () => mapper.Map<IEnumerable<OutageInformation>>(
                     await ((DataServiceQuery<era_portalbanner>)essContext.era_portalbanners
                        .Where(pb => pb.era_portal == (int?)query.PortalType &&
                            pb.era_startdisplaydate <= query.DisplayDate &&
                            pb.era_enddisplaydate >= query.DisplayDate))
                        .GetAllPagesAsync()), cacheEntryLifetime);
        }
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
