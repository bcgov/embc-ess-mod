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
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Registrants.API.SecurityModule;
using EMBC.Registrants.API.Shared;

namespace EMBC.Registrants.API.ProfilesModule
{
    public interface IProfileManager
    {
        Task<string> CreateProfile(Profile profile);

        Task<Profile> GetProfileByBceid(string userId);

        Task UpdateProfile(Profile profile);

        Task<UserProfile> GetProfileAndConflicts(string userId);
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

        public async Task<string> CreateProfile(Profile profile)
        {
            return await profileRepository.Create(profile);
        }

        public async Task<UserProfile> GetProfileAndConflicts(string userId)
        {
            var user = await userRepository.Read(userId);
            if (user == null) return null;
            var userProfile = mapper.Map<Profile>(user);
            var profile = await profileRepository.Read(user.Id);
            if (profile == null) return null;

            var conflicts = profile.DetectConflicts(userProfile);

            return new UserProfile { LoginProfile = userProfile, EraProfile = profile, Conflicts = conflicts };
        }

        public async Task<Profile> GetProfileByBceid(string userId)
        {
            return await profileRepository.Read(userId);
        }

        public async Task UpdateProfile(Profile profile)
        {
            await profileRepository.Update(profile);
        }
    }

    public static class ProfileEx
    {
        public static IEnumerable<ProfileDataConflict> DetectConflicts(this Profile source, Profile target)
        {
            if (!source.PersonalDetails.Equals(target.PersonalDetails))
            {
                yield return new ProfileDataConflict { ConflictDataElement = nameof(Profile.PersonalDetails) };
            }
            if (!source.PrimaryAddress.Equals(target.PrimaryAddress))
            {
                yield return new ProfileDataConflict { ConflictDataElement = nameof(Profile.PrimaryAddress) };
            }
            yield break;
        }

        public static bool Equals(this Address address, Address other) =>
            address.AddressLine1.Equals(other.AddressLine1) &&
            address.PostalCode.Equals(other.PostalCode) &&
            address.Jurisdiction.Code.Equals(other.Jurisdiction.Code) &&
            address.StateProvince.Code.Equals(other.StateProvince.Code) &&
            address.Country.Code.Equals(other.Country.Code);

        public static bool Equals(this PersonDetails personDetails, PersonDetails other) =>
            personDetails.FirstName.Equals(other.FirstName, System.StringComparison.CurrentCultureIgnoreCase) &&
            personDetails.LastName.Equals(other.LastName, System.StringComparison.CurrentCultureIgnoreCase) &&
            personDetails.DateOfBirth.Equals(other.DateOfBirth);
    }
}
