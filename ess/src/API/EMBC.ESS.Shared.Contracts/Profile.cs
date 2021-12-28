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

namespace EMBC.ESS.Shared.Contracts
{
    public class LogInUserCommand : Query<LogInUserResponse>
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string SourceSystem { get; set; }
    }

    public abstract class LogInUserResponse
    {
    }

    public class SuccessfulLogin : LogInUserResponse
    {
        public UserProfile Profile { get; set; }
    }

    public class FailedLogin : LogInUserResponse
    {
        public string Reason { get; set; }
    }

    public class SignResponderAgreementCommand : Command
    {
        public string UserName { get; set; }
        public DateTime SignatureDate { get; set; }
    }

    public class UserProfile
    {
        public string Id { get; set; }

        public string TeamId { get; set; }

        public string TeamName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string UserName { get; set; }

        public string Role { get; set; }

        public bool RequiredToSignAgreement { get; set; }
        public DateTime? LastLoginDate { get; set; }
    }
}
