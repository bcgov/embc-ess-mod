using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Shared.Contracts.Metadata;
using EMBC.ESS.Utilities.Dynamics;

namespace EMBC.ESS.Managers.Admin
{
    public class AdminManager
    {
        private readonly IMapper mapper;
        private readonly IMetadataRepository metadataRepository;
        private readonly IEssContextStateReporter essContextStatusReporter;

        public AdminManager(
            IMapper mapper,
            IMetadataRepository metadataRepository,
            IEssContextStateReporter essContextStatusReporter)
        {
            this.mapper = mapper;
            this.metadataRepository = metadataRepository;
            this.essContextStatusReporter = essContextStatusReporter;
        }

        public async Task<CountriesQueryResponse> Handle(CountriesQuery _)
        {
            var countries = mapper.Map<IEnumerable<Shared.Contracts.Metadata.Country>>(await metadataRepository.GetCountries());

            return new CountriesQueryResponse { Items = countries };
        }

        public async Task<StateProvincesQueryResponse> Handle(StateProvincesQuery req)
        {
            var stateProvinces = mapper.Map<IEnumerable<Shared.Contracts.Metadata.StateProvince>>(await metadataRepository.GetStateProvinces());

            if (!string.IsNullOrEmpty(req.CountryCode))
            {
                stateProvinces = stateProvinces.Where(sp => sp.CountryCode == req.CountryCode);
            }

            return new StateProvincesQueryResponse { Items = stateProvinces };
        }

        public async Task<CommunitiesQueryResponse> Handle(CommunitiesQuery req)
        {
            var communities = mapper.Map<IEnumerable<Shared.Contracts.Metadata.Community>>(await metadataRepository.GetCommunities());
            if (!string.IsNullOrEmpty(req.CountryCode))
            {
                communities = communities.Where(c => c.CountryCode == req.CountryCode);
            }
            if (!string.IsNullOrEmpty(req.StateProvinceCode))
            {
                communities = communities.Where(c => c.StateProvinceCode == req.StateProvinceCode);
            }

            if (req.Types != null && req.Types.Any())
            {
                var types = req.Types.Select(t => t.ToString()).ToArray();
                communities = communities.Where(c => types.Any(t => t == c.Type.ToString()));
            }

            return new CommunitiesQueryResponse { Items = communities };
        }

        public async Task<SecurityQuestionsQueryResponse> Handle(SecurityQuestionsQuery _)
        {
            return new SecurityQuestionsQueryResponse { Items = await metadataRepository.GetSecurityQuestions() };
        }

        public async Task<OutageQueryResponse> Handle(Shared.Contracts.Metadata.OutageQuery query)
        {
            var unplannedOutage = (await essContextStatusReporter.IsBroken())
                ? new Shared.Contracts.Metadata.OutageInformation { Content = "Unplanned outage detected" }
                : null;

            if (unplannedOutage == null)
            {
                var plannedOutages = mapper.Map<IEnumerable<Shared.Contracts.Metadata.OutageInformation>>(await metadataRepository.GetPlannedOutages(new Resources.Metadata.OutageQuery
                {
                    DisplayDate = DateTime.UtcNow,
                    PortalType = Enum.Parse<Resources.Metadata.PortalType>(query.PortalType.ToString())
                }));

                return new OutageQueryResponse { OutageInfo = plannedOutages.OrderBy(o => o.OutageStartDate).FirstOrDefault() };
            }
            else
            {
                return new OutageQueryResponse { OutageInfo = unplannedOutage };
            }
        }
    }
}
