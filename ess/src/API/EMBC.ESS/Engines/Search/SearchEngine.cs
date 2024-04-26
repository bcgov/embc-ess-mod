using System;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics;

namespace EMBC.ESS.Engines.Search
{
    internal partial class SearchEngine(IEssContextFactory essContextFactory) : ISearchEngine
    {
        public async Task<SearchResponse> Search(SearchRequest request, CancellationToken ct = default) =>
            request switch
            {
                EvacueeSearchRequest r => await Handle(r, ct),
                SupportSearchRequest r => await Handle(r, ct),

                _ => throw new NotSupportedException($"{request.GetType().Name} is not supported")
            };
    }
}
