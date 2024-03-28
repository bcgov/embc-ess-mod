using AutoMapper;
using EMBC.Responders.API;
using Xunit;

namespace EMBC.Tests.Unit.Responders.API
{
    public class MappingTests
    {
        private readonly MapperConfiguration mapperConfig;

        public MappingTests()
        {
            mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(Configuration));
            });
        }

        [Fact]
        public void ValidateAutoMapperMappings()
        {
            mapperConfig.AssertConfigurationIsValid();
        }
    }
}
