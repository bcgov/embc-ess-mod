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

namespace EMBC.ESS.Utilities.Extensions
{
    public static class DateTimeEx
    {
        public static DateTime ToPST(this DateTime date)
        {
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
    }
}
