using AutoMapper;
using Xunit;

namespace EMBC.Tests.Unit.ESS
{
    public class MappingTests
    {
        private readonly MapperConfiguration mapperConfig;
        private IMapper mapper => mapperConfig.CreateMapper();

        public MappingTests()
        {
            mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps("EMBC.ESS");
            });
        }

        [Fact]
        public void ValidateAutoMapperMappings()
        {
            mapperConfig.AssertConfigurationIsValid();
        }
    }
}
