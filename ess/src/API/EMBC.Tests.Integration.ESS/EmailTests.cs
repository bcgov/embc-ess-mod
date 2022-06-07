using System.Threading.Tasks;
using EMBC.ESS.Managers.Events.Notifications;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS
{
    public class EmailTests : WebAppTestBase
    {
        public EmailTests(ITestOutputHelper output, WebAppTestFixture fixture) : base(output, fixture)
        {
        }

        [Fact]
        public async Task CanGenerateAndSendEmail()
        {
            var templateProvider = Services.GetRequiredService<ITemplateProvider>();
            var template = await templateProvider.Get(SubmissionTemplateType.NewProfileRegistration);
            template.ShouldNotBeNull();
        }
    }
}
