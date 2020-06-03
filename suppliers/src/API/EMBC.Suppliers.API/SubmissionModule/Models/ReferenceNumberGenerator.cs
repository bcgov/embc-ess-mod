using System;
using System.Security.Cryptography;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public static class ReferenceNumberGenerator
    {
        private static readonly RandomNumberGenerator crypto = new RNGCryptoServiceProvider();

        private static DateTime? now = null;

        public static string CreateNew()
        {
            var bytes = new byte[3];
            crypto.GetBytes(bytes);
            var today = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(now ?? DateTime.Today, GetPSTTimeZone());
            return $"SUP-{today:yyyyMMdd}-{BitConverter.ToString(bytes).Replace("-", string.Empty, StringComparison.OrdinalIgnoreCase)}";
        }

        private static string GetPSTTimeZone()
        {
            return Environment.OSVersion.Platform switch
            {
                PlatformID.Win32NT => "Pacific Standard Time",
                PlatformID.Unix => "Canada/Pacific",
                _ => throw new NotSupportedException()
            };

            //return TimeZoneInfo.FindSystemTimeZoneById(timeZoneName);
        }

        public static void OverrideNow(DateTime now)
        {
            ReferenceNumberGenerator.now = now;
        }

        public static void ResetNow()
        {
            ReferenceNumberGenerator.now = null;
        }
    }
}
