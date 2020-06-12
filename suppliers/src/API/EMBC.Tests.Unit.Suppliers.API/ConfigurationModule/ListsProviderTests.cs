using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.Models;
using EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics;
using Moq;
using Xunit;

namespace EMBC.Tests.Unit.Suppliers.API.ConfigurationModule
{
    public class ListsProviderTests
    {
        [Fact]
        public async Task GetCountriesList_AllActiveCountries()
        {
            IEnumerable<CountryEntity> countries = new[]
            {
                new CountryEntity{era_countrycode = "c1", era_name = "c1", era_countryid = "1", era_isocountrycode = "c1"},
                new CountryEntity{era_countrycode = "c2", era_name = "c2", era_countryid = "2", era_isocountrycode = "c2"},
                new CountryEntity{era_countrycode = "c3", era_name = "c3", era_countryid = "3", era_isocountrycode = "c3"}
            };
            var mockedCachedListProvider = new Mock<ICachedListsProvider>();
            mockedCachedListProvider.Setup(m => m.GetCountriesAsync()).Returns(Task.FromResult(countries));
            var provider = new ListsProvider(mockedCachedListProvider.Object);

            var result = await provider.GetCountriesAsync();
            Assert.Equal(countries.Count(), result.Count());
        }

        [Fact]
        public async Task GetCountriesList_SortedAlphabetically()
        {
            IEnumerable<CountryEntity> countries = new[]
            {
                new CountryEntity{era_countrycode = "c1", era_name = "c_c", era_countryid = "1", era_isocountrycode = "c1"},
                new CountryEntity{era_countrycode = "c2", era_name = "c_a", era_countryid = "2", era_isocountrycode = "c2"},
                new CountryEntity{era_countrycode = "c3", era_name = "c_b", era_countryid = "3", era_isocountrycode = "c3"}
            };
            var mockedCachedListProvider = new Mock<ICachedListsProvider>();
            mockedCachedListProvider.Setup(m => m.GetCountriesAsync()).Returns(Task.FromResult(countries));
            var provider = new ListsProvider(mockedCachedListProvider.Object);

            var result = await provider.GetCountriesAsync();
            Assert.Equal(countries.Select(c => c.era_name).OrderBy(c => c), result.Select(c => c.Name));
        }
    }
}
