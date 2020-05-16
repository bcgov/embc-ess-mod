using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using Microsoft.Extensions.Configuration;
using Xrm.Tools.WebAPI;
using Xrm.Tools.WebAPI.Requests;

namespace EMBC.Suppliers.API.DynamicsModule.SubmissionModule
{
    public class SubmissionDynamicsCustomActionHandler
    {
        private readonly ITokenProvider authenticationHandler;
        private readonly string dynamicsApiEndpoint;

        public SubmissionDynamicsCustomActionHandler(ITokenProvider authenticationHandler, IConfiguration configuration)
        {
            this.authenticationHandler = authenticationHandler;
            dynamicsApiEndpoint = configuration.GetValue<string>("Dynamics:DynamicsApiEndpoint");
        }

        public async Task<string> Submit(Submission _)
        {
            var api = new CRMWebAPI(new CRMWebAPIConfig
            {
                APIUrl = dynamicsApiEndpoint,
                GetAccessToken = async (s) => await authenticationHandler.AcquireToken()
            });
            var result = await api.ExecuteAction("era_CreateSupplierContact", new
            {
                firstname = "first",
                lastname = "last",
                contactnumber = "number",
                email = "first.last"
            });

            return "OK";
        }
    }
}
