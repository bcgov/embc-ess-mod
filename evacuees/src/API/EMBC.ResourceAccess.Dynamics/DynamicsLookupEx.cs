using System;
using System.Linq;
using Microsoft.Dynamics.CRM;

namespace EMBC.ResourceAccess.Dynamics
{
    public static class DynamicsLookupEx
    {
        public static era_provinceterritories LookupStateProvinceByCode(this DynamicsClientContext dynamicsClient, string code)
        {
            if (string.IsNullOrEmpty(code)) return null;
            return dynamicsClient.era_provinceterritorieses
                .Expand(sp => sp.era_RelatedCountry)
                .Where(p => p.era_code == code)
                .FirstOrDefault();
        }

        public static era_country LookupCountryByCode(this DynamicsClientContext dynamicsClient, string code)
        {
            if (string.IsNullOrEmpty(code)) return null;
            return dynamicsClient.era_countries.Where(p => p.era_countrycode == code).FirstOrDefault();
        }

        public static era_jurisdiction LookupJurisdictionByCode(this DynamicsClientContext dynamicsClient, string code)
        {
            if (string.IsNullOrEmpty(code) || !Guid.TryParse(code, out var jurisdictionCode)) return null;
            var jurisdiction = dynamicsClient.era_jurisdictions
                .Expand(j => j.era_RelatedProvinceState)
                .Where(p => p.era_jurisdictionid == jurisdictionCode)
                .FirstOrDefault();

            if (jurisdiction == null) return null;

            if (jurisdiction.era_RelatedProvinceState == null)
                dynamicsClient.LoadProperty(jurisdiction, nameof(era_jurisdiction.era_RelatedProvinceState));
            if (jurisdiction.era_RelatedProvinceState.era_RelatedCountry == null)
                dynamicsClient.LoadProperty(jurisdiction.era_RelatedProvinceState, nameof(era_provinceterritories.era_RelatedCountry));

            return jurisdiction;
        }
    }
}
