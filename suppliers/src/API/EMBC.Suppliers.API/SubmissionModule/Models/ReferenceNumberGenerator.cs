// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
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
using System.Security.Cryptography;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public interface IReferenceNumberGenerator
    {
        string CreateNew();
    }

    public class ReferenceNumberGenerator : IReferenceNumberGenerator
    {
        private static readonly RandomNumberGenerator crypto = new RNGCryptoServiceProvider();

        private DateTime? now;
        private string presetReferenceNumber;

        public string CreateNew()
        {
            if (presetReferenceNumber != null) return presetReferenceNumber;
            var bytes = new byte[3];
            crypto.GetBytes(bytes);
            var today = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(now ?? DateTime.Now.ToUniversalTime(), GetPSTTimeZone());
            return $"SUP-{today:yyyyMMdd}-{BitConverter.ToString(bytes).Replace("-", string.Empty, StringComparison.OrdinalIgnoreCase)}";
        }

        private string GetPSTTimeZone()
        {
            return Environment.OSVersion.Platform switch
            {
                PlatformID.Win32NT => "Pacific Standard Time",
                PlatformID.Unix => "Canada/Pacific",
                _ => throw new NotSupportedException()
            };
        }

        public void OverrideNow(DateTime now)
        {
            this.now = now;
        }

        public void ResetNow()
        {
            this.now = null;
        }

        public void PresetReferenceNumber(string presetReferenceNumber)
        {
            this.presetReferenceNumber = presetReferenceNumber;
        }

        public void ResetPresetReferenceNumber()
        {
            this.presetReferenceNumber = null;
        }
    }
}
