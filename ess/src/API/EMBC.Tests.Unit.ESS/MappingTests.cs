using AutoMapper;
using EMBC.ESS;
using Xunit;

namespace EMBC.Tests.Unit.ESS
{
    public class MappingTests
    {
        private readonly MapperConfiguration mapperConfig;
        private IMapper mapper => mapperConfig.CreateMapper();

        public MappingTests()
        {
            //var locationManager = A.Fake<ILocationManager>();
            //A.CallTo(() => locationManager.GetJurisdictions("CAN", "BC", null)).Returns(FakeGenerator.Jurisdictions);
            mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(Startup));
                //cfg.ConstructServicesUsing(t => t switch
                //{
                //    Type st when st == typeof(BcscCityConverter) => new BcscCityConverter(locationManager),
                //    Type st => Activator.CreateInstance(st),
                //    _ => null
                //});
            });
        }

        [Fact]
        public void ValidateAutoMapperMappings()
        {
            //mapperConfig.AssertConfigurationIsValid();
        }
    }
}
