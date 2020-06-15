using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.Models;
using EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;
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
            var mockedListsRepo = new Mock<IListsRepository>();
            mockedListsRepo.Setup(m => m.GetCountriesAsync()).Returns(Task.FromResult(countries));
            var provider = new ListsProvider(mockedListsRepo.Object);

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
            var mockedListsRepo = new Mock<IListsRepository>();
            mockedListsRepo.Setup(m => m.GetCountriesAsync()).Returns(Task.FromResult(countries));
            var provider = new ListsProvider(mockedListsRepo.Object);

            var result = await provider.GetCountriesAsync();
            Assert.Equal(countries.Select(c => c.era_name).OrderBy(c => c), result.Select(c => c.Name));
        }

        [Fact]
        public async Task GetStateProvincesList_AllActiveCountries()
        {
            var country = new CountryEntity { era_countrycode = "c1", era_name = "c_c", era_countryid = "1", era_isocountrycode = "c1" };
            IEnumerable<StateProvinceEntity> stateProvinces = new[]
            {
                new StateProvinceEntity { era_code = "s1", era_name = "s2", era_provinceterritoriesid = "1", _era_relatedcountry_value = country.era_countryid },
                new StateProvinceEntity { era_code = "s1", era_name = "s2", era_provinceterritoriesid = "2", _era_relatedcountry_value = country.era_countryid },
                new StateProvinceEntity { era_code = "s1", era_name = "s2", era_provinceterritoriesid = "3", _era_relatedcountry_value = country.era_countryid },
               };
            var mockedListsRepo = new Mock<IListsRepository>();
            mockedListsRepo.Setup(m => m.GetCountriesAsync()).Returns(Task.FromResult(new[] { country }.AsEnumerable()));
            mockedListsRepo.Setup(m => m.GetStateProvincesAsync()).Returns(Task.FromResult(stateProvinces));
            var provider = new ListsProvider(mockedListsRepo.Object);

            var result = await provider.GetStateProvincesAsync(country.era_isocountrycode);
            Assert.Equal(stateProvinces.Count(), result.Count());
        }

        [Fact]
        public async Task GetStateProvincesList_SortedAlphabetically()
        {
            var country = new CountryEntity { era_countrycode = "c1", era_name = "c_c", era_countryid = "1", era_isocountrycode = "c1" };
            IEnumerable<StateProvinceEntity> stateProvinces = new[]
            {
                new StateProvinceEntity { era_code = "s1", era_name = "s_a", era_provinceterritoriesid = "1", _era_relatedcountry_value = country.era_countryid },
                new StateProvinceEntity { era_code = "s1", era_name = "s_c", era_provinceterritoriesid = "2", _era_relatedcountry_value = country.era_countryid },
                new StateProvinceEntity { era_code = "s1", era_name = "s_b", era_provinceterritoriesid = "3", _era_relatedcountry_value = country.era_countryid },
               };
            var mockedListsRepo = new Mock<IListsRepository>();
            mockedListsRepo.Setup(m => m.GetCountriesAsync()).Returns(Task.FromResult(new[] { country }.AsEnumerable()));
            mockedListsRepo.Setup(m => m.GetStateProvincesAsync()).Returns(Task.FromResult(stateProvinces));
            var provider = new ListsProvider(mockedListsRepo.Object);

            var result = await provider.GetStateProvincesAsync(country.era_isocountrycode);
            Assert.Equal(stateProvinces.Select(c => c.era_name).OrderBy(c => c), result.Select(c => c.Name));
        }

        [Fact]
        public async Task GetJurisdictionsList_AllActiveJurisdictionInCountryAndStateProvince()
        {
            var country1 = new CountryEntity { era_countrycode = "c1", era_name = "c_1", era_countryid = "1", era_isocountrycode = "c1" };
            var stateProvince1_1 = new StateProvinceEntity { era_code = "s1", era_name = "s_a", era_provinceterritoriesid = "1", _era_relatedcountry_value = country1.era_countryid };
            var stateProvince1_2 = new StateProvinceEntity { era_code = "s2", era_name = "s_b", era_provinceterritoriesid = "2", _era_relatedcountry_value = country1.era_countryid };
            var country2 = new CountryEntity { era_countrycode = "c2", era_name = "c_2", era_countryid = "2", era_isocountrycode = "c2" };
            var stateProvince2_1 = new StateProvinceEntity { era_code = "s1", era_name = "s_a", era_provinceterritoriesid = "3", _era_relatedcountry_value = country2.era_countryid };
            IEnumerable<JurisdictionEntity> jurisdictions = new[]
            {
                new JurisdictionEntity{ era_jurisdictionid = "1", era_jurisdictionname = "j1", era_type = JurisdictionType.City.GetHashCode().ToString(), _era_relatedprovincestate_value = stateProvince1_1.era_provinceterritoriesid },
                new JurisdictionEntity{ era_jurisdictionid = "2", era_jurisdictionname = "j2", era_type = JurisdictionType.District.GetHashCode().ToString(), _era_relatedprovincestate_value = stateProvince1_1.era_provinceterritoriesid },
                new JurisdictionEntity{ era_jurisdictionid = "3", era_jurisdictionname = "j3", era_type = JurisdictionType.DistrictMunicipality.GetHashCode().ToString(), _era_relatedprovincestate_value = stateProvince1_1.era_provinceterritoriesid },
                new JurisdictionEntity{ era_jurisdictionid = "4", era_jurisdictionname = "j4", era_type = JurisdictionType.City.GetHashCode().ToString(), _era_relatedprovincestate_value = stateProvince1_1.era_provinceterritoriesid },
                new JurisdictionEntity{ era_jurisdictionid = "5", era_jurisdictionname = "j5", era_type = JurisdictionType.City.GetHashCode().ToString(), _era_relatedprovincestate_value = stateProvince2_1.era_provinceterritoriesid },
            };
            var mockedListsRepo = new Mock<IListsRepository>();
            mockedListsRepo.Setup(m => m.GetCountriesAsync()).Returns(Task.FromResult(new[] { country1, country2 }.AsEnumerable()));
            mockedListsRepo.Setup(m => m.GetStateProvincesAsync()).Returns(Task.FromResult(new[] { stateProvince1_1, stateProvince1_2, stateProvince2_1 }.AsEnumerable()));
            mockedListsRepo.Setup(m => m.GetJurisdictionsAsync()).Returns(Task.FromResult(jurisdictions));
            var provider = new ListsProvider(mockedListsRepo.Object);

            var result = await provider.GetJurisdictionsAsync(null, stateProvince1_1.era_code, country1.era_countrycode);
            Assert.Equal(jurisdictions.Count(j => j._era_relatedprovincestate_value == stateProvince1_1.era_provinceterritoriesid), result.Count());
        }

        [Fact]
        public async Task GetJurisdictionsList_SortedAlphabetically()
        {
            var country = new CountryEntity { era_countrycode = "c1", era_name = "c_c", era_countryid = "1", era_isocountrycode = "c1" };
            var stateProvince = new StateProvinceEntity { era_code = "s1", era_name = "s_a", era_provinceterritoriesid = "1_1", _era_relatedcountry_value = country.era_countryid };
            IEnumerable<JurisdictionEntity> jurisdictions = new[]
            {
                new JurisdictionEntity{ era_jurisdictionid = "1", era_jurisdictionname = "j2", era_type = JurisdictionType.City.GetHashCode().ToString(), _era_relatedprovincestate_value = stateProvince.era_provinceterritoriesid },
                new JurisdictionEntity{ era_jurisdictionid = "2", era_jurisdictionname = "j3", era_type = JurisdictionType.District.GetHashCode().ToString(), _era_relatedprovincestate_value = stateProvince.era_provinceterritoriesid },
                new JurisdictionEntity{ era_jurisdictionid = "3", era_jurisdictionname = "j1", era_type = JurisdictionType.DistrictMunicipality.GetHashCode().ToString(), _era_relatedprovincestate_value = stateProvince.era_provinceterritoriesid },
              };
            var mockedListsRepo = new Mock<IListsRepository>();
            mockedListsRepo.Setup(m => m.GetCountriesAsync()).Returns(Task.FromResult(new[] { country }.AsEnumerable()));
            mockedListsRepo.Setup(m => m.GetStateProvincesAsync()).Returns(Task.FromResult(new[] { stateProvince }.AsEnumerable()));
            mockedListsRepo.Setup(m => m.GetJurisdictionsAsync()).Returns(Task.FromResult(jurisdictions));
            var provider = new ListsProvider(mockedListsRepo.Object);

            var result = await provider.GetJurisdictionsAsync(null, stateProvince.era_code, country.era_countrycode);
            Assert.Equal(jurisdictions.Select(c => c.era_jurisdictionname).OrderBy(c => c), result.Select(c => c.Name));
        }

        [Fact]
        public async Task GetJurisdictionsList_FilterBySingleType_JurisdictionsOfType()
        {
            var country = new CountryEntity { era_countrycode = "c1", era_name = "c_c", era_countryid = "1", era_isocountrycode = "c1" };
            var stateProvince = new StateProvinceEntity { era_code = "s1", era_name = "s_a", era_provinceterritoriesid = "1_1", _era_relatedcountry_value = country.era_countryid };
            IEnumerable<JurisdictionEntity> jurisdictions = new[]
            {
                new JurisdictionEntity{ era_jurisdictionid = "j1", era_jurisdictionname = "j2", era_type = JurisdictionType.City.GetHashCode().ToString(), _era_relatedprovincestate_value = stateProvince.era_provinceterritoriesid },
                new JurisdictionEntity{ era_jurisdictionid = "j2", era_jurisdictionname = "j3", era_type = JurisdictionType.District.GetHashCode().ToString(), _era_relatedprovincestate_value = stateProvince.era_provinceterritoriesid },
                new JurisdictionEntity{ era_jurisdictionid = "j3", era_jurisdictionname = "j1", era_type = JurisdictionType.DistrictMunicipality.GetHashCode().ToString(), _era_relatedprovincestate_value = stateProvince.era_provinceterritoriesid },
              };
            var mockedListsRepo = new Mock<IListsRepository>();
            mockedListsRepo.Setup(m => m.GetCountriesAsync()).Returns(Task.FromResult(new[] { country }.AsEnumerable()));
            mockedListsRepo.Setup(m => m.GetStateProvincesAsync()).Returns(Task.FromResult(new[] { stateProvince }.AsEnumerable()));
            mockedListsRepo.Setup(m => m.GetJurisdictionsAsync()).Returns(Task.FromResult(jurisdictions));
            var provider = new ListsProvider(mockedListsRepo.Object);

            var result = await provider.GetJurisdictionsAsync(new[] { JurisdictionType.City }, stateProvince.era_code, country.era_countrycode);
            Assert.Single(result);
        }

        [Fact]
        public async Task GetJurisdictionsList_FilterByMultipleTypes_JurisdictionsOfTypes()
        {
            var country = new CountryEntity { era_countrycode = "c1", era_name = "c_c", era_countryid = "1", era_isocountrycode = "c1" };
            var stateProvince = new StateProvinceEntity { era_code = "s1", era_name = "s_a", era_provinceterritoriesid = "1_1", _era_relatedcountry_value = country.era_countryid };
            IEnumerable<JurisdictionEntity> jurisdictions = new[]
            {
                new JurisdictionEntity{ era_jurisdictionid = "j1", era_jurisdictionname = "j2", era_type = JurisdictionType.City.GetHashCode().ToString(), _era_relatedprovincestate_value = stateProvince.era_provinceterritoriesid },
                new JurisdictionEntity{ era_jurisdictionid = "j2", era_jurisdictionname = "j3", era_type = JurisdictionType.District.GetHashCode().ToString(), _era_relatedprovincestate_value = stateProvince.era_provinceterritoriesid },
                new JurisdictionEntity{ era_jurisdictionid = "j3", era_jurisdictionname = "j1", era_type = JurisdictionType.DistrictMunicipality.GetHashCode().ToString(), _era_relatedprovincestate_value = stateProvince.era_provinceterritoriesid },
              };
            var mockedListsRepo = new Mock<IListsRepository>();
            mockedListsRepo.Setup(m => m.GetCountriesAsync()).Returns(Task.FromResult(new[] { country }.AsEnumerable()));
            mockedListsRepo.Setup(m => m.GetStateProvincesAsync()).Returns(Task.FromResult(new[] { stateProvince }.AsEnumerable()));
            mockedListsRepo.Setup(m => m.GetJurisdictionsAsync()).Returns(Task.FromResult(jurisdictions));
            var provider = new ListsProvider(mockedListsRepo.Object);

            var result = await provider.GetJurisdictionsAsync(new[] { JurisdictionType.City, JurisdictionType.District }, stateProvince.era_code, country.era_countrycode);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetSupportsList_AllActiveSupports()
        {
            IEnumerable<SupportEntity> supports = new[]
            {
                new SupportEntity{ era_supportid = "1", era_name = "s1" },
                new SupportEntity{ era_supportid = "2", era_name = "s2" },
                new SupportEntity{ era_supportid = "3", era_name = "s3" }
            };
            var mockedListsRepo = new Mock<IListsRepository>();
            mockedListsRepo.Setup(m => m.GetSupportsAsync()).Returns(Task.FromResult(supports));
            var provider = new ListsProvider(mockedListsRepo.Object);

            var result = await provider.GetSupportsAsync();
            Assert.Equal(supports.Count(), result.Count());
        }

        [Fact]
        public async Task GetSupportsList_SortedAlphabetically()
        {
            IEnumerable<SupportEntity> supports = new[]
              {
                new SupportEntity{ era_supportid = "2", era_name = "s2" },
                new SupportEntity{ era_supportid = "1", era_name = "s1" },
                new SupportEntity{ era_supportid = "3", era_name = "s3" }
            };
            var mockedListsRepo = new Mock<IListsRepository>();
            mockedListsRepo.Setup(m => m.GetSupportsAsync()).Returns(Task.FromResult(supports));
            var provider = new ListsProvider(mockedListsRepo.Object);

            var result = await provider.GetSupportsAsync();
            Assert.Equal(supports.Select(s => s.era_name).OrderBy(c => c), result.Select(s => s.Name));
        }
    }
}
