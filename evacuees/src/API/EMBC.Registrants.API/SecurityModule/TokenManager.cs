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
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace EMBC.Registrants.API.SecurityModule
{
    public interface ITokenManager
    {
        string Create(ClaimsPrincipal principal);
    }

    public static class TokenClaimTypes
    {
        public const string Id = ClaimTypes.NameIdentifier;
        public const string UserData = ClaimTypes.UserData;
    }

    public class TokenManager : ITokenManager
    {
        private readonly SymmetricSecurityKey encryptingSecurityKey;
        private readonly SymmetricSecurityKey signingSecurityKey;
        private readonly int expiryInMinutes;
        private readonly string audience;
        private readonly string issuer;

        public TokenManager(IOptions<JwtTokenOptions> options)
        {
            encryptingSecurityKey = string.IsNullOrEmpty(options.Value.EncryptingKey)
                ? null
                : new SymmetricSecurityKey(Encoding.Default.GetBytes(options.Value.EncryptingKey));
            signingSecurityKey = new SymmetricSecurityKey(Encoding.Default.GetBytes(options.Value.SigningKey));
            expiryInMinutes = options.Value.ExpiryInMinutes;
            audience = options.Value.Audience;
            issuer = options.Value.ClaimsIssuer;
        }

        public string Create(ClaimsPrincipal principal)
        {
            var handler = new JwtSecurityTokenHandler();

            var now = DateTime.UtcNow;

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Audience = audience,
                Issuer = issuer,
                Subject = (ClaimsIdentity)principal.Identity,
                EncryptingCredentials = new EncryptingCredentials(encryptingSecurityKey, SecurityAlgorithms.Aes256KW, SecurityAlgorithms.Aes128CbcHmacSha256),
                SigningCredentials = new SigningCredentials(signingSecurityKey, SecurityAlgorithms.HmacSha256),
                IssuedAt = now,
                Expires = now.AddMinutes(expiryInMinutes),
                CompressionAlgorithm = CompressionAlgorithms.Deflate
            };

            return handler.CreateEncodedJwt(tokenDescriptor);
        }
    }

    public class JwtTokenOptions : JwtBearerOptions
    {
        public string SigningKey { get; set; }
        public string EncryptingKey { get; set; }
        public int ExpiryInMinutes { get; set; } = 15;
    }
}
