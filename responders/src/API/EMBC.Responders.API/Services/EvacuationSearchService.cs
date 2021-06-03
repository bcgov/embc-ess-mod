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
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Submissions;

namespace EMBC.Responders.API.Services
{
    public interface IEvacuationSearchService
    {
        public Task<SearchResults> Search(string firstName, string lastName, string dateOfBirth, Controllers.MemberRole userRole);
    }

    public class SearchResults
    {
        public IEnumerable<EvacuationFile> Files { get; set; }
        public IEnumerable<RegistrantWithFiles> Registrants { get; set; }
    }

    public class EvacuationSearchService : IEvacuationSearchService
    {
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;
        private static EvacuationFileStatus[] tier1FileStatuses = new[] { EvacuationFileStatus.Pending, EvacuationFileStatus.Active, EvacuationFileStatus.Expired };
        private static EvacuationFileStatus[] tier2andAboveFileStatuses = new[] { EvacuationFileStatus.Pending, EvacuationFileStatus.Active, EvacuationFileStatus.Expired, EvacuationFileStatus.Completed };

        public EvacuationSearchService(IMessagingClient messagingClient, IMapper mapper)
        {
            this.messagingClient = messagingClient;
            this.mapper = mapper;
        }

        public async Task<SearchResults> Search(string firstName, string lastName, string dateOfBirth, Controllers.MemberRole userRole)
        {
            var registrants = (await messagingClient.Send(new RegistrantsSearchQuery
            {
                FirstName = firstName,
                LastName = lastName,
                DateOfBirth = dateOfBirth,
                IncludeCases = true
            })).Items;

            var files = (await messagingClient.Send(new EvacuationFilesSearchQuery
            {
                FirstName = firstName,
                LastName = lastName,
                DateOfBirth = dateOfBirth,
                IncludeHouseholdMembers = true
            })).Items;

            //check for restricted files
            var anyRestriction = registrants.SelectMany(r => r.Files).Any(f => f.RestrictedAccess) ||
                files.Any(f => f.RestrictedAccess);
            if (userRole == Controllers.MemberRole.Tier1 && anyRestriction)
            {
                return new SearchResults
                {
                    Files = Array.Empty<EvacuationFile>(),
                    Registrants = Array.Empty<RegistrantWithFiles>()
                };
            }

            //filter files by role
            var statusFilter = userRole == Controllers.MemberRole.Tier1
                ? tier1FileStatuses
                : tier2andAboveFileStatuses;

            files = files.Where(f => statusFilter.Contains(f.Status));
            registrants = registrants.Select(r => new RegistrantWithFiles
            {
                RegistrantProfile = r.RegistrantProfile,
                Files = r.Files.Where(f => statusFilter.Contains(f.Status))
            });

            return new SearchResults
            {
                Registrants = mapper.Map<IEnumerable<RegistrantWithFiles>>(registrants),
                Files = mapper.Map<IEnumerable<EvacuationFile>>(files)
            };
        }
    }
}
