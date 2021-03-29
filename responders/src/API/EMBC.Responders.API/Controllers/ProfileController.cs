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
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Profile;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Handle user profile requests
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;
        private readonly ILogger<ProfileController> logger;

        public ProfileController(IMessagingClient messagingClient, IMapper mapper, ILogger<ProfileController> logger)
        {
            this.messagingClient = messagingClient;
            this.mapper = mapper;
            this.logger = logger;
        }

        /// <summary>
        /// Get the current logged in user profile
        /// </summary>
        /// <returns>current user profile</returns>
        [HttpGet("current")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<UserProfile>> GetCurrentUserProfile()
        {
            var userName = User.FindFirstValue(ClaimTypes.Upn).Split('@')[0];
            var userId = User.FindFirstValue(ClaimTypes.Sid);
            var sourceSystem = User.FindFirstValue("identity_source");

            var response = await messagingClient.Send(new LogInUserCommand { UserId = userId, UserName = userName, SourceSystem = sourceSystem });

            if (response is FailedLogin failedLogin)
            {
                logger.LogError("Login failure userName {0}, user ID {1}, sourceSystem: {2}: {3}", userName, userId, sourceSystem, failedLogin.Reason);
                return Unauthorized();
            }

            var successfulLogin = response as SuccessfulLogin;

            return Ok(mapper.Map<UserProfile>(successfulLogin.Profile));
        }

        /// <summary>
        /// Current user read and signed the electronic agreement
        /// </summary>
        /// <returns>Ok when successful</returns>
        [HttpPost("agreement")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> SignAgreement()
        {
            var userName = User.FindFirstValue(ClaimTypes.Upn).Split('@')[0];
            await messagingClient.Send(new SignResponderAgreementCommand
            {
                UserName = userName,
                SignatureDate = DateTime.Now
            });
            return Ok();
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
        public bool RequiredToSignAgreement { get; set; }
    }

    public class SecurityMapping : Profile
    {
        public SecurityMapping()
        {
            CreateMap<EMBC.ESS.Shared.Contracts.Profile.UserProfile, UserProfile>();
        }
    }
}
