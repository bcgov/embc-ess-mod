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
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics;
using Microsoft.OData.Edm;

namespace EMBC.ESS.Engines.Search
{
    public class SearchEngine : ISearchEngine
    {
        private readonly EssContext essContext;

        public SearchEngine(EssContext essContext)
        {
            this.essContext = essContext;
        }

        public async Task<SearchResponse> Search(SearchRequest request) =>
                    request.GetType().Name switch
                    {
                        nameof(EvacueeSearchRequest) => await HandleEvacueeSearchRequest((EvacueeSearchRequest)request),
                        _ => throw new NotSupportedException($"{request.GetType().Name} is not supported")
                    };

        private async Task<EvacueeSearchResponse> HandleEvacueeSearchRequest(EvacueeSearchRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (string.IsNullOrWhiteSpace(request.FirstName)) throw new ArgumentNullException(nameof(EvacueeSearchRequest.FirstName));
            if (string.IsNullOrWhiteSpace(request.LastName)) throw new ArgumentNullException(nameof(EvacueeSearchRequest.LastName));
            if (string.IsNullOrWhiteSpace(request.DateOfBirth)) throw new ArgumentNullException(nameof(EvacueeSearchRequest.DateOfBirth));

            //TODO - clean this up
            //if the search is for file matches only - which is search mode HouseholdMembers - then it should only return results that are not already linked to a Registrant.
            var membersQuery = request.SearchMode == SearchMode.Both
                ? essContext.era_householdmembers
                    .Where(m => m.statecode == (int)EntityState.Active)
                    .Where(m => m.era_firstname.Equals(request.FirstName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.era_lastname.Equals(request.LastName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.era_dateofbirth.Equals(Date.Parse(request.DateOfBirth)))
                    .ToArray()
                    .Select(m => m.era_householdmemberid.Value.ToString())
                : request.SearchMode == SearchMode.HouseholdMembers
                ? essContext.era_householdmembers
                    .Where(m => m.statecode == (int)EntityState.Active)
                    .Where(m => m.era_firstname.Equals(request.FirstName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.era_lastname.Equals(request.LastName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.era_dateofbirth.Equals(Date.Parse(request.DateOfBirth)))
                    .Where(m => m._era_registrant_value == null)
                    .ToArray()
                    .Select(m => m.era_householdmemberid.Value.ToString())
                : Array.Empty<string>();

            var registrantsQuery = request.SearchMode == SearchMode.Both || request.SearchMode == SearchMode.Registrants
                ? essContext.contacts
                    .Where(m => m.statecode == (int)EntityState.Active)
                    .Where(m => m.firstname.Equals(request.FirstName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.lastname.Equals(request.LastName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.birthdate.Equals(Date.Parse(request.DateOfBirth)))
                    .ToArray()
                    .Select(m => m.contactid.Value.ToString())
                : Array.Empty<string>();

            var response = new EvacueeSearchResponse
            {
                MatchingHouseholdMemberIds = membersQuery.ToArray(),
                MatchingRegistrantIds = registrantsQuery.ToArray()
            };

            return await Task.FromResult(response);
        }
    }
}
