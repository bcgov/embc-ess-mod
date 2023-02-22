using EMBC.ESS.Utilities.Dynamics;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS
{
    public class DynamicsWebAppFixture : WebAppTestFixture
    {
        public DynamicsTestData TestData { get; }

        public DynamicsWebAppFixture()
        {
            this.TestData = new DynamicsTestData(Services.CreateScope().ServiceProvider.GetRequiredService<IEssContextFactory>());
        }
    }

    [CollectionDefinition("DynamicsFixture")]
    public class WebAppTestCollection : ICollectionFixture<DynamicsWebAppFixture>
    {
    }

    [Collection("DynamicsFixture")]
    public abstract class DynamicsWebAppTestBase : WebAppTestBase
    {
        public DynamicsTestData TestData { get; }

        protected DynamicsWebAppTestBase(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            this.TestData = fixture.TestData;
        }
    }
}
