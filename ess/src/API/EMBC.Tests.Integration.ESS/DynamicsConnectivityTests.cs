﻿using EMBC.ESS.Utilities.Dynamics;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS
{
    public class DynamicsConnectivityTests : WebAppTestBase
    {
        public DynamicsConnectivityTests(ITestOutputHelper output, WebAppTestFixture fixture) : base(output, fixture)
        {
        }

        [Fact]
        public async Task GetSecurityToken()
        {
            var tokenProvider = Services.GetRequiredService<ISecurityTokenProvider>();
            var token = await tokenProvider.AcquireToken();
            token.ShouldNotBeNullOrEmpty();
            output.WriteLine("Authorization: Bearer {0}", token);
        }

        [Fact]
        public async Task CanConnectToDynamics()
        {
            var context = Services.GetRequiredService<EssContext>();
            await Should.NotThrowAsync(async () => await context.era_countries.GetAllPagesAsync());
        }
    }
}
