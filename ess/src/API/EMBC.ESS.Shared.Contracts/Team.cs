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

namespace EMBC.ESS.Shared.Contracts
{
    public class TeamMembersQuery : Query<TeamMembersQueryResponse>
    {
        public string TeamId { get; set; }
        public string MemberId { get; set; }
        public string UserName { get; set; }
        public bool IncludeActiveUsersOnly { get; set; } = true;
    }

    public class TeamMembersQueryResponse
    {
        public IEnumerable<TeamMember> TeamMembers { get; set; }
    }

    public class TeamsQuery : Query<TeamsQueryResponse>
    {
        public string TeamId { get; set; }
        public string CommunityCode { get; set; }
    }

    public class TeamsQueryResponse
    {
        public IEnumerable<Team> Teams { get; set; }
    }

    public class SaveTeamMemberCommand : Command
    {
        public TeamMember Member { get; set; }
    }

    public class DeactivateTeamMemberCommand : Command
    {
        public string TeamId { get; set; }
        public string MemberId { get; set; }
    }

    public class ActivateTeamMemberCommand : Command
    {
        public string TeamId { get; set; }
        public string MemberId { get; set; }
    }

    public class DeleteTeamMemberCommand : Command
    {
        public string TeamId { get; set; }
        public string MemberId { get; set; }
    }

    public class ValidateTeamMemberCommand : Query<ValidateTeamMemberResponse>
    {
        public TeamMember TeamMember { get; set; }
    }

    public class ValidateTeamMemberResponse
    {
        public bool UniqueUserName { get; set; }
    }

    public class AssignCommunitiesToTeamCommand : Command
    {
        public string TeamId { get; set; }
        public IEnumerable<string> Communities { get; set; }
    }

    public class UnassignCommunitiesFromTeamCommand : Command
    {
        public string TeamId { get; set; }
        public IEnumerable<string> Communities { get; set; }
    }

    public class Team
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<AssignedCommunity> AssignedCommunities { get; set; }
    }

    public class AssignedCommunity
    {
        public string Code { get; set; }
        public DateTime DateAssigned { get; set; }
    }

    public class TeamMember
    {
        public string Id { get; set; }

        public string TeamId { get; set; }

        public string TeamName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string UserName { get; set; }

        public string ExternalUserId { get; set; }

        public string Role { get; set; }

        public string Label { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public DateTime? AgreementSignDate { get; set; }

        public DateTime? LastSuccessfulLogin { get; set; }

        public bool IsActive { get; set; }
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
