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
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;

namespace EMBC.Registrants.API.SecurityModule
{
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
                         logger.LogInformation("BCSC user {0} logged in", c.SecurityToken.Subject);
                         c.Principal = new ClaimsPrincipal(new ClaimsIdentity(new[]
                             {
                                 new Claim(ClaimTypes.NameIdentifier, c.SecurityToken.Subject)
                             }, c.Principal.Identity.AuthenticationType,
                             ClaimTypes.NameIdentifier,
                             ClaimTypes.Role));
                     },
                     OnUserInformationReceived = async c =>
                     {
                         await Task.CompletedTask;
                         var logger = c.HttpContext.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger(BcscAuthenticationDefaults.LoggerCategory);
                         var profile = Mappings.MapBCSCUserDataToProfile(c.Principal.FindFirstValue(ClaimTypes.NameIdentifier), c.User);
                         logger.LogDebug("BCSC user {0} information received", profile.Id);

                         c.Principal = new ClaimsPrincipal(new ClaimsIdentity(new[]
                             {
                                 new Claim(TokenClaimTypes.Id, profile.Id),
                                 new Claim(TokenClaimTypes.UserData, JsonSerializer.Serialize(profile))
                             }, c.Principal.Identity.AuthenticationType,
                             ClaimTypes.NameIdentifier,
                             ClaimTypes.Role));
                     }
                 };

                 if (configureOptions != null) configureOptions(options);
             });
        }
    }
}
