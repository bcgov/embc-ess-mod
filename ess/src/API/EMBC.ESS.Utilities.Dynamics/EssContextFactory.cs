using Microsoft.Extensions.Options;
using Microsoft.OData.Client;
using Microsoft.OData.Extensions.Client;

namespace EMBC.ESS.Utilities.Dynamics
{
    public interface IEssContextFactory
    {
        EssContext Create();

        EssContext CreateReadOnly();
    }

    internal class EssContextFactory : IEssContextFactory
    {
        private readonly IODataClientFactory odataClientFactory;
        private readonly DynamicsOptions dynamicsOptions;

        public EssContextFactory(IODataClientFactory odataClientFactory, IOptions<DynamicsOptions> dynamicsOptions)
        {
            this.odataClientFactory = odataClientFactory;
            this.dynamicsOptions = dynamicsOptions.Value;
        }

        public EssContext Create() => Create(MergeOption.AppendOnly);

        public EssContext CreateReadOnly() => Create(MergeOption.NoTracking);

        private EssContext Create(MergeOption mergeOption)
        {
            var ctx = odataClientFactory.CreateClient<EssContext>(dynamicsOptions.DynamicsApiBaseUri, "dynamics");
            ctx.MergeOption = mergeOption;
            return ctx;
        }
    }
}
