using System;
using System.Security.Cryptography;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public static class SubmissionReferenceNumberGenerator
    {
        public static string CreateNew()
        {
            using var crypto = new RNGCryptoServiceProvider();
            var bytes = new byte[4];
            crypto.GetBytes(bytes);
            return BitConverter.ToString(bytes).Replace("-", string.Empty, StringComparison.OrdinalIgnoreCase);
        }
    }
}
