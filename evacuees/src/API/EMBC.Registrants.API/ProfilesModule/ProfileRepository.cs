// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
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

using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ResourceAccess.Dynamics;

namespace EMBC.Registrants.API.ProfilesModule
{
    public interface IProfileRepository
    {
        Task<Profile> Get(string bcscUserId);
    }

    public class ProfileRepository : IProfileRepository
    {
        private readonly DynamicsClientContext dynamicsClient;
        private readonly IMapper mapper;

        public ProfileRepository(DynamicsClientContext dynamicsClient, IMapper mapper)
        {
            this.dynamicsClient = dynamicsClient;
            this.mapper = mapper;
        }

        public async Task<Profile> Get(string bcscUserId)
        {
            await Task.CompletedTask;
            var contact = dynamicsClient.contacts
                  .Expand(c => c.era_City)
                  .Expand(c => c.era_ProvinceState)
                  .Expand(c => c.era_Country)
                  .Expand(c => c.era_MailingCity)
                  .Expand(c => c.era_MailingProvinceState)
                  .Expand(c => c.era_MailingCountry)
                  .Where(c => c.era_bcservicescardid == bcscUserId)
                  .FirstOrDefault();

            if (contact == null) return null;
            return mapper.Map<Profile>(contact);
        }
    }
}
