using System.Text.RegularExpressions;

namespace EMBC.ESS.Utilities.Cas
{
    public static class Formatters
    {
        public static string ToCasSupplierName(string firstName, string lastName)
        {
            lastName = StripSpecialCharacters(lastName);
            firstName = StripSpecialCharacters(firstName);
            return $"{lastName.StripSpecialCharacters().ToUpperInvariant().Trim()}, {firstName.StripSpecialCharacters().ToUpperInvariant().Trim()}".TrimTo(80);
        }

        public static string ToCasPostalCode(this string postalCode) =>
            Regex.Replace(postalCode, @"[^\da-zA-Z]+", string.Empty, RegexOptions.Compiled | RegexOptions.CultureInvariant).ToUpperInvariant().TrimTo(6);

        public static string StripSpecialCharacters(this string s) =>
            Regex.Replace(s, @"[^0-9a-zA-Z\s,-]+", string.Empty, RegexOptions.Compiled | RegexOptions.CultureInvariant);

        public static string ToCasCity(this string city) => city.StripSpecialCharacters().TrimTo(25);

        public static string ToCasTelephoneNumber(this string s) => Regex.Replace(s, @"^(\+)|\D", "$1", RegexOptions.Compiled | RegexOptions.CultureInvariant);

        public static string ToCasAddressLine(this string s) => s.StripSpecialCharacters().TrimTo(35);

        public static string StripCasSiteNumberBrackets(this string siteNumber) => siteNumber.Replace('[', ' ').Replace(']', ' ').Trim();

        public static string TrimTo(this string s, int maxLength) =>
            s.Length > maxLength ? s.Trim().Substring(0, maxLength).Trim() : s.Trim();
    }
}
