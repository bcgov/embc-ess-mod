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
using System.Collections.Generic;

namespace EMBC.ESS.Shared.Contracts.Team
{
    public class TeamMembersByIdQueryCommand
    {
        public string TeamId { get; set; }
        public string MemberId { get; set; }
    }

    public class TeamMembersQueryResponse
    {
        public string TeamId { get; set; }

        public IEnumerable<TeamMember> TeamMembers { get; set; }
    }

    public class SaveTeamMemberCommand
    {
        public TeamMember Member { get; set; }
    }

    public class SaveTeamMemberResponse
    {
        public string TeamId { get; set; }

        public string MemberId { get; set; }
    }

    public class DeactivateTeamMemberCommand
    {
        public string TeamId { get; set; }
        public string MemberId { get; set; }
    }

    public class DeactivateTeamMemberResponse { }

    public class ActivateTeamMemberCommand
    {
        public string TeamId { get; set; }
        public string MemberId { get; set; }
    }

    public class ActivateTeamMemberResponse { }

    public class DeleteTeamMemberCommand
    {
        public string TeamId { get; set; }
        public string MemberId { get; set; }
    }

    public class DeleteTeamMemberResponse { }

    public class TeamMember
    {
        public string Id { get; set; }

        public string TeamId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string UserName { get; set; }

        public string ExternalUserId { get; set; }

        public TeamRole Role { get; set; }

        public string Label { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public DateTime? AgreementSignDate { get; set; }

        public DateTime? LastSuccessfulLogin { get; set; }

        public bool IsActive { get; set; }
    }

    public class TeamRole
    {
        public string Id { get; set; }

        public string Name { get; set; }
    }
}
