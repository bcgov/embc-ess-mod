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
            var jurisdictions = (await essContext.era_jurisdictions
                        .Expand(j => j.era_RelatedProvinceState)
                        .Expand(j => j.era_RegionalDistrict)
                        .GetAllPagesAsync())
                        .ToArray();

            var stateProvinces = (await essContext.era_provinceterritorieses.GetAllPagesAsync()).ToArray();

            var communities = jurisdictions
                .AsParallel()
                .Select(j =>
                {
                    var community = mapper.Map<Community>(j);
                    community.CountryCode = stateProvinces.SingleOrDefault(sp => sp.era_provinceterritoriesid == j._era_relatedprovincestate_value.Value)?.era_code;
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
            var securityQuestionsOptionSet = (OptionSetMetadata)optionSetDefinitions.Where(t => t.Name == "era_registrantsecretquestions").SingleOrDefault();
            var options = securityQuestionsOptionSet.Options.Select(o => o.Label.UserLocalizedLabel.Label).ToArray();
            return options;
        }

        public async Task<IEnumerable<StateProvince>> GetStateProvinces()
        {
            return mapper.Map<IEnumerable<StateProvince>>(await essContext.era_provinceterritorieses.Expand(c => c.era_RelatedCountry).GetAllPagesAsync());
        }
    }
}
