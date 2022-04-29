using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
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

            var ct = new CancellationTokenSource().Token;
            var ctx = essContextFactory.CreateReadOnly();

            IEnumerable<era_householdmember> membersQuery;
            if (request.SearchMode == SearchMode.Both)
            {
                membersQuery = await ((DataServiceQuery<era_householdmember>)ctx.era_householdmembers
                    .Where(m => m.statecode == (int)EntityState.Active)
                    .Where(m => m.era_firstname.Equals(request.FirstName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.era_lastname.Equals(request.LastName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.era_dateofbirth.Equals(Date.Parse(request.DateOfBirth))))
                    .GetAllPagesAsync(ct);
            }
            else if (request.SearchMode == SearchMode.HouseholdMembers)
            {
                //when searching HouseholdMembers only, we only return results that are not already linked to a Registrant.
                membersQuery = await ((DataServiceQuery<era_householdmember>)ctx.era_householdmembers
                    .Where(m => m.statecode == (int)EntityState.Active)
                    .Where(m => m.era_firstname.Equals(request.FirstName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.era_lastname.Equals(request.LastName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.era_dateofbirth.Equals(Date.Parse(request.DateOfBirth)))
                    .Where(m => m._era_registrant_value == null))
                    .GetAllPagesAsync(ct);
            }
            else
            {
                membersQuery = Array.Empty<era_householdmember>();
            }

            var registrantsQuery = request.SearchMode == SearchMode.Both || request.SearchMode == SearchMode.Registrants
                ? await ((DataServiceQuery<contact>)ctx.contacts
                    .Where(m => m.statecode == (int)EntityState.Active)
                    .Where(m => m.firstname.Equals(request.FirstName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.lastname.Equals(request.LastName, StringComparison.OrdinalIgnoreCase))
                    .Where(m => m.birthdate.Equals(Date.Parse(request.DateOfBirth))))
                    .GetAllPagesAsync(ct)
                : Array.Empty<contact>();

            var response = new EvacueeSearchResponse
            {
                MatchingHouseholdMemberIds = membersQuery.Select(m => m.era_householdmemberid.ToString()).Distinct().ToArray(),
                MatchingRegistrantIds = registrantsQuery.Select(m => m.contactid.ToString()).Distinct().ToArray()
            };

            return await Task.FromResult(response);
        }
    }
}
