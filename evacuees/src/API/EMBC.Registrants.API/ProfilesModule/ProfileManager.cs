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
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Registrants.API.SecurityModule;
using EMBC.Registrants.API.Shared;

namespace EMBC.Registrants.API.ProfilesModule
{
    public interface IProfileManager
    {
        Task<Profile> GetProfileByBceid(string userId);

        Task<string> SaveProfile(Profile profile);

        Task<UserProfile> GetProfileAndConflicts(string userId);

        Task DeleteProfile(string userId);
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

        public async Task<UserProfile> GetProfileAndConflicts(string userId)
        {
            var user = await userRepository.Read(userId);
            if (user == null) return null;

            var userProfile = mapper.Map<Profile>(user);
            var profile = await profileRepository.Read(user.Id);
            var conflicts = ProfilesConflictDetector.DetectConflicts(userProfile, profile);

            return new UserProfile { LoginProfile = userProfile, EraProfile = profile, Conflicts = conflicts };
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
    }

    public static class ProfilesConflictDetector
    {
        public static IEnumerable<ProfileDataConflict> DetectConflicts(Profile source, Profile target)
        {
            if (source == null || target == null) yield break;
            if (source.PersonalDetails != null && !source.PersonalDetails.DateofBirthEquals(target.PersonalDetails))
            {
                yield return new ProfileDataConflict { ConflictDataElement = nameof(Profile.PersonalDetails.DateOfBirth) };
            }
            if (source.PersonalDetails != null && !source.PersonalDetails.NameEquals(target.PersonalDetails))
            {
                yield return new ProfileDataConflict { ConflictDataElement = "Name" };
            }
            if (source.PrimaryAddress != null && !source.PrimaryAddress.AddressEquals(target.PrimaryAddress))
            {
                yield return new ProfileDataConflict { ConflictDataElement = nameof(Profile.PrimaryAddress) };
            }
            yield break;
        }

        private static bool AddressEquals(this Address address, Address other) =>
            (address == null && other == null) ||
            (address != null &&
            address.AddressLine1.StringSafeEquals(other?.AddressLine1) &&
            address.PostalCode.StringSafeEquals(other?.PostalCode) &&
            address.Jurisdiction.Code.StringSafeEquals(other?.Jurisdiction?.Code) &&
            address.StateProvince.Code.StringSafeEquals(other?.StateProvince?.Code) &&
            address.Country.Code.StringSafeEquals(other?.Country?.Code));

        private static bool NameEquals(this PersonDetails personDetails, PersonDetails other) =>
            personDetails != null &&
            personDetails.FirstName.StringSafeEquals(other?.FirstName) &&
            personDetails.LastName.StringSafeEquals(other?.LastName);

        private static bool DateofBirthEquals(this PersonDetails personDetails, PersonDetails other) =>
            personDetails?.DateOfBirth == other?.DateOfBirth;

        private static bool StringSafeEquals(this string s, string other) =>
            string.Equals((s ?? string.Empty).Trim(), (other ?? string.Empty).Trim(), StringComparison.InvariantCultureIgnoreCase);
    }
}
