using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Engines.Search
{
    public interface ISearchEngine
    {
        public Task<SearchResponse> Search(SearchRequest request);
    }

    public abstract class SearchRequest
    { }

    public abstract class SearchResponse
    { }

    public class EvacueeSearchRequest : SearchRequest
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DateOfBirth { get; set; }
        public SearchMode SearchMode { get; set; } = SearchMode.Both;
    }

    public enum SearchMode
    {
        Registrants,
        HouseholdMembers,
        Both
    }

    public class EvacueeSearchResponse : SearchResponse
    {
        public IEnumerable<string> MatchingRegistrantIds { get; set; }
        public IEnumerable<string> MatchingHouseholdMemberIds { get; set; }
    }
}
