using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;
using EMBC.Utilities.Configuration;

namespace EMBC.Utilities.Hosting
{
    public class HostVersionInformationProvider : IVersionInformationProvider
    {
        public async Task<IEnumerable<VersionInformation>> Get()
        {
            await Task.CompletedTask;
            var name = Assembly.GetEntryAssembly()?.GetName().Name;
            var version = Environment.GetEnvironmentVariable("VERSION");
            return new[]
            {
                new VersionInformation { Name = name ?? null!, Version = version == null ? null : Version.Parse(version) }
            };
        }
    }
}
