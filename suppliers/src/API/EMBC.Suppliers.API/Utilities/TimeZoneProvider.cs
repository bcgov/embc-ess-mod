using System;

namespace EMBC.Suppliers.API.Utilities
{
    public class TimeZoneProvider
    {
        public static string GetPSTTimeZone()
        {
            return Environment.OSVersion.Platform switch
            {
                PlatformID.Win32NT => "Pacific Standard Time",
                PlatformID.Unix => "America/Vancouver", // NOTE: Previous value "Canada/Pacific" is deprecated
                _ => throw new NotSupportedException()
            };
        }

        public static string GetUTCTimeZone()
        {
            return Environment.OSVersion.Platform switch
            {
                PlatformID.Win32NT => "UTC",
                PlatformID.Unix => "Etc/UTC",
                _ => throw new NotSupportedException()
            };
        }
    }
}
