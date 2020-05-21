using System.Threading;
using System.Threading.Tasks;
using Jasper;
using Microsoft.Extensions.Hosting;

namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
    public class ConfigurationServiceWorker : BackgroundService
    {
        private readonly ICommandBus commandBus;

        public ConfigurationServiceWorker(ICommandBus commandBus)
        {
            this.commandBus = commandBus;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await commandBus.Invoke(new RefreshCacheCommand());
        }
    }
}
