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
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

namespace EMBC.Registrants.API.SecurityModule
{
    public static class BcscTokenKeys
    {
        public const string Id = "sub";
        public const string GivenName = "given_name";
        public const string FamilyName = "family_name";
        public const string Address = "address";
        public const string AddressStreet = "street_address";
        public const string AddressCountry = "country";
        public const string AddressLocality = "locality";
        public const string AddressRegion = "region";
        public const string AddressPostalCode = "postal_code";
        public const string AddressFormatted = "formatted";
        public const string DisplayName = "display_name";
        public const string BirthDate = "birthdate";
        public const string Gender = "gender";
    }

    public static class RegistrantClaimTypes
    {
        public const string Id = ClaimTypes.NameIdentifier;
        public const string FirstName = "first_name";
        public const string LastName = "last_name";
        public const string StreetAddress = "street_address";
        public const string PostalCode = "postal_code";
        public const string Jurisdiction = "jurisdiction";
        public const string Province = "province";
        public const string Country = "country";
        public const string DateOfBirth = "date_of_birth";
        public const string DisplayName = ClaimTypes.Name;
        public const string Gender = "gender";
    }

    public static class BcscAuthenticationDefaults
    {
        public const string AuthenticationScheme = "BcscOidc";
        public const string DisplayName = "BcscOidc";
        public const string LoggerCategory = "BCSC_OIDC";
    }

    public static class BcscAUthenticationEx
    {
        public static AuthenticationBuilder AddBcscOidc(this AuthenticationBuilder builder, Action<OpenIdConnectOptions> configureOptions) =>
            AddBcscOidc(builder, BcscAuthenticationDefaults.AuthenticationScheme, configureOptions);

        public static AuthenticationBuilder AddBcscOidc(this AuthenticationBuilder builder,
            string authenticationScheme,
            Action<OpenIdConnectOptions> configureOptions = null)
        {
            return builder.AddOpenIdConnect(authenticationScheme, options =>
             {
                 options.SaveTokens = true;
                 options.GetClaimsFromUserInfoEndpoint = true;
                 options.UseTokenLifetime = true;
                 options.ResponseType = OpenIdConnectResponseType.Code;

                 //add required scopes
                 options.Scope.Add("address");
                 options.Scope.Add("email");

                 // map BCSC token values to claims
                 options.ClaimActions.MapJsonKey(RegistrantClaimTypes.Id, BcscTokenKeys.Id);
                 options.ClaimActions.MapJsonKey(RegistrantClaimTypes.FirstName, BcscTokenKeys.GivenName);
                 options.ClaimActions.MapJsonKey(RegistrantClaimTypes.LastName, BcscTokenKeys.FamilyName);
                 options.ClaimActions.MapJsonKey(RegistrantClaimTypes.DisplayName, BcscTokenKeys.DisplayName);
                 options.ClaimActions.MapJsonKey(RegistrantClaimTypes.DateOfBirth, BcscTokenKeys.BirthDate);
                 options.ClaimActions.MapJsonKey(RegistrantClaimTypes.Gender, BcscTokenKeys.Gender);
                 options.ClaimActions.MapJsonSubKey(RegistrantClaimTypes.StreetAddress, BcscTokenKeys.Address, BcscTokenKeys.AddressStreet);
                 options.ClaimActions.MapJsonSubKey(RegistrantClaimTypes.Jurisdiction, BcscTokenKeys.Address, BcscTokenKeys.AddressLocality);
                 options.ClaimActions.MapJsonSubKey(RegistrantClaimTypes.Province, BcscTokenKeys.Address, BcscTokenKeys.AddressRegion);
                 options.ClaimActions.MapJsonSubKey(RegistrantClaimTypes.Country, BcscTokenKeys.Address, BcscTokenKeys.AddressCountry);
                 options.ClaimActions.MapJsonSubKey(RegistrantClaimTypes.PostalCode, BcscTokenKeys.Address, BcscTokenKeys.AddressPostalCode);

                 options.Events = new OpenIdConnectEvents()
                 {
                     OnAuthenticationFailed = async c =>
                     {
                         await Task.CompletedTask;
                         var logger = c.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger(BcscAuthenticationDefaults.LoggerCategory);
                         logger.LogError(c.Exception, $"Error authenticating with BCSC OIDC");

                         c.HandleResponse();
                         // TODO: redirect to an error page
                         // c.Response.Redirect($"/error?message={c.Exception.Message}");
                         c.Response.StatusCode = StatusCodes.Status500InternalServerError;
                         await c.Response.WriteAsync($"BCSC authentication error: {c.Exception}");
                     },
                     OnTokenValidated = async c =>
                     {
                         await Task.CompletedTask;
                         var logger = c.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger(BcscAuthenticationDefaults.LoggerCategory);
                         logger.LogInformation("BCSC user {0} logged in", c.Principal?.FindFirstValue(ClaimTypes.NameIdentifier));
                     }
                 };

                 if (configureOptions != null) configureOptions(options);
             });
        }
    }
}
