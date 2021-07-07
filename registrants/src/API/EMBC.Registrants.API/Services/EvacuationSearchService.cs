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
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Submissions;
using EMBC.Registrants.API.Utils;

namespace EMBC.Registrants.API.Services
{
    public interface IEvacuationSearchService
    {
        Task<IEnumerable<EvacuationFile>> GetFiles(string byRegistrantUserId, EvacuationFileStatus[] byStatus);

        Task<RegistrantProfile> GetRegistrantByUserId(string userId);
    }

    public class EvacuationSearchService : IEvacuationSearchService
    {
        private readonly IMessagingClient messagingClient;

        public EvacuationSearchService(IMessagingClient messagingClient)
        {
            this.messagingClient = messagingClient;
        }

        public async Task<IEnumerable<EvacuationFile>> GetFiles(string byRegistrantUserId, EvacuationFileStatus[] byStatus)
        {
            var files = (await messagingClient.Send(new EvacuationFilesQuery
            {
                PrimaryRegistrantUserId = byRegistrantUserId,
                IncludeFilesInStatuses = byStatus
            })).Items;

            return files;
        }

        public async Task<RegistrantProfile> GetRegistrantByUserId(string userId)
        {
            var registrant = (await messagingClient.Send(new RegistrantsQuery
            { UserId = userId })).Items.SingleOrDefault();

            return registrant;
        }
    }
}
