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
            return dynamicsClient.era_provinceterritorieses.Where(p => p.era_code == code).FirstOrDefault();
        }

        public static era_country LookupCountryByCode(this DynamicsClientContext dynamicsClient, string code)
        {
            if (string.IsNullOrEmpty(code)) return null;
            return dynamicsClient.era_countries.Where(p => p.era_countrycode == code).FirstOrDefault();
        }

        public static era_jurisdiction LookupJurisdictionByCode(this DynamicsClientContext dynamicsClient, string code)
        {
            if (string.IsNullOrEmpty(code)) return null;
            return dynamicsClient.era_jurisdictions.Where(p => p.era_jurisdictionid == Guid.Parse(code)).FirstOrDefault();
        }
    }
}
