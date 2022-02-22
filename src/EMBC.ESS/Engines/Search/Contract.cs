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
using System.Threading.Tasks;

namespace EMBC.ESS.Engines.Search
{
    public interface ISearchEngine
    {
        public Task<SearchResponse> Search(SearchRequest request);
    }

    public abstract class SearchRequest { }

    public abstract class SearchResponse { }

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
