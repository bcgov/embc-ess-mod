﻿using System;
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
            var reply = await metadataRepository.GetPlannedOutages(new OutageQuery { PortalType = PortalType.Suppliers, DisplayDate = DateTime.UtcNow });

            var outage = reply.ShouldHaveSingleItem();
            outage.OutageStartDate.ShouldBe(DateTime.Parse("2022/1/1T17:30:00Z").ToUniversalTime());
            outage.OutageEndDate.ShouldBe(DateTime.Parse("2024/1/1T06:30:00Z").ToUniversalTime());
            outage.Content.ShouldBe("autotest-suppliers-outage-donotdelete");
        }
    }
}
