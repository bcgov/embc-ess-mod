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
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Registrants.API.SecurityModule
{
    [Route("")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ITokenManager tokenManager;

        public LoginController(ITokenManager tokenManager)
        {
            this.tokenManager = tokenManager;
        }

        /// <summary>
        /// Initiate the BCSC OIDC login challenge
        /// </summary>
        /// <param name="returnUrl">The url to redirect the user after successful login, must be a local path and not a full url</param>
        /// <returns>OIDC challenge response</returns>
        [HttpGet("login")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login(string returnUrl = "/")
        {
            await Task.CompletedTask;

            if (new Uri(returnUrl, UriKind.RelativeOrAbsolute).IsAbsoluteUri)
            {
                ModelState.AddModelError(nameof(returnUrl), $"returnUrl can only be a relative path");
                return BadRequest(ModelState);
            }

            return new ChallengeResult(BcscAuthenticationDefaults.AuthenticationScheme, new AuthenticationProperties
            {
                RedirectUri = returnUrl
            });
        }

        /// <summary>
        /// Issue a new token based on asp.net authentication cookie
        /// </summary>
        /// <returns>a new valid token for the logged in user</returns>
        [HttpGet("token")]
        [Authorize(AuthenticationSchemes = CookieAuthenticationDefaults.AuthenticationScheme)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<string>> Token()
        {
            await Task.CompletedTask;

            foreach (var cookie in Request.Cookies)
            {
                Response.Cookies.Delete(cookie.Key);
            }
            var token = tokenManager.Create(User);
            return Ok(token);
        }

        /// <summary>
        /// Refresh the current user's token
        /// </summary>
        /// <returns>A new refreshed token</returns>
        [HttpGet("token/refresh")]
        [Authorize]// must have a valid token to be able to run this method
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<string>> RefreshToken()
        {
            await Task.CompletedTask;

            var token = tokenManager.Create(User);
            return Ok(token);
        }
    }
}
