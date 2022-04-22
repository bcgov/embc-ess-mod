using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics;
using Microsoft.OData.Edm;

namespace EMBC.ESS.Engines.Search
{
    internal partial class SearchEngine
    {
        private async Task<EvacueeSearchResponse> Handle(EvacueeSearchRequest request)
        {
            if (request == null) throw new ArgumentNullException(nameof(request));
            if (string.IsNullOrWhiteSpace(request.FirstName)) throw new ArgumentNullException(nameof(EvacueeSearchRequest.FirstName));
            if (string.IsNullOrWhiteSpace(request.LastName)) throw new ArgumentNullException(nameof(EvacueeSearchRequest.LastName));
            if (string.IsNullOrWhiteSpace(request.DateOfBirth)) throw new ArgumentNullException(nameof(EvacueeSearchRequest.DateOfBirth));

            var ctx = essContextFactory.CreateReadOnly();

            System.Collections.Generic.IEnumerable<string> membersQuery;
            if (request.SearchMode == SearchMode.Both)
            {
                membersQuery = ctx.era_householdmembers
                    .Where(m => m.statecode == (int)EntityState.Active)
                    .Where(m => m.era_firstname.Equals(request.FirstName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.era_lastname.Equals(request.LastName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.era_dateofbirth.Equals(Date.Parse(request.DateOfBirth)))
                    .ToArray()
                    .Select(m => m.era_householdmemberid.Value.ToString());
            }
            else if (request.SearchMode == SearchMode.HouseholdMembers)
            {
                //when searching HouseholdMembers only, we only return results that are not already linked to a Registrant.
                membersQuery = ctx.era_householdmembers
                    .Where(m => m.statecode == (int)EntityState.Active)
                    .Where(m => m.era_firstname.Equals(request.FirstName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.era_lastname.Equals(request.LastName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.era_dateofbirth.Equals(Date.Parse(request.DateOfBirth)))
                    .Where(m => m._era_registrant_value == null)
                    .ToArray()
                    .Select(m => m.era_householdmemberid.Value.ToString());
            }
            else
            {
                membersQuery = Array.Empty<string>();
            }

            var registrantsQuery = request.SearchMode == SearchMode.Both || request.SearchMode == SearchMode.Registrants
                ? ctx.contacts
                    .Where(m => m.statecode == (int)EntityState.Active)
                    .Where(m => m.firstname.Equals(request.FirstName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.lastname.Equals(request.LastName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.birthdate.Equals(Date.Parse(request.DateOfBirth)))
                    .ToArray()
                    .Select(m => m.contactid.Value.ToString())
                : Array.Empty<string>();

            var response = new EvacueeSearchResponse
            {
                MatchingHouseholdMemberIds = membersQuery.Distinct().ToArray(),
                MatchingRegistrantIds = registrantsQuery.Distinct().ToArray()
            };

            return await Task.FromResult(response);
        }
    }
}
