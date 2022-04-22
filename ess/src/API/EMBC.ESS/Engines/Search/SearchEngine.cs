using System;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics;

namespace EMBC.ESS.Engines.Search
{
    internal partial class SearchEngine : ISearchEngine
    {
        private readonly IEssContextFactory essContextFactory;

        public SearchEngine(IEssContextFactory essContextFactory)
        {
            this.essContextFactory = essContextFactory;
        }

        public async Task<SearchResponse> Search(SearchRequest request) =>
            request switch
            {
                EvacueeSearchRequest r => await Handle(r),
                SupportSearchRequest r => await Handle(r),
                _ => throw new NotSupportedException($"{request.GetType().Name} is not supported")
            };
    }
}
