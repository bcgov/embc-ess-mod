using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using EMBC.Utilities.Caching;
using Microsoft.OData.Client;

namespace EMBC.ESS.Resources.Payments
{
    public interface ICasSystemConfigurationProvider
    {
        Task<CasSystemConfiguration> Get(CancellationToken ct);
    }

    public class CasSystemConfiguration
    {
        public string DefaultDistributionAccount { get; set; }
        public string InvoiceType { get; set; }
        public string InvoiceRemittanceCode { get; set; }
        public string InvoiceSpecialHandling { get; set; }
        public string PayGroup { get; set; }
        public string InvoiceLineType { get; set; }
        public string InvoiceLineCode { get; set; }
        public string InvoiceTerms { get; set; }
        public string CurrencyCode { get; set; }
        public string ProviderId { get; set; }
    }

    internal class CasSystemConfigurationProvider : ICasSystemConfigurationProvider
    {
        private readonly IEssContextFactory essContextFactory;
        private readonly ICache cache;
        private const string cacheKey = nameof(CasSystemConfiguration);

        public CasSystemConfigurationProvider(IEssContextFactory essContextFactory, ICache cache)
        {
            this.essContextFactory = essContextFactory;
            this.cache = cache;
        }

        public async Task<CasSystemConfiguration> Get(CancellationToken ct)
        {
            return await cache.GetOrSet(cacheKey, () => GetFromDynamics(ct), TimeSpan.FromMinutes(60), ct);
        }

        private async Task<CasSystemConfiguration> GetFromDynamics(CancellationToken ct)
        {
            var ctx = essContextFactory.CreateReadOnly();
            var configValues = (await ((DataServiceQuery<era_systemconfig>)ctx.era_systemconfigs.Where(sc => sc.era_group == "eTransfer")).GetAllPagesAsync(ct)).ToArray();

            return new CasSystemConfiguration
            {
                CurrencyCode = configValues.SingleOrDefault(cv => cv.era_key.Equals("Currency Code", StringComparison.OrdinalIgnoreCase))?.era_value ?? "CAD",
                DefaultDistributionAccount = configValues.SingleOrDefault(cv => cv.era_key.Equals("Default Distribution Account", StringComparison.OrdinalIgnoreCase))?.era_securevalue,
                InvoiceType = configValues.SingleOrDefault(cv => cv.era_key.Equals("Invoice Type", StringComparison.OrdinalIgnoreCase))?.era_value ?? "Standard",
                InvoiceLineCode = configValues.SingleOrDefault(cv => cv.era_key.Equals("Line Code", StringComparison.OrdinalIgnoreCase))?.era_value ?? "DR",
                InvoiceTerms = configValues.SingleOrDefault(cv => cv.era_key.Equals("Terms", StringComparison.OrdinalIgnoreCase))?.era_value ?? "IMMEDIATE",
                InvoiceLineType = configValues.SingleOrDefault(cv => cv.era_key.Equals("Type", StringComparison.OrdinalIgnoreCase))?.era_value ?? "Item",
                PayGroup = configValues.SingleOrDefault(cv => cv.era_key.Equals("Pay Group", StringComparison.OrdinalIgnoreCase))?.era_value ?? "EMB IN",
                InvoiceRemittanceCode = configValues.SingleOrDefault(cv => cv.era_key.Equals("Remittance Code", StringComparison.OrdinalIgnoreCase))?.era_value ?? "01",
                InvoiceSpecialHandling = configValues.SingleOrDefault(cv => cv.era_key.Equals("Special Handling", StringComparison.OrdinalIgnoreCase))?.era_value ?? "N",
                ProviderId = configValues.SingleOrDefault(cv => cv.era_key.Equals("Provider ID", StringComparison.OrdinalIgnoreCase))?.era_value ?? "CAS_SU_AT_ESS"
            };
        }
    }
}
