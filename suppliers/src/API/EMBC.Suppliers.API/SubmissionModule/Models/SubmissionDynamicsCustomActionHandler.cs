using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Xrm.Tools.WebAPI;
using Xrm.Tools.WebAPI.Requests;

namespace EMBC.Suppliers.API.DynamicsModule.SubmissionModule
{
    public class SubmissionDynamicsCustomActionHandler : ISubmissionDynamicsCustomActionHandler
    {
        private readonly ITokenProvider authenticationHandler;
        private readonly string dynamicsApiEndpoint;

        public SubmissionDynamicsCustomActionHandler(ITokenProvider authenticationHandler, IConfiguration configuration)
        {
            this.authenticationHandler = authenticationHandler;
            dynamicsApiEndpoint = configuration.GetValue<string>("Dynamics:DynamicsApiEndpoint");
        }

        public async Task<string> Submit(string referenceNumber)
        {
            var api = new CRMWebAPI(new CRMWebAPIConfig
            {
                APIUrl = dynamicsApiEndpoint,
                GetAccessToken = async (s) => await authenticationHandler.AcquireToken()
            });
            var result = await api.ExecuteAction("era_CreateSupplierContact", new
            {
                firstname = $"first_{referenceNumber}",
                lastname = $"last_{referenceNumber}",
                contactnumber = $"number_{referenceNumber}",
                email = $"email_{referenceNumber}"
            });

            return "OK";
        }
    }
}
