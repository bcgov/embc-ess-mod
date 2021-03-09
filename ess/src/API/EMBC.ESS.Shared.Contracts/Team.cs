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
    public class TeamMembersQueryCommand : Command<TeamMembersQueryResponse>
    {
        public string TeamId { get; set; }
        public string MemberId { get; set; }
    }

    public class TeamMembersQueryResponse : Response
    {
        public string TeamId { get; set; }

        public IEnumerable<TeamMember> TeamMembers { get; set; }
    }

    public class TeamsQueryCommand : Command<TeamsQueryResponse>
    {
        public string TeamId { get; set; }
    }

    public class TeamsQueryResponse : Response
    {
        public IEnumerable<Team> Teams { get; set; }
    }

    public class SaveTeamMemberCommand : Command<SaveTeamMemberResponse>
    {
        public TeamMember Member { get; set; }
    }

    public class SaveTeamMemberResponse : Response
    {
        public string TeamId { get; set; }

        public string MemberId { get; set; }
    }

    public class DeactivateTeamMemberCommand : Command<DeactivateTeamMemberResponse>
    {
        public string TeamId { get; set; }
        public string MemberId { get; set; }
    }

    public class DeactivateTeamMemberResponse : Response { }

    public class ActivateTeamMemberCommand : Command<ActivateTeamMemberResponse>
    {
        public string TeamId { get; set; }
        public string MemberId { get; set; }
    }

    public class ActivateTeamMemberResponse : Response { }

    public class DeleteTeamMemberCommand : Command<DeleteTeamMemberResponse>
    {
        public string TeamId { get; set; }
        public string MemberId { get; set; }
    }

    public class DeleteTeamMemberResponse : Response { }

    public class ValidateTeamMemberCommand : Command<ValidateTeamMemberResponse>
    {
        public string UniqueUserName { get; set; }
    }

    public class ValidateTeamMemberResponse : Response
    {
        public bool UniqueUserName { get; set; }
    }

    public class AssignCommunitiesToTeamCommand : Command<AssignCommunitiesToTeamResponse>
    {
        public string TeamId { get; set; }
        public IEnumerable<string> Communities { get; set; }
    }

    public class AssignCommunitiesToTeamResponse : Response { }

    public class UnassignCommunitiesFromTeamCommand : Command<UnassignCommunitiesFromTeamResponse>
    {
        public string TeamId { get; set; }
        public IEnumerable<string> Communities { get; set; }
    }

    public class UnassignCommunitiesFromTeamResponse : Response { }

    public class Team
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<string> AssignedCommunities { get; set; }
    }

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

    public class CommunitiesAlreadyAssignedException : Exception
    {
        public CommunitiesAlreadyAssignedException(IEnumerable<string> communities)
        {
            Communities = communities;
        }

        public IEnumerable<string> Communities { get; }
    }

    public class UsernameAlreadyExistsException : Exception
    {
        public UsernameAlreadyExistsException(string userName)
        {
            UserName = userName;
        }

        public string UserName { get; }
    }
}
