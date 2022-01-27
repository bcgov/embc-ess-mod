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

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;

namespace EMBC.ESS.Resources.Metadata
{
    internal class InternalMetadataRepository : IMetadataRepository
    {
        private readonly IMapper mapper;
        private readonly EssContext essContext;

        public InternalMetadataRepository(IEssContextFactory essContextFactory, IMapper mapper)
        {
            this.mapper = mapper;
            this.essContext = essContextFactory.CreateReadOnly();
        }

        public async Task<IEnumerable<Community>> GetCommunities()
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
        }

        public async Task<IEnumerable<Country>> GetCountries()
        {
            return mapper.Map<IEnumerable<Country>>(await essContext.era_countries.GetAllPagesAsync());
        }

        public async Task<IEnumerable<OutageInformation>> GetPlannedOutages(OutageQuery query)
        {
            return mapper.Map<IEnumerable<OutageInformation>>(
                await ((DataServiceQuery<era_portalbanner>)essContext.era_portalbanners
                .Where(pb => pb.era_portal == (int?)query.PortalType &&
                    pb.era_startdisplaydate <= query.DisplayDate &&
                    pb.era_enddisplaydate >= query.DisplayDate)).GetAllPagesAsync());
        }

        public async Task<string[]> GetSecurityQuestions()
        {
            var optionSetDefinitions = await essContext.GlobalOptionSetDefinitions.GetAllPagesAsync();
            var securityQuestionsOptionSet = (OptionSetMetadata)optionSetDefinitions.Where(t => t.Name.Equals("era_registrantsecretquestions")).SingleOrDefault();
            var options = securityQuestionsOptionSet.Options.Select(o => o.Label.UserLocalizedLabel.Label).ToArray();
            return options;
        }

        public async Task<IEnumerable<StateProvince>> GetStateProvinces()
        {
            return mapper.Map<IEnumerable<StateProvince>>(await essContext.era_provinceterritorieses.Expand(c => c.era_RelatedCountry).GetAllPagesAsync());
        }
    }
}
