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
#pragma warning disable SYSLIB0023 // Type or member is obsolete
        private static readonly RandomNumberGenerator crypto = new RNGCryptoServiceProvider();
#pragma warning restore SYSLIB0023 // Type or member is obsolete

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
