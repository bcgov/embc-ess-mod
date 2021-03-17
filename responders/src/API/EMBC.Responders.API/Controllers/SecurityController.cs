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
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    [ApiController]
    [Route("api/security")]
    public class SecurityController : ControllerBase
    {
        [HttpGet("profile/current")]
        [Authorize]
        public async Task<ActionResult<UserProfile>> GetCurrentUserProfile()
        {
            return await Task.FromResult(new UserProfile
            {
                Id = User.FindFirstValue(ClaimTypes.Sid),
                UserName = User.FindFirstValue(ClaimTypes.Upn),
                FirstName = User.FindFirstValue(ClaimTypes.GivenName),
                LastName = User.FindFirstValue(ClaimTypes.Surname),
                TeamId = "111",
                TeamName = "team111",
                LastSuccessfulLogin = DateTime.Parse("2020/01/01"),
                Role = "Tier1",
                Label = "Volunteer"
            });
        }
    }

    public class UserProfile
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string TeamId { get; set; }
        public string TeamName { get; set; }
        public string Role { get; set; }
        public string Label { get; set; }
        public DateTime? LastSuccessfulLogin { get; set; }
    }
}
