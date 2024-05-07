using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Extensions;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.ESS.Engines.Supporting.SupportCompliance
{
    public interface ISupportComplianceStrategy
    {
        Task<CheckSupportComplianceResponse> CheckCompliance(CheckSupportComplianceRequest request, CancellationToken ct = default);
    }

    internal interface ISupportComplianceCheck
    {
        Task<IEnumerable<SupportFlag>> CheckCompliance(Support support, CancellationToken ct);
    }

    internal class SupportComplianceStrategyFactory
    {
        private readonly IServiceProvider services;

        public SupportComplianceStrategyFactory(IServiceProvider services)
        {
            this.services = services;
        }

        public ISupportComplianceStrategy Create() => new SupportComplianceStrategy(services.GetServices<ISupportComplianceCheck>().ToArray());
    }

    internal class SupportComplianceStrategy : ISupportComplianceStrategy
    {
        private readonly ISupportComplianceCheck[] strategies;

        public SupportComplianceStrategy(params ISupportComplianceCheck[] strategies)
        {
            this.strategies = strategies;
        }

        private Task<IEnumerable<SupportFlag>> CheckCompliance(Support support, CancellationToken ct) => strategies.SelectManyAsync(s => s.CheckCompliance(support, ct));

        public async Task<CheckSupportComplianceResponse> CheckCompliance(CheckSupportComplianceRequest request, CancellationToken ct = default)
        {
            var flags = new Dictionary<Support, IEnumerable<SupportFlag>>();
            foreach (var support in request.Supports)
            {
                flags.Add(support, await CheckCompliance(support, ct));
            }
            return new CheckSupportComplianceResponse
            {
                Flags = flags
            };
        }
    }
}
