using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Teams
{
    public interface ITeamRepository
    {
        Task<IEnumerable<TeamMember>> GetMembers(string teamId = null, string userName = null, string userId = null, TeamMemberStatus[] includeStatuses = null);

        Task<string> SaveMember(TeamMember teamMember);

        Task<string> SaveTeam(Team team);

        Task<bool> DeleteMember(string teamId, string teamMemberId);

        Task<TeamQueryResponse> QueryTeams(TeamQuery query);
    }

    public class TeamQuery
    {
        public string Id { get; set; }
        public string AssignedCommunityCode { get; set; }
    }

    public class TeamQueryResponse
    {
        public IEnumerable<Team> Items { get; set; }
    }

    public class Team
    {
        public string? Id { get; set; }
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
        public string? Id { get; set; }

        public string TeamId { get; set; }
        public string TeamName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string UserName { get; set; }

        public string Role { get; set; }
        public string Label { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public DateTime? AgreementSignDate { get; set; }

        public DateTime? LastSuccessfulLogin { get; set; }
        public bool IsActive { get; set; }
        public string ExternalUserId { get; set; }
    }

    public interface IUserRepository
    {
        Task<UserQueryResponse> Query(UserQuery query);
    }

    public class UserQuery
    {
        public string ByBceidUserId { get; set; }
    }

    public class UserQueryResponse
    {
        public IEnumerable<User> Items { get; set; } = Array.Empty<User>();
    }

    public class User
    {
        public string Id { get; set; }
        public string OrgId { get; set; }
    }
}
