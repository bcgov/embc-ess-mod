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
using EMBC.Registrants.API.Controllers;

namespace EMBC.Registrants.API.Services
{
    public static class ProfilesConflictDetector
    {
        public static IEnumerable<ProfileDataConflict> DetectConflicts(Profile source, Profile target)
        {
            if (source == null || target == null) yield break;
            if (source.PersonalDetails != null && !source.PersonalDetails.DateofBirthEquals(target.PersonalDetails))
            {
                yield return new DateOfBirthDataConflict
                {
                    OriginalValue = source.PersonalDetails?.DateOfBirth,
                    ConflictingValue = target.PersonalDetails?.DateOfBirth
                };
            }
            if (source.PersonalDetails != null && !source.PersonalDetails.NameEquals(target.PersonalDetails))
            {
                yield return new NameDataConflict
                {
                    OriginalValue = (firstName: source.PersonalDetails?.FirstName, lastName: source.PersonalDetails?.LastName),
                    ConflictingValue = (firstName: target.PersonalDetails?.FirstName, lastName: target.PersonalDetails?.LastName),
                };
            }
            if (source.PrimaryAddress != null && !source.PrimaryAddress.AddressEquals(target.PrimaryAddress))
            {
                yield return new AddressDataConflict
                {
                    OriginalValue = source.PrimaryAddress,
                    ConflictingValue = target.PrimaryAddress,
                };
            }
            yield break;
        }

        private static bool AddressEquals(this Address address, Address other) =>
            (address == null && other == null) ||
            (address != null &&
            address.AddressLine1.StringSafeEquals(other?.AddressLine1) &&
            address.PostalCode.StringSafeEquals(other?.PostalCode) &&
            address.Community.StringSafeEquals(other?.Community) &&
            address.StateProvince.StringSafeEquals(other?.StateProvince) &&
            address.Country.StringSafeEquals(other?.Country));

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
