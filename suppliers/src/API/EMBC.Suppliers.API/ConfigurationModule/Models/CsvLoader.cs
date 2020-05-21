using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;

namespace EMBC.Suppliers.API.ConfigurationModule.Models
{
    public class CsvLoader :
        ICountriesListProvider,
        IStateProvincesListProvider,
        IRegionsListProvider,
        ICommunitiesListProvider,
        IJurisdictionsListProvider,
        IDistrictsListProvider
    {
        public CsvLoader(IFileSystem fileSystem)
        {
            this.fileSystem = fileSystem;
        }

        private static string PathToCsvFiles = "./ConfigurationModule/Models/Data";
        private readonly IFileSystem fileSystem;

        public async Task<IEnumerable<Jurisdiction>> GetJurisdictionsAsync(string[] types, string stateProvinceCode, string countryCode)
        {
            return (await fileSystem.File.ReadAllLinesAsync(fileSystem.Path.Combine(PathToCsvFiles, $"./jurisdictions_{stateProvinceCode}_{countryCode}.csv".ToLowerInvariant())))
                .ParseCsv((values, i) => new
                {
                    Code = values[0],
                    Name = values[1],
                    Type = values[2],
                    District = values[3],
                    Active = bool.Parse(values[4]),
                })
                .Where(c => c.Active && (!types.Any() || types.Any(t => t.Equals(c.Type, StringComparison.OrdinalIgnoreCase))))
                .Select(c => new Jurisdiction { Code = c.Code, Name = c.Name, Type = c.Type, DistrictCode = c.District, CountryCode = countryCode, StateProvinceCode = stateProvinceCode });
        }

        public async Task<IEnumerable<Community>> GetCommunitiesAsync(string stateProvinceCode, string countryCode)
        {
            return (await fileSystem.File.ReadAllLinesAsync(fileSystem.Path.Combine(PathToCsvFiles, $"./communities_{stateProvinceCode}_{countryCode}.csv".ToLowerInvariant())))
                .ParseCsv((values, i) => new
                {
                    Name = values[0],
                    Active = bool.Parse(values[1]),
                    RegionCode = values[2]
                })
                .Where(c => c.Active)
                .Select(c => new Community { Code = c.Name, Name = c.Name, RegionCode = c.RegionCode, CountryCode = countryCode, StateProvinceCode = stateProvinceCode });
        }

        public async Task<IEnumerable<Country>> GetCountriesAsync()
        {
            return (await fileSystem.File.ReadAllLinesAsync(fileSystem.Path.Combine(PathToCsvFiles, "./countries.csv")))
                .ParseCsv((values, i) => new
                {
                    Name = values[0],
                    Active = bool.Parse(values[1]),
                    Code = values[2],
                    IsoCode = values[3]
                }, quoteCharacter: '"')
                .Where(c => c.Active)
                .Select(c => new Country { Code = c.Code, Name = c.Name });
        }

        public async Task<IEnumerable<StateProvince>> GetStateProvincesAsync(string countryCode)
        {
            return (await fileSystem.File.ReadAllLinesAsync(fileSystem.Path.Combine(PathToCsvFiles, $"./stateprovinces_{countryCode}.csv".ToLowerInvariant())))
                .ParseCsv((values, i) => new
                {
                    Code = values[0],
                    Name = values[1],
                    Active = bool.Parse(values[2]),
                }, quoteCharacter: '"')
                .Where(c => c.Active)
                .Select(c => new StateProvince { Code = c.Code, Name = c.Name, CountryCode = countryCode });
        }

        public async Task<IEnumerable<Region>> GetRegionsAsync(string stateProvinceCode, string countryCode)
        {
            return (await fileSystem.File.ReadAllLinesAsync(fileSystem.Path.Combine(PathToCsvFiles, $"./regions_{stateProvinceCode}_{countryCode}.csv".ToLowerInvariant())))
                .ParseCsv((values, i) => new
                {
                    Code = values[0],
                    Name = values[0],
                    Active = bool.Parse(values[1])
                }, quoteCharacter: '"')
                .Where(c => c.Active)
                .Select(c => new Region { Code = c.Code, Name = c.Name, StateProvinceCode = stateProvinceCode, CountryCode = countryCode });
        }

        public async Task<IEnumerable<District>> GetDistrictsAsync(string stateProvinceCode, string countryCode)
        {
            return (await fileSystem.File.ReadAllLinesAsync(fileSystem.Path.Combine(PathToCsvFiles, $"./districts_{stateProvinceCode}_{countryCode}.csv".ToLowerInvariant())))
                .ParseCsv((values, i) => new
                {
                    Code = values[0],
                    Region = values[1],
                    Active = bool.Parse(values[2])
                })
                .Where(c => c.Active)
                .Select(c => new District { Code = c.Code, Name = c.Code, RegionCode = c.Region, StateProvinceCode = stateProvinceCode, CountryCode = countryCode });
        }
    }

    public static class CsvParser
    {
        public static IEnumerable<T> ParseCsv<T>(this IEnumerable<string> lines, Func<string[], int, T> map, string delimiter = ",", bool firstLineIsHeader = true, char? quoteCharacter = null)
        {
            var firstLine = firstLineIsHeader ? 1 : 0;
            if (quoteCharacter.HasValue) delimiter = quoteCharacter + delimiter + quoteCharacter;

            return lines
                .Skip(firstLine)
                .Where(l => !string.IsNullOrWhiteSpace(l))
                .Select(l => quoteCharacter.HasValue ? l[1..^1] : l)
                .Select((l, seq) => map(l.Split(delimiter), seq));
        }
    }
}
