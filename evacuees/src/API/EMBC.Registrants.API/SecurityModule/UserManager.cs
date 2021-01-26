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

using System.Text.Json;
using System.Threading.Tasks;

namespace EMBC.Registrants.API.SecurityModule
{
    public interface IUserManager
    {
        Task<User> Get(string userId);

        Task<string> Save(string userId, JsonDocument userData);
    }

    public class UserManager : IUserManager
    {
        private readonly IUserRepository userRepository;

        public UserManager(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        public async Task<User> Get(string userId)
        {
            await Task.CompletedTask;
            return null;
        }

        public async Task<string> Save(string userId, JsonDocument userData)
        {
            var user = new User()
            {
                Id = userId,
                DisplayName = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.DisplayName)?.GetString(),
                Email = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Email)?.GetString(),
                FirstName = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.GivenName)?.GetString(),
                LastName = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.FamilyName)?.GetString(),
                StreetAddress = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressStreet)?.GetString(),
                StateProvince = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressRegion)?.GetString(),
                Country = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressCountry)?.GetString(),
                PostalCode = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressPostalCode)?.GetString(),
                City = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressLocality)?.GetString(),
                Gender = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Gender)?.GetString(),
                BirthDate = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.BirthDate)?.GetString(),
            };

            if (await userRepository.Read(userId) == null)
            {
                await userRepository.Create(user);
            }
            else
            {
                await userRepository.Update(user);
            }

            return user.Id;
        }
    }

    public static class JsonEx
    {
        public static JsonElement? AttemptToGetProperty(this JsonElement jsonElement, string propertyName) =>
           jsonElement.TryGetProperty(propertyName, out var underlyingJsonElement) ? (JsonElement?)underlyingJsonElement : null;
    }
}
