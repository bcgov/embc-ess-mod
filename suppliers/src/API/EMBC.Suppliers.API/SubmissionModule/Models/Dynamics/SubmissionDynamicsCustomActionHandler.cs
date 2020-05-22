using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Xrm.Tools.WebAPI;

namespace EMBC.Suppliers.API.SubmissionModule.Models.Dynamics
{
    public class SubmissionDynamicsCustomActionHandler : ISubmissionDynamicsCustomActionHandler
    {
        private readonly CRMWebAPI api;
        private readonly ILogger<SubmissionDynamicsCustomActionHandler> logger;
        private readonly ICachedListsProvider cachedListsProvider;

        public SubmissionDynamicsCustomActionHandler(CRMWebAPI api, ILogger<SubmissionDynamicsCustomActionHandler> logger, ICachedListsProvider cachedListsProvider)
        {
            this.api = api;
            this.logger = logger;
            this.cachedListsProvider = cachedListsProvider;
        }

        public async Task Handle(SubmissionSavedEvent evt)
        {
            var submission = new[] { evt.Submission }
                .Select(async s => await ResolveEntitiesReferences(s))
                .Select(t => t.Result)
                .MapSubmissions(evt.ReferenceNumber)
                .Single();

            logger.LogDebug(JsonConvert.SerializeObject(submission));

            dynamic result = await api.ExecuteAction("era_SubmitUnauthInvoices", submission);

            if (!result.submissionFlag)
            {
                throw new Exception($"era_SubmitUnauthInvoices call failed: {result.message}");
            }
        }

        private async Task<Submission> ResolveEntitiesReferences(Submission submission)
        {
            var countries = await cachedListsProvider.GetCountriesAsync();
            var stateProvinces = await cachedListsProvider.GetStateProvincesAsync();
            var jurisdictions = await cachedListsProvider.GetJurisdictionsAsync();
            var supports = await cachedListsProvider.GetSupportsAsync();

            foreach (var supplierInformation in submission.Suppliers)
            {
                if (supplierInformation.Address.CityCode != null)
                {
                    var jurisdiction = jurisdictions.SingleOrDefault(j => j.era_jurisdictionid.Equals(supplierInformation.Address.CityCode, StringComparison.OrdinalIgnoreCase));
                    supplierInformation.Address.CityCode = jurisdiction?.era_jurisdictionid;
                }
                if (supplierInformation.Address.StateProvinceCode != null)
                {
                    var stateProvince = stateProvinces.SingleOrDefault(sp => sp.era_code.Equals(supplierInformation.Address.StateProvinceCode, StringComparison.OrdinalIgnoreCase));
                    supplierInformation.Address.StateProvinceCode = stateProvince?.era_provinceterritoriesid;
                }
                if (supplierInformation.Address.CountryCode != null)
                {
                    var country = countries.SingleOrDefault(c => c.era_countrycode.Equals(supplierInformation.Address.CountryCode, StringComparison.OrdinalIgnoreCase));
                    supplierInformation.Address.CountryCode = country.era_countryid;
                }
            }

            foreach (var lineItem in submission.LineItems)
            {
                if (lineItem.SupportProvided != null)
                {
                    var support = supports.SingleOrDefault(s => s.era_name.Equals(lineItem.SupportProvided, StringComparison.OrdinalIgnoreCase));
                    lineItem.SupportProvided = support?.era_supportid;
                }
            }

            return submission;
        }
    }
}
