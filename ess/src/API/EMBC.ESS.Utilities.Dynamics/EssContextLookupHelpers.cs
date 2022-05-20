using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Utilities.Dynamics
{
    public static class EssContextLookupHelpers
    {
        public static era_provinceterritories? LookupStateProvinceByCode(this EssContext context, string code)
        {
            if (string.IsNullOrEmpty(code)) return null;
            return context.era_provinceterritories_cached.Value.Where(p => p.era_code == code).SingleOrDefault();
        }

        public static era_country? LookupCountryByCode(this EssContext context, string code)
        {
            if (string.IsNullOrEmpty(code)) return null;
            return context.era_countries_cached.Value.Where(p => p.era_countrycode == code).SingleOrDefault();
        }

        public static era_jurisdiction? LookupJurisdictionByCode(this EssContext context, string code)
        {
            if (string.IsNullOrEmpty(code) || !Guid.TryParse(code, out var parsedCode)) return null;
            return context.era_jurisdictions_cached.Value.Where(p => p.era_jurisdictionid == parsedCode).SingleOrDefault();
        }

        public static async Task<systemuser> GetCurrentSystemUser(this EssContext ctx)
        {
            var currentUserId = (await ctx.WhoAmI().GetValueAsync()).UserId;
            return await ctx.systemusers.Where(su => su.systemuserid == currentUserId).SingleOrDefaultAsync();
        }
    }
}
