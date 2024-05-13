using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using EMBC.Registrants.API.Controllers;

namespace EMBC.Registrants.API.Services;

public static class ProfilesConflictDetector
{
    public static IEnumerable<ProfileDataConflict> DetectConflicts(Profile source, Profile target)
    {
        if (source?.PersonalDetails != null && target?.PersonalDetails != null)
        {
            if (!source.PersonalDetails.DateofBirthEquals(target.PersonalDetails))
            {
                yield return new DateOfBirthDataConflict
                {
                    OriginalValue = source.PersonalDetails?.DateOfBirth,
                    ConflictingValue = target.PersonalDetails?.DateOfBirth
                };
            }
            if (!source.PersonalDetails.NameEquals(target.PersonalDetails))
            {
                yield return new NameDataConflict
                {
                    OriginalValue = new ProfileName { FirstName = source.PersonalDetails?.FirstName, LastName = source.PersonalDetails?.LastName },
                    ConflictingValue = new ProfileName { FirstName = target.PersonalDetails?.FirstName, LastName = target.PersonalDetails?.LastName },
                };
            }
        }
        if (source?.PrimaryAddress != null && target?.PrimaryAddress != null && !source.PrimaryAddress.AddressEquals(target.PrimaryAddress))
        {
            yield return new AddressDataConflict
            {
                OriginalValue = source.PrimaryAddress,
                ConflictingValue = target.PrimaryAddress,
            };
        }
    }

    private static bool AddressEquals(this Address address, Address other) =>
        address.AddressLine1.StringSafeEquals(other.AddressLine1) &&
        address.PostalCode.StringSafeEquals(other.PostalCode) &&
        address.StateProvince.StringSafeEquals(other.StateProvince);

    private static bool NameEquals(this PersonDetails personDetails, PersonDetails other) =>
        personDetails.FirstName.StringSafeEquals(other?.FirstName) &&
        personDetails.LastName.StringSafeEquals(other?.LastName);

    private static bool DateofBirthEquals(this PersonDetails personDetails, PersonDetails other) =>
        personDetails?.DateOfBirth == other?.DateOfBirth;

    private static bool StringSafeEquals(this string? s, string? other) =>
        string.Equals(s?.RemoveWhitespace(), other?.RemoveWhitespace(), StringComparison.InvariantCultureIgnoreCase);

    private static string RemoveWhitespace(this string? s) =>
        string.IsNullOrWhiteSpace(s) ? null : Regex.Replace(s, "\\s+", string.Empty);
}
