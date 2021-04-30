using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Resources.Cases;
using EMBC.ESS.Resources.Cases.Evacuations;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Resources.Team;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class EvacuationTests : WebAppTestBase
    {
        private readonly ICaseRepository caseRepository;
        private const string TestUserId = "CHRIS-TEST";

        public EvacuationTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            caseRepository = services.GetRequiredService<ICaseRepository>();
        }

        [Fact(Skip = RequiresDynamics)]
        public async Task CanGetEvacuations()
        {
            var caseQuery = new QueryEvacuationFile
            {
                ById = TestUserId
            };
            var queryResult = await caseRepository.QueryCase(caseQuery);

            queryResult.Items.ShouldNotBeEmpty();

            var evacuationFile = queryResult.Items.First();
            evacuationFile.ShouldNotBeNull();
        }
    }
}
