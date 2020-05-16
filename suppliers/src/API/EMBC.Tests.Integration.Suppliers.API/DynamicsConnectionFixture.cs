using System.Threading.Tasks;
using EMBC.Suppliers.API;
using EMBC.Suppliers.API.DynamicsModule;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Xrm.Tools.WebAPI;
using Xrm.Tools.WebAPI.Requests;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Suppliers.API
{
    public class DynamicsConnectionFixture : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly ITestOutputHelper output;
        private readonly WebApplicationFactory<Startup> webApplicationFactory;
        private IConfiguration configuration => webApplicationFactory.Services.GetRequiredService<IConfiguration>();

        public DynamicsConnectionFixture(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory)
        {
            this.output = output;
            this.webApplicationFactory = webApplicationFactory;
        }

        private async Task<string> GetToken()
        {
            var authHandler = webApplicationFactory.Services.GetRequiredService<ITokenProvider>();
            return await authHandler.AcquireToken();
        }

        [Fact(Skip = "Integration tests")]
        public async Task CanQuery()
        {
            var dynamicsOdataUri = configuration.GetValue<string>("Dynamics:DynamicsApiEndpoint");
            var api = new CRMWebAPI(new CRMWebAPIConfig
            {
                APIUrl = dynamicsOdataUri,
                GetAccessToken = async (s) => await GetToken()
            });
            var result = await api.GetList("era_supports");
            Assert.True(result.List.Count > 0);
        }

        [Fact(Skip = "Integration tests")]
        public async Task CanPost()
        {
            var dynamicsOdataUri = configuration.GetValue<string>("Dynamics:DynamicsApiEndpoint");
            var api = new CRMWebAPI(new CRMWebAPIConfig
            {
                APIUrl = dynamicsOdataUri,
                GetAccessToken = async (s) => await GetToken()
            });
            var result = await api.ExecuteAction("era_CreateSupplierContact", new
            {
                firstname = "first",
                lastname = "last",
                contactnumber = "number",
                email = "first.last"
            });
            Assert.NotNull(result);
        }
    }
}
