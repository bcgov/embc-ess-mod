using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Utilities.Configuration;

namespace EMBC.ESS.Utilities.Dynamics
{
    public class DynamicSchemasVersionInformationProvider : IVersionInformationProvider
    {
        private readonly IEssContextFactory essContextFactory;

        public DynamicSchemasVersionInformationProvider(IEssContextFactory essContextFactory)
        {
            this.essContextFactory = essContextFactory;
        }

        public async Task<IEnumerable<VersionInformation>> Get()
        {
            await Task.CompletedTask;
            string? version = null;
            try
            {
                var ctx = essContextFactory.CreateReadOnly();
                version = ctx.solutions.Where(s => s.isvisible == true && s.uniquename == "ERAEntitySolution").FirstOrDefault()?.version;
            }
            catch (Exception)
            {
            }

            return new[]
            {
                new VersionInformation { Name = "Dynamics:ERAEntitySolution", Version = version == null ? null : Version.Parse(version) }
            };
        }
    }
}
