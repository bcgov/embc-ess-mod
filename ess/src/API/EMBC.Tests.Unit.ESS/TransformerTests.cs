using System.Collections.Generic;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Utilities.Transformation;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Unit.ESS
{
    public class TransformerTests : WebAppTestBase
    {
        public TransformerTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
        }

        [Fact]
        public void CanCreateTokenTransformatorFromFactory()
        {
            var factory = services.GetRequiredService<ITransformatorFactory>();

            factory.CreateFor(TransformationType.TokensTemplates).GetType().ShouldBe(typeof(SuperSimpleTransformator));
        }

        [Fact]
        public void CanCreateHandlebarsTransformatorFromFactory()
        {
            var factory = services.GetRequiredService<ITransformatorFactory>();

            factory.CreateFor(TransformationType.HandlbarsTemplates).GetType().ShouldBe(typeof(HbsTransformator));
        }

        [Fact]
        public async Task CanTransformTokenTemplate()
        {
            var factory = services.GetRequiredService<ITransformatorFactory>();

            var transformator = factory.CreateFor(TransformationType.TokensTemplates);

            var template = "Test transform {value}";

            var transformed = await transformator.Transform(new TransformationData
            {
                Template = template,
                Tokens = new Dictionary<string, string>() { { "value", "actual value" } }
            });

            transformed.Content.ShouldBe("Test transform actual value");
        }

        [Fact]
        public async Task CanTransformHandlebarsTemplate()
        {
            var factory = services.GetRequiredService<ITransformatorFactory>();

            var transformator = factory.CreateFor(TransformationType.HandlbarsTemplates);

            var template = "Test transform {{value}}";

            var transformed = await transformator.Transform(new TransformationData
            {
                Template = template,
                Tokens = new Dictionary<string, string>() { { "value", "actual value" } }
            });

            transformed.Content.ShouldBe("Test transform actual value");
        }
    }
}
