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
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace EMBC.Utilities.Extensions
{
    public static class SecurityEx
    {
        private static readonly SHA256 sha256 = SHA256.Create();

        public static string ToSha256(this string str) => Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(str)));

        public static string Encrypt(this string str, string symmetricKey)
        {
            using var aes = Aes.Create();

            var key = Encoding.UTF8.GetBytes(symmetricKey);
            using var ms = new MemoryStream();
            //write IV
            ms.Write(aes.IV);
            using (var cs = new CryptoStream(ms, aes.CreateEncryptor(key, aes.IV), CryptoStreamMode.Write))
            {
                //write string
                using (var sw = new StreamWriter(cs))
                {
                    sw.Write(str);
                }
            }
            var encrypted = ms.ToArray();
            //return base64 encrypted string
            return Convert.ToBase64String(encrypted);
        }

        public static string Decrypt(this string str, string symmetricKey)
        {
            using var aes = Aes.Create();

            var key = Encoding.UTF8.GetBytes(symmetricKey);
            using var ms = new MemoryStream(Convert.FromBase64String(str));
            var iv = new byte[aes.IV.Length];
            //read IV
            ms.Read(iv, 0, iv.Length);

            using var decryptor = aes.CreateDecryptor(key, iv);
            using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
            using var sr = new StreamReader(cs);
            //read string
            return sr.ReadToEnd();
        }
    }
}
