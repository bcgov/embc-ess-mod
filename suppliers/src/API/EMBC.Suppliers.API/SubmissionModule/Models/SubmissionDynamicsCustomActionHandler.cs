using System;
using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.Models;
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

        public async Task<string> Handle(SubmissionSavedEvent evt)
        {
            if (evt == null) throw new ArgumentNullException(nameof(evt));
            var referenceNumber = evt.ReferenceNumber;
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
