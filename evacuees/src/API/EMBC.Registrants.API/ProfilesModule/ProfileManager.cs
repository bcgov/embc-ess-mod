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

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Registrants.API.SecurityModule;

namespace EMBC.Registrants.API.ProfilesModule
{
    public interface IProfileManager
    {
        Task<Profile> GetProfileByBceid(string userId);

        Task<string> SaveProfile(Profile profile);

        Task<IEnumerable<ProfileDataConflict>> GetProfileConflicts(string userId);

        Task DeleteProfile(string userId);

        Task<Profile> GetLoginProfile(string userId);
    }

    public class ProfileManager : IProfileManager
    {
        private readonly IProfileRepository profileRepository;
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public ProfileManager(IProfileRepository profileRepository, IUserRepository userRepository, IMapper mapper)
        {
            this.profileRepository = profileRepository;
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        public async Task DeleteProfile(string userId)
        {
            await profileRepository.Delete(userId);
        }

        public async Task<IEnumerable<ProfileDataConflict>> GetProfileConflicts(string userId)
        {
            var user = await userRepository.Read(userId);
            if (user == null) return null;

            var userProfile = mapper.Map<Profile>(user);
            var profile = await profileRepository.Read(user.Id);
            var conflicts = ProfilesConflictDetector.DetectConflicts(profile, userProfile);

            return conflicts.ToArray();
        }

        public async Task<Profile> GetProfileByBceid(string userId)
        {
            return await profileRepository.Read(userId);
        }

        public async Task<string> SaveProfile(Profile profile)
        {
            if (!await profileRepository.DoesProfileExist(profile.Id))
            {
                await profileRepository.Create(profile);
            }
            else
            {
                await profileRepository.Update(profile);
            }
            return profile.Id;
        }

        public async Task<Profile> GetLoginProfile(string userId)
        {
            var user = await userRepository.Read(userId);
            if (user == null) return null;
            return mapper.Map<Profile>(user);
        }
    }
}
