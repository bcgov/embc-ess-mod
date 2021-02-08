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

using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using EMBC.ResourceAccess.Dynamics;
using Microsoft.Dynamics.CRM;

namespace EMBC.Registrants.API.SecurityModule
{
    public interface IUserRepository
    {
        Task<string> Create(User user);

        Task Delete(string userId);

        Task<User> Read(string userId);

        Task Update(User user);
    }

    public class UserRepository : IUserRepository
    {
        private readonly DynamicsClientContext dynamicsClient;

        public UserRepository(DynamicsClientContext dynamicsClient)
        {
            this.dynamicsClient = dynamicsClient;
        }

        public async Task<string> Create(User user)
        {
            var entity = new era_bcsc
            {
                era_bcscid = Guid.NewGuid(),
                era_identifier = user.Id,
                era_name = user.DisplayName,
                era_data = JsonSerializer.Serialize(user)
            };

            dynamicsClient.AddToera_bcscs(entity);
            await dynamicsClient.SaveChangesAsync();
            dynamicsClient.Detach(entity);

            return entity.era_bcscid.ToString();
        }

        public async Task<User> Read(string userId)
        {
            await Task.CompletedTask;
            var entity = GetUserById(userId);
            if (entity == null) return null;

            dynamicsClient.Detach(entity);
            return JsonSerializer.Deserialize<User>(entity.era_data);
        }

        public async Task Update(User user)
        {
            var entity = GetUserById(user.Id);
            if (entity == null) throw new Exception($"User with id {user.Id} not found in Dynamics");

            entity.era_name = user.DisplayName;
            entity.era_data = JsonSerializer.Serialize(user);

            dynamicsClient.UpdateObject(entity);
            await dynamicsClient.SaveChangesAsync();
        }

        public async Task Delete(string userId)
        {
            var entity = GetUserById(userId);
            if (entity == null) return;

            dynamicsClient.DeleteObject(entity);
            await dynamicsClient.SaveChangesAsync();
        }

        private era_bcsc GetUserById(string userId) => dynamicsClient.era_bcscs.Where(e => e.era_identifier == userId).OrderByDescending(e => e.createdon).FirstOrDefault();
    }

    public class User
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string StreetAddress { get; set; }
        public string City { get; set; }
        public string StateProvince { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string Email { get; set; }
        public string Gender { get; set; }
        public string BirthDate { get; set; }
    }
}
