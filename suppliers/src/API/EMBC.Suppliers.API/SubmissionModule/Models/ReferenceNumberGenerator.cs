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

        private DateTime? now = null;
        private string presetReferenceNumber = null;

        public string CreateNew()
        {
            if (presetReferenceNumber != null) return presetReferenceNumber;
            var bytes = new byte[3];
            crypto.GetBytes(bytes);
            var today = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(now ?? DateTime.Today, GetPSTTimeZone());
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
