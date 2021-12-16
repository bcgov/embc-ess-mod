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
    public class MetadataTests : DynamicsWebAppTestBase
    {
        private readonly IMetadataRepository metadataRepository;

        public MetadataTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            metadataRepository = Services.GetRequiredService<IMetadataRepository>();
        }

        [Fact(Skip = RequiresVpnConnectivity)]
        public async Task CanGetPlannedOutages()
        {
            var reply = await metadataRepository.GetPlannedOutages(new OutageQuery { PortalType = (PortalType)TestData.TestPortal, DisplayDate = TestData.OutageDate });

            reply.ShouldNotBeEmpty();
        }
    }
}
