using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Teams
{
    public class TeamRepository : ITeamRepository
    {
        private readonly IEssContextFactory essContextFactory;
        private readonly IMapper mapper;

        //private const int DynamicsActiveStatus = 1;
        private const int DynamicsInactiveStatus = 2;

        private CancellationToken GetCancellationToken() => new CancellationTokenSource().Token;

        public TeamRepository(IEssContextFactory essContextFactory, IMapper mapper)
        {
            this.essContextFactory = essContextFactory;
            this.mapper = mapper;
        }

        public async Task<TeamQueryResponse> QueryTeams(TeamQuery query)
        {
            var ct = GetCancellationToken();
            var context = essContextFactory.CreateReadOnly();
            var teams = (await QueryTeams(context, query, ct)).Concat(await QueryTeamAreas(context, query, ct)).ToArray();

            await Parallel.ForEachAsync(teams, ct, async (team, ct) =>
            {
                context.AttachTo(nameof(EssContext.era_essteams), team);
                await context.LoadPropertyAsync(team, nameof(era_essteam.era_ESSTeam_ESSTeamArea_ESSTeamID), ct);
                await context.LoadPropertyAsync(team, nameof(era_essteam.era_essteamuser_ESSTeamId), ct);
            });

            return new TeamQueryResponse { Items = mapper.Map<IEnumerable<Team>>(teams) };
        }

        private static async Task<IEnumerable<era_essteam>> QueryTeams(EssContext ctx, TeamQuery query, CancellationToken ct)
        {
            if (!string.IsNullOrEmpty(query.AssignedCommunityCode)) return Array.Empty<era_essteam>();

            var teamsQuery = ctx.era_essteams
                .Expand(t => t.era_ESSTeam_ESSTeamArea_ESSTeamID)
                .Where(t => t.statecode == (int)EntityState.Active);

            if (!string.IsNullOrEmpty(query.Id)) teamsQuery = teamsQuery.Where(t => t.era_essteamid == Guid.Parse(query.Id));

            return await teamsQuery.GetAllPagesAsync(ct);
        }

        private static async Task<IEnumerable<era_essteam>> QueryTeamAreas(EssContext ctx, TeamQuery query, CancellationToken ct)
        {
            if (string.IsNullOrEmpty(query.AssignedCommunityCode)) return Array.Empty<era_essteam>();

            var teamAreas = await ctx.era_essteamareas
                .Expand(ta => ta.era_ESSTeamID)
                .Where(ta => ta._era_jurisdictionid_value == Guid.Parse(query.AssignedCommunityCode) && ta.statecode == (int)EntityState.Active)
                .GetAllPagesAsync(ct);

            return teamAreas.Select(ta => ta.era_ESSTeamID).Where(t => t.statecode == (int)EntityState.Active).ToArray();
        }

        public async Task<IEnumerable<TeamMember>> GetMembers(string teamId = null, string userName = null, string userId = null, TeamMemberStatus[] includeStatuses = null)
        {
            var ct = GetCancellationToken();
            var context = essContextFactory.CreateReadOnly();

            var query = EssTeamUsers(context);

            if (!string.IsNullOrEmpty(teamId)) query = query.Where(u => u._era_essteamid_value == Guid.Parse(teamId));
            if (!string.IsNullOrEmpty(userName)) query = query.Where(u => u.era_externalsystemusername.Equals(userName, StringComparison.OrdinalIgnoreCase));
            if (!string.IsNullOrEmpty(userId)) query = query.Where(u => u.era_essteamuserid == Guid.Parse(userId));

            var users = await query.GetAllPagesAsync(ct);

            if (includeStatuses != null && includeStatuses.Any()) users = users.Where(u => includeStatuses.Any(s => (int)s == u.statuscode)).ToArray();

            return mapper.Map<IEnumerable<TeamMember>>(users);
        }

        public async Task<string> SaveMember(TeamMember teamMember)
        {
            var ct = GetCancellationToken();
            var context = essContextFactory.Create();

            var essTeam = EssTeam(context, Guid.Parse(teamMember.TeamId));
            if (essTeam == null || essTeam.statuscode == DynamicsInactiveStatus) throw new ArgumentException($"team {teamMember.TeamId} not found");

            var essTeamUser = mapper.Map<era_essteamuser>(teamMember);

            var existingMember = essTeamUser.era_essteamuserid.HasValue ? await context.era_essteamusers
                    .Where(u => u._era_essteamid_value == Guid.Parse(teamMember.TeamId) && u.era_essteamuserid == essTeamUser.era_essteamuserid.Value)
                    .SingleOrDefaultAsync(ct)
                    : null;

            context.DetachAll();

            if (existingMember == null)
            {
                essTeamUser.era_essteamuserid = Guid.NewGuid();
                context.AddToera_essteamusers(essTeamUser);
            }
            else
            {
                context.AttachTo(nameof(EssContext.era_essteamusers), essTeamUser);
            }

            if (teamMember.IsActive)
            {
                context.ActivateObject(essTeamUser, (int)TeamMemberStatus.Active);
            }
            else
            {
                context.ActivateObject(essTeamUser, (int)TeamMemberStatus.Inactive);
            }

            context.UpdateObject(essTeamUser);
            context.AttachTo(nameof(EssContext.era_essteams), essTeam);
            context.AddLink(essTeam, nameof(era_essteam.era_essteamuser_ESSTeamId), essTeamUser);
            await context.SaveChangesAsync(ct);

            context.DetachAll();

            return essTeamUser.era_essteamuserid.Value.ToString();
        }

        public async Task<string> SaveTeam(Team team)
        {
            var ct = GetCancellationToken();
            var context = essContextFactory.Create();

            if (string.IsNullOrEmpty(team.Id)) throw new ArgumentException($"Team ID cannot be empty", nameof(team.Id));
            var essTeam = EssTeam(context, Guid.Parse(team.Id));
            if (essTeam == null) throw new ArgumentException($"Team {team.Id} not found");

            await context.LoadPropertyAsync(essTeam, nameof(era_essteam.era_ESSTeam_ESSTeamArea_ESSTeamID), ct);

            //delete assigned communities not in updated list
            foreach (var community in essTeam.era_ESSTeam_ESSTeamArea_ESSTeamID.Where(ta => !team.AssignedCommunities.Any(c => c.Code == ta._era_jurisdictionid_value.ToString())))
            {
                context.DeleteObject(community);
            }

            //add newly assigned communities
            foreach (var community in team.AssignedCommunities.Where(c => !essTeam.era_ESSTeam_ESSTeamArea_ESSTeamID.Any(ta => ta._era_jurisdictionid_value.ToString() == c.Code)))
            {
                var teamArea = new era_essteamarea
                {
                    era_essteamareaid = Guid.NewGuid(),
                    era_ESSTeamID = essTeam
                };
                context.AddToera_essteamareas(teamArea);
                context.AddLink(essTeam, nameof(essTeam.era_ESSTeam_ESSTeamArea_ESSTeamID), teamArea);
                var jurisdiction = new era_jurisdiction { era_jurisdictionid = Guid.Parse(community.Code) };
                context.AttachTo(nameof(context.era_jurisdictions), jurisdiction);
                context.SetLink(teamArea, nameof(era_essteamarea.era_JurisdictionID), jurisdiction);
            }

            await context.SaveChangesAsync(ct);

            context.DetachAll();

            return team.Id;
        }

        public async Task<bool> DeleteMember(string teamId, string teamMemberId)
        {
            var ct = GetCancellationToken();
            var context = essContextFactory.Create();

            var member = EssTeamUsers(context)
                .Where(u => u._era_essteamid_value == Guid.Parse(teamId) && u.era_essteamuserid == Guid.Parse(teamMemberId))
                .SingleOrDefault();

            if (member == null) return false;

            context.DeactivateObject(member, (int)TeamMemberStatus.SoftDelete);

            await context.SaveChangesAsync(ct);
            context.DetachAll();
            return true;
        }

        private static era_essteam EssTeam(EssContext context, Guid id) =>
            context.era_essteams
            .Where(t => t.era_essteamid == id && t.statecode == (int)EntityState.Active)
            .SingleOrDefault();

        private static IQueryable<era_essteamuser> EssTeamUsers(EssContext context) =>
            context.era_essteamusers
                .Expand(u => u.era_ESSTeamId)
                .Where(u => u.statuscode != (int)TeamMemberStatus.SoftDelete);
    }
}
