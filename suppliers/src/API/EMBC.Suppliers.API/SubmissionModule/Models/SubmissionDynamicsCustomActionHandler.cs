using System.Threading.Tasks;
using Xrm.Tools.WebAPI;

namespace EMBC.Suppliers.API.DynamicsModule.SubmissionModule
{
    public class SubmissionDynamicsCustomActionHandler : ISubmissionDynamicsCustomActionHandler
    {
        private readonly CRMWebAPI api;

        public SubmissionDynamicsCustomActionHandler(CRMWebAPI api)
        {
            this.api = api;
        }

        public async Task<string> Submit(string referenceNumber)
        {
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
