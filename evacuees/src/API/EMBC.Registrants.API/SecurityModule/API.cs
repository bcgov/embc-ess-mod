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

using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Registrants.API.SecurityModule
{
    [Route("")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        [HttpGet("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(string returnUrl = "/")
        {
            await Task.CompletedTask;

            return new ChallengeResult(BcscAuthenticationDefaults.AuthenticationScheme, new AuthenticationProperties
            {
                RedirectUri = returnUrl,
                AllowRefresh = true,
                IsPersistent = true,
            });
        }

        [HttpGet("api/user")]
        [Authorize]
        public async Task<ActionResult<User>> GetUser()
        {
            await Task.CompletedTask;
            return Ok(new User
            {
                Id = User.FindFirstValue(RegistrantClaimTypes.Id),
                FirstName = User.FindFirstValue(RegistrantClaimTypes.FirstName),
                LastName = User.FindFirstValue(RegistrantClaimTypes.LastName),
                StreetAddress = User.FindFirstValue(RegistrantClaimTypes.StreetAddress),
                Jurisdiction = User.FindFirstValue(RegistrantClaimTypes.Jurisdiction),
                Province = User.FindFirstValue(RegistrantClaimTypes.Province),
                Country = User.FindFirstValue(RegistrantClaimTypes.Country),
                PostalCode = User.FindFirstValue(RegistrantClaimTypes.PostalCode),
                Gender = User.FindFirstValue(RegistrantClaimTypes.Gender),
                DisplayName = User.Identity.Name,
                DateOfBirth = User.FindFirstValue(RegistrantClaimTypes.DateOfBirth)
            });
        }
    }

    public class User
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string StreetAddress { get; set; }
        public string Jurisdiction { get; set; }
        public string Province { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
        public string Gender { get; set; }
        public string DisplayName { get; set; }
        public string DateOfBirth { get; set; }
    }
}
