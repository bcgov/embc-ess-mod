using System;
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
            var jurisdictions = (await essContext.era_jurisdictions.GetAllPagesAsync()).ToArray();
            var stateProvinces = (await essContext.era_provinceterritorieses.GetAllPagesAsync()).ToArray();
            var countries = (await essContext.era_countries.GetAllPagesAsync()).ToArray();
            var districts = (await essContext.era_regionaldistricts.GetAllPagesAsync()).ToArray();
            Parallel.ForEach(jurisdictions, (j) =>
            {
                j.era_RelatedProvinceState = stateProvinces.SingleOrDefault(p => j._era_relatedprovincestate_value == p.era_provinceterritoriesid);
                j.era_RegionalDistrict = districts.SingleOrDefault(d => j._era_regionaldistrict_value == d.era_regionaldistrictid);
            });
            Parallel.ForEach(stateProvinces, (s) =>
            {
                s.era_RelatedCountry = countries.SingleOrDefault(c => s._era_relatedcountry_value == c.era_countryid);
            });

            var communities = jurisdictions
                .AsParallel()
                .Select(j =>
                {
                    var community = mapper.Map<Community>(j);
                    community.CountryCode = stateProvinces.SingleOrDefault(sp => sp.era_provinceterritoriesid == j._era_relatedprovincestate_value.Value)?.era_RelatedCountry?.era_countrycode;
                    return community;
                });

            return communities.ToArray();
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
            var securityQuestionsOptionSet = (OptionSetMetadata)optionSetDefinitions.SingleOrDefault(t => t.Name == "era_registrantsecretquestions");
            return securityQuestionsOptionSet?.Options.Select(o => o.Label.UserLocalizedLabel.Label).ToArray() ?? Array.Empty<string>();
        }

        public async Task<IEnumerable<StateProvince>> GetStateProvinces()
        {
            var stateProvinces = (await essContext.era_provinceterritorieses.GetAllPagesAsync()).ToArray();
            var countries = (await essContext.era_countries.GetAllPagesAsync()).ToArray();
            Parallel.ForEach(stateProvinces, (s) =>
            {
                s.era_RelatedCountry = countries.SingleOrDefault(c => s._era_relatedcountry_value == c.era_countryid);
            });

            return mapper.Map<IEnumerable<StateProvince>>(stateProvinces);
        }

        public async Task<IReadOnlyDictionary<int, string>> GetAuditAccessReasons()
        {
            var optionSetDefinitions = await essContext.GlobalOptionSetDefinitions.GetAllPagesAsync();
            var optionSet = (OptionSetMetadata)optionSetDefinitions.SingleOrDefault(t => t.Name == "era_fileaccessreason");

            return optionSet?.Options.ToDictionary(o => o.Value.Value, o => o.Label.UserLocalizedLabel.Label) ?? new Dictionary<int, string>();
        }
    }
}
