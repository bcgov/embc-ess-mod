using System;
using System.Threading.Tasks;
using EMBC.ESS.Managers.Metadata;
using EMBC.ESS.Shared.Contracts.Metadata;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Metadata
{
    public class MetadataTests : WebAppTestBase
    {
        public MetadataTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetCountries()
        {
            var metadataManager = base.services.GetRequiredService<MetadataManager>();

            var reply = await metadataManager.Handle(new CountriesQuery());

            reply.ShouldNotBeNull().Items.ShouldNotBeEmpty();
            reply.Items.ShouldAllBe(c => c.Code != null && c.Name != null);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetStateProvinces()
        {
            var metadataManager = base.services.GetRequiredService<MetadataManager>();

            var reply = await metadataManager.Handle(new StateProvincesQuery());

            reply.ShouldNotBeNull().Items.ShouldNotBeEmpty();
            reply.Items.ShouldAllBe(c => c.Code != null && c.Name != null && c.CountryCode != null);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetCommunities()
        {
            var metadataManager = base.services.GetRequiredService<MetadataManager>();

            var reply = await metadataManager.Handle(new CommunitiesQuery());

            reply.ShouldNotBeNull().Items.ShouldNotBeEmpty();
            reply.Items.ShouldAllBe(c => c.Code != null && c.Name != null && c.CountryCode != null);
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetSecurityQuestions()
        {
            var metadataManager = base.services.GetRequiredService<MetadataManager>();

            var reply = await metadataManager.Handle(new SecurityQuestionsQuery());

            reply.ShouldNotBeNull().Items.ShouldNotBeEmpty();
            reply.Items.ShouldAllBe(c => !string.IsNullOrEmpty(c));
        }
    }
}
