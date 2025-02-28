using System.Text.RegularExpressions;


namespace EMBC.Utilities.Extensions
{
    public static class StringExtension
    {
        public static string ToUpperCaseNoSpacePostalCode(this string postalCode) =>
               Regex.Replace(postalCode, @"[^\da-zA-Z]+", string.Empty, RegexOptions.Compiled | RegexOptions.CultureInvariant).ToUpperInvariant().TrimTo(6);

        public static string TrimTo(this string s, int maxLength) =>
        s.Length > maxLength ? s.Trim().Substring(0, maxLength).Trim() : s.Trim();
    }
}
