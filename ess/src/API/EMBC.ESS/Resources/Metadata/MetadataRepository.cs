using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.Utilities.Caching;

namespace EMBC.ESS.Resources.Metadata
{
    public class MetadataRepository : IMetadataRepository
    {
        internal const string CountriesCacheKey = "metadata:countries";
        internal const string StatesProvincesCacheKey = "metadata:stateprovinces";
        internal const string CommunitiesCacheKey = "metadata:communities";
        internal const string SecurityQuestionsCacheKey = "metadata:securityquestions";
        internal const string PlannedOutagesCacheKey = "metadata:plannedoutages";

        internal static readonly TimeSpan CacheEntryLifetime = TimeSpan.FromDays(1);

        private readonly InternalMetadataRepository internalRepository;
        private readonly ICache cache;

        public MetadataRepository(IEssContextFactory essContextFactory, IMapper mapper, ICache cache)
        {
            this.internalRepository = new InternalMetadataRepository(essContextFactory, mapper);
            this.cache = cache;
        }

        public async Task<IEnumerable<Country>> GetCountries()
        {
            return await cache.GetOrSet(CountriesCacheKey, internalRepository.GetCountries, CacheEntryLifetime);
        }

        public async Task<IEnumerable<StateProvince>> GetStateProvinces()
        {
            return await cache.GetOrSet(StatesProvincesCacheKey, internalRepository.GetStateProvinces, CacheEntryLifetime);
        }

        public async Task<IEnumerable<Community>> GetCommunities()
        {
            return await cache.GetOrSet(CommunitiesCacheKey, internalRepository.GetCommunities, CacheEntryLifetime);
        }

        public async Task<string[]> GetSecurityQuestions()
        {
            return await cache.GetOrSet(SecurityQuestionsCacheKey, internalRepository.GetSecurityQuestions, CacheEntryLifetime);
        }

        public async Task<IEnumerable<OutageInformation>> GetPlannedOutages(OutageQuery query)
        {
            return await cache.GetOrSet($"{PlannedOutagesCacheKey}:{query.PortalType}", () => internalRepository.GetPlannedOutages(query), CacheEntryLifetime);
        }
    }
}
