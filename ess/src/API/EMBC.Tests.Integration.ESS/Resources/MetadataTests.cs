using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Resources.Metadata;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class MetadataTests : WebAppTestBase
    {
        private readonly IMetadataRepository metadataRepository;

        public MetadataTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            metadataRepository = services.GetRequiredService<IMetadataRepository>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetPlannedOutage()
        {
            var reply = await metadataRepository.GetPlannedOutage(new OutageQuery { PortalType = (PortalType)TestData.TestPortal, DisplayDate = TestData.OutageDate });
            reply.ShouldNotBeNull();
        }
    }
}
