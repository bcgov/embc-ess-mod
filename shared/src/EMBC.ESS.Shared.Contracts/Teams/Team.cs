using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace EMBC.ESS.Shared.Contracts.Teams
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

    [Serializable]
    public class CommunitiesAlreadyAssignedException : BusinessValidationException
    {
        public CommunitiesAlreadyAssignedException(string message) : base(message)
        {
        }

        public CommunitiesAlreadyAssignedException(IEnumerable<string> communities) : base("Communities are already assigned to another team")
        {
            Communities = communities;
        }

        public IEnumerable<string> Communities { get; } = Array.Empty<string>();

        protected CommunitiesAlreadyAssignedException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }

    [Serializable]
    public class UsernameAlreadyExistsException : BusinessValidationException
    {
        public UsernameAlreadyExistsException(string message) : base(message)
        {
            UserName = message;
        }

        public string UserName { get; }

        protected UsernameAlreadyExistsException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
