using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;

namespace EMBC.ESS.Engines.Supporting.SupportCompliance
{
    internal class AmountExceededSupportComplianceCheck : ISupportComplianceCheck
    {
        public async Task<IEnumerable<SupportFlag>> CheckCompliance(Support support)
        {
            await Task.CompletedTask;
            var approverName = support switch
            {
                ClothingSupport s => s.ApproverName,
                IncidentalsSupport s => s.ApproverName,
                FoodGroceriesSupport s => s.ApproverName,

                _ => null
            };

            if (!string.IsNullOrEmpty(approverName)) return new[] { new AmountExceededSupportFlag { Approver = approverName } };
            return Array.Empty<SupportFlag>();
        }
    }
}
