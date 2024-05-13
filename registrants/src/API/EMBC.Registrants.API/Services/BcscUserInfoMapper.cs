using System;
using System.Globalization;
using System.Text.Json;
using EMBC.Registrants.API.Controllers;

namespace EMBC.Registrants.API.Services;

public static class BcscTokenKeys
{
    public const string Id = "sub";
    public const string GivenName = "given_name";
    public const string FamilyName = "family_name";
    public const string Address = "address";
    public const string AddressStreet = "street_address";
    public const string AddressCountry = "country";
    public const string AddressLocality = "locality";
    public const string AddressRegion = "region";
    public const string AddressPostalCode = "postal_code";
    public const string AddressFormatted = "formatted";
    public const string DisplayName = "display_name";
    public const string BirthDate = "birthdate";
    public const string Gender = "gender";
    public const string Email = "email";
}

public static class BcscUserInfoMapper
{
    public static Profile MapBcscUserInfoToProfile(string userId, JsonDocument userData)
    {
        return new Profile
        {
            Id = userId,
            // DisplayName = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.DisplayName)?.GetString(),
            PersonalDetails = new PersonDetails
            {
                FirstName = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.GivenName)?.GetString()?.Trim(),
                LastName = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.FamilyName)?.GetString()?.Trim(),
                //Gender = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Gender)?.GetString(),
                DateOfBirth = FormatDateOfBirth(userData.RootElement.AttemptToGetProperty(BcscTokenKeys.BirthDate)?.GetString()?.Trim()),
            },
            ContactDetails = new ContactDetails
            {
                //Email = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Email)?.GetString(),
            },
            PrimaryAddress = new Address
            {
                AddressLine1 = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressStreet)?.GetString()?.Trim(),
                StateProvince = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressRegion)?.GetString()?.Trim(),
                Country = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressCountry)?.GetString()?.Trim(),
                PostalCode = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressPostalCode)?.GetString()?.Trim(),
                City = userData.RootElement.AttemptToGetProperty(BcscTokenKeys.Address)?.AttemptToGetProperty(BcscTokenKeys.AddressLocality)?.GetString()?.Trim()
            }
        };
    }

    private static string? FormatDateOfBirth(string? bcscFormattedBirthDate)
    {
        if (string.IsNullOrEmpty(bcscFormattedBirthDate)) return null;
        if (!DateTime.TryParse(bcscFormattedBirthDate, CultureInfo.InvariantCulture, DateTimeStyles.AssumeLocal, out var date)) return null;
        return date.ToString("MM'/'dd'/'yyyy");
    }
}

public static class JsonEx
{
    public static JsonElement? AttemptToGetProperty(this JsonElement jsonElement, string propertyName) =>
       jsonElement.TryGetProperty(propertyName, out var underlyingJsonElement) ? (JsonElement?)underlyingJsonElement : null;
}
