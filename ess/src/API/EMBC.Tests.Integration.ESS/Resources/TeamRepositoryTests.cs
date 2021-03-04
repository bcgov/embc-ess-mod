using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Resources.Team;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class TeamRepositoryTests : WebAppTestBase
    {
        private readonly ITeamRepository teamRepository;

        public TeamRepositoryTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            teamRepository = services.GetRequiredService<ITeamRepository>();
        }

        [Fact]
        public async Task CanGetTeam()
        {
            var teamId = "3f132f42-b74f-eb11-b822-00505683fbf4";

            var team = await teamRepository.GetTeam(teamId);
            team.ShouldNotBeNull();
            team.Name.ShouldNotBeNull();
            team.AssignedCommunitiesIds.ShouldNotBeEmpty();
        }

        [Fact]
        public async Task CanSaveTeam()
        {
            var metaDataRepository = services.GetRequiredService<IMetadataRepository>();
            var teamId = "3f132f42-b74f-eb11-b822-00505683fbf4";

            var team = await teamRepository.GetTeam(teamId);

            team.AssignedCommunitiesIds = (await metaDataRepository.GetCommunities()).Take(10).Select(c => c.Code);

            var updatedTeamId = await teamRepository.SaveTeam(team);

            var updatedTeam = await teamRepository.GetTeam(updatedTeamId);
            updatedTeam.AssignedCommunitiesIds.OrderBy(c => c).ShouldBe(team.AssignedCommunitiesIds.OrderBy(c => c));
        }
    }
}
