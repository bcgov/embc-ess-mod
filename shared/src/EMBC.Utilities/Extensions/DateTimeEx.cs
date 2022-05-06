using System;

namespace EMBC.Utilities.Extensions
{
    public static class DateTimeEx
    {
        public static DateTime UtcNowWithKind => DateTime.SpecifyKind(DateTime.UtcNow, DateTimeKind.Utc);

        public static DateTime ToPST(this DateTime date)
        {
            if (date.Kind == DateTimeKind.Unspecified) date = DateTime.SpecifyKind(date, DateTimeKind.Utc);
            return TimeZoneInfo.ConvertTimeBySystemTimeZoneId(date, GetPSTTimeZone());
        }

        private static string GetPSTTimeZone()
        {
            return Environment.OSVersion.Platform switch
            {
                PlatformID.Win32NT => "Pacific Standard Time",
                PlatformID.Unix => "America/Vancouver", // NOTE: Previous value "Canada/Pacific" is deprecated
                _ => throw new NotSupportedException()
            };
        }

        private static string GetUTCTimeZone()
        {
            return Environment.OSVersion.Platform switch
            {
                PlatformID.Win32NT => "UTC",
                PlatformID.Unix => "Etc/UTC",
                _ => throw new NotSupportedException()
            };
        }

        public static int CalculatetAge(this DateTime dob) => dob.CalculatetAge(null);

        public static int CalculatetAge(this DateTime dob, DateTime? referenceDate)
        {
            var now = referenceDate ?? DateTime.Now;
            var age = now.Year - dob.Year;
            //Handle leap years
            if (dob > now.AddYears(-age))
                age--;

            return age;
        }
    }
}
