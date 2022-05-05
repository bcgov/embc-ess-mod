using System.Text.RegularExpressions;

namespace EMBC.ESS.Utilities.Cas
{
    public static class Formatters
    {
        public static string ToCasSupplierName(string firstName, string lastName)
        {
            lastName = StripSpecialCharacters(lastName);
            firstName = StripSpecialCharacters(firstName);
            return $"{lastName.Trim().ToUpperInvariant()}, {firstName.Trim().ToUpperInvariant()}";
        }

        public static string ToCasPostalCode(this string postalCode)
        {
            var s = Regex.Replace(postalCode, @"[^\da-zA-Z]+", string.Empty, RegexOptions.Compiled | RegexOptions.CultureInvariant).ToUpperInvariant();
            return s.Length > 6 ? s.Substring(0, 6) : s;
        }

        public static string StripSpecialCharacters(this string s) =>
            Regex.Replace(s, @"[^0-9a-zA-Z\s,-]+", string.Empty, RegexOptions.Compiled | RegexOptions.CultureInvariant);

        public static string ToCasCity(this string city)
        {
            city = StripSpecialCharacters(city);
            return city.Length > 25 ? city.Substring(0, 25) : city;
        }

        public static string StripCasSiteNumberBrackets(this string siteNumber) => siteNumber.Replace('[', ' ').Replace(']', ' ').Trim();
    }
}
