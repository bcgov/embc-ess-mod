// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System;
using System.ComponentModel.DataAnnotations;
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
        private readonly IListsRepository listsRepository;

        public SubmissionDynamicsCustomActionHandler(CRMWebAPI api, ILogger<SubmissionDynamicsCustomActionHandler> logger, IListsRepository listsRepository)
        {
            this.api = api;
            this.logger = logger;
            this.listsRepository = listsRepository;
        }

        public async Task Handle(SubmissionSavedEvent evt)
        {
            var submissions = new[] { evt.Submission }
                .Select(async s => await ResolveEntitiesReferences(s))
                .Select(t => t.Result)
                .MapSubmissions(evt.ReferenceNumber);

            try
            {
                foreach (var submission in submissions)
                {
                    dynamic result = await api.ExecuteAction("era_SubmitUnauthInvoices", submission);

                    if (!result.submissionFlag)
                    {
                        throw new Exception($"era_SubmitUnauthInvoices call failed: {result.message}");
                    }
                }
            }
            catch (ValidationException e)
            {
                var validationError = new ValidationException($"Submission '{evt.ReferenceNumber}' validation errors: {e.Message}", null, evt.ReferenceNumber);
                throw validationError;
            }
            catch (AggregateException e)
            {
                var validationErrors = e.Flatten().InnerExceptions.Where(e => e is ValidationException).Cast<ValidationException>().Select(e => e.Message);
                if (validationErrors.Any())
                {
                    var aggregatedErrors = string.Join(';', validationErrors);
                    var validationError = new ValidationException($"Submission '{evt.ReferenceNumber}' validation errors: {aggregatedErrors}", null, evt.ReferenceNumber);
                    throw validationError;
                }
                throw;
            }
            catch (Exception e)
            {
                throw new Exception($"Failed to post submission '{evt.ReferenceNumber}' to Dynamics: {e.Message}", e);
            }
        }

        private async Task<Submission> ResolveEntitiesReferences(Submission submission)
        {
            var countries = (await listsRepository.GetCountriesAsync()).ToArray();
            var stateProvinces = (await listsRepository.GetStateProvincesAsync()).ToArray();
            var jurisdictions = (await listsRepository.GetJurisdictionsAsync()).ToArray();
            var supports = (await listsRepository.GetSupportsAsync()).ToArray();

            foreach (var supplierInformation in submission.Suppliers)
            {
                var cityCode = supplierInformation?.Address?.CityCode;
                if (cityCode != null)
                {
                    var jurisdiction = jurisdictions.SingleOrDefault(j => j.era_jurisdictionid.Equals(cityCode, StringComparison.OrdinalIgnoreCase));
                    if (jurisdiction == null) throw new ValidationException($"City code '{cityCode}' doesn't exists in Dynamics");
                    supplierInformation.Address.CityCode = jurisdiction.era_jurisdictionid;
                }

                var stateProvinceCode = supplierInformation?.Address?.StateProvinceCode;
                if (stateProvinceCode != null)
                {
                    var stateProvince = stateProvinces.SingleOrDefault(sp => sp.era_code.Equals(stateProvinceCode, StringComparison.OrdinalIgnoreCase));
                    if (stateProvince == null) throw new ValidationException($"StateProvinceCode '{stateProvinceCode}' doesn't exists in Dynamics");
                    supplierInformation.Address.StateProvinceCode = stateProvince.era_provinceterritoriesid;
                }

                var countryCode = supplierInformation?.Address?.CountryCode;
                if (countryCode != null)
                {
                    var country = countries.SingleOrDefault(c => c.era_countrycode.Equals(supplierInformation.Address?.CountryCode, StringComparison.OrdinalIgnoreCase));
                    if (country == null) throw new ValidationException($"CountryCode '{supplierInformation?.Address?.CountryCode}' doesn't exists in Dynamics");
                    supplierInformation.Address.CountryCode = country.era_countryid;
                }
            }

            foreach (var lineItem in submission.LineItems)
            {
                var support = supports.SingleOrDefault(s => s.era_name.Equals(lineItem?.SupportProvided, StringComparison.OrdinalIgnoreCase));
                if (support == null) throw new ValidationException($"in line item referral '{lineItem?.ReferralNumber}', SupportProvided '{lineItem?.SupportProvided}' is null or doesn't exists in Dynamics");
                lineItem.SupportProvided = support.era_supportid;
            }

            return submission;
        }
    }
}
