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
using System.Text.Json;
using EMBC.Registrants.API.Controllers;

namespace EMBC.Registrants.API.SecurityModule
{
    public static class Mappings
    {
        public static User MapBCSCUserDataToProfile(string userId, JsonDocument userData)
        {
            return new User
            {
                Id = userId,
                DisplayName = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.DisplayName)?.GetString(),
                PersonalDetails = new PersonDetails
                {
                    FirstName = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.GivenName)?.GetString(),
                    LastName = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.FamilyName)?.GetString(),
                    //Gender = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Gender)?.GetString(),
                    DateOfBirth = FormatDateOfBirth(userData.RootElement.AttemptToGetProperty(BcscTokenKeys.BirthDate)?.GetString()),
                },
                ContactDetails = new ContactDetails
                {
                    //Email = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Email)?.GetString(),
                },
                PrimaryAddress = new Address
                {
                    AddressLine1 = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressStreet)?.GetString(),
                    StateProvince = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressRegion)?.GetString(),
                    Country = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressCountry)?.GetString(),
                    PostalCode = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressPostalCode)?.GetString(),
                    Community = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressLocality)?.GetString()
                }
            };
        }

        private static string FormatDateOfBirth(string bcscFormattedBirthDate)
        {
            if (string.IsNullOrEmpty(bcscFormattedBirthDate)) return null;
            if (!DateTime.TryParse(bcscFormattedBirthDate, out var date)) return null;
            return date.ToString("MM'/'dd'/'yyyy");
        }
    }

    public static class JsonEx
    {
        public static JsonElement? AttemptToGetProperty(this JsonElement jsonElement, string propertyName) =>
           jsonElement.TryGetProperty(propertyName, out var underlyingJsonElement) ? (JsonElement?)underlyingJsonElement : null;
    }
}
