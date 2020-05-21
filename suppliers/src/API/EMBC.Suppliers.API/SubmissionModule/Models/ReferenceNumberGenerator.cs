using System;
using System.Security.Cryptography;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public static class ReferenceNumberGenerator
    {
        private static readonly RandomNumberGenerator crypto = new RNGCryptoServiceProvider();

        public static string CreateNew()
        {
            var bytes = new byte[3];
            crypto.GetBytes(bytes);
            return $"SUP-{DateTime.Today:yyyyMMdd}-{BitConverter.ToString(bytes).Replace("-", string.Empty, StringComparison.OrdinalIgnoreCase)}";
        }
    }
}
