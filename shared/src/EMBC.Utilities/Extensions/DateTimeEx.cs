﻿using System;

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

        public static DateTime FromUnspecifiedPstToUtc(this DateTime date)
        {
            //convert from Unspecified PST to UTC
            if (date.Kind != DateTimeKind.Unspecified) date = DateTime.SpecifyKind(date, DateTimeKind.Unspecified);
            return TimeZoneInfo.ConvertTimeBySystemTimeZoneId(date, GetPSTTimeZone(), GetUTCTimeZone());
        }

        private static string GetPSTTimeZone()
        {
            return Environment.OSVersion.Platform switch
            {
                PlatformID.Win32NT => "Pacific Standard Time",
                PlatformID.Unix => "America/Vancouver",
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

        public static bool IsMinor(this DateTime dob) => dob.CalculatetAge(null) < 19;

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
