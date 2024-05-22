using System;
using System.Globalization;
using EMBC.ESS.Resources.Metadata;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class MetadataTests : DynamicsWebAppTestBase
    {
        private readonly IMetadataRepository metadataRepository;

        public MetadataTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            metadataRepository = Services.GetRequiredService<IMetadataRepository>();
        }

        [Fact]
        public async Task CanGetPlannedOutages()
        {
            var reply = await metadataRepository.GetPlannedOutages(new OutageQuery { PortalType = PortalType.Suppliers, DisplayDate = DateTime.UtcNow });

            var outage = reply.ShouldHaveSingleItem();
            outage.OutageStartDate.ShouldBe(DateTime.Parse("2022/1/1T17:45:00Z", CultureInfo.InvariantCulture).ToUniversalTime());
            outage.OutageEndDate.ShouldBe(DateTime.Parse("2025/12/31T06:30:00Z", CultureInfo.InvariantCulture).ToUniversalTime());
            outage.Content.ShouldBe("autotest-suppliers-outage-donotdelete");
        }

        [Fact]
        public async Task CanQuerySecurityQuestions()
        {
            var values = await metadataRepository.GetSecurityQuestions();
            values.ShouldNotBeEmpty();
        }

        [Fact]
        public async Task CanQueryAccessReasons()
        {
            var values = await metadataRepository.GetAuditAccessReasons();
            values.ShouldNotBeEmpty();
        }

        [Fact]
        public async Task CanQueryCommunities()
        {
            var values = await metadataRepository.GetCommunities();
            values.ShouldNotBeEmpty();
        }
    }
}
