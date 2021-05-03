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

using System.Threading.Tasks;

namespace EMBC.Registrants.API.SecurityModule
{
    public interface IUserManager
    {
        Task<User> Get(string userId);

        Task<string> Save(User userProfile);
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
            return await userRepository.Read(userId);
        }

        public async Task<string> Save(User userProfile)
        {
            if (await userRepository.Read(userProfile.Id) == null)
            {
                await userRepository.Create(userProfile);
            }
            else
            {
                await userRepository.Update(userProfile);
            }

            return userProfile.Id;
        }
    }
}
