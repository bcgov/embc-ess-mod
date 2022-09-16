using EMBC.ESS.Resources.Teams;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class UserRepositoryTests : DynamicsWebAppTestBase
    {
        private readonly IUserRepository userRepository;

        public UserRepositoryTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            userRepository = Services.GetRequiredService<IUserRepository>();
        }

        [Fact(Skip = "Requires configured http context with user information")]
        public async Task CanGetBusinessBceidInformationByUserId()
        {
            var userIdToSearch = "ess.developerA1";
            var expectedUserGuid = "9643CB00EDBD4A7AA93C87B4AFA674A5";

            var user = (await userRepository.Query(new UserQuery
            {
                ByBceidUserId = userIdToSearch,
            })).Items.ShouldHaveSingleItem();
            user.Id.ShouldBe(expectedUserGuid);
            user.OrgId.ShouldNotBeNull();
        }

        [Fact(Skip = "Requires configured http context with user information")]
        public async Task CanGetBasicBceidInformationByUserId()
        {
            var userIdToSearch = "embc-rp";
            var expectedUserGuid = "79913F95D20E4AACA7D377C47C63ED31";

            var user = (await userRepository.Query(new UserQuery
            {
                ByBceidUserId = userIdToSearch,
            })).Items.ShouldHaveSingleItem();
            user.Id.ShouldBe(expectedUserGuid);
            user.OrgId.ShouldBeNull();
        }
    }
}
