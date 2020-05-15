using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Suppliers.API.ConfigurationModule.ViewModels;

namespace EMBC.Suppliers.API.ConfigurationModule.Models
{
    public class CsvLoader :
        ICountriesListProvider,
        IStateProvincesListProvider,
        IRegionsListProvider,
        ICommunitiesListProvider
    {
        private static string PathToCsvFiles = "./Configuration/Models/Data";

        public async Task<IEnumerable<Community>> GetCommunitiesAsync(string stateProvinceCode, string countryCode)
        {
            await Task.CompletedTask;
            return File.ReadLines(Path.Combine(PathToCsvFiles, $"./communities_{stateProvinceCode}_{countryCode}.csv".ToLowerInvariant()))
                .ParseCsv((values, i) => new
                {
                    Name = values[0],
                    Active = bool.Parse(values[1]),
                    Region = values[2]
                })
                .Where(c => c.Active)
                .Select(c => new Community { Code = c.Name, Name = c.Name, Region = c.Region, CountryCode = countryCode, ProvinceCode = stateProvinceCode });
        }

        public async Task<IEnumerable<Country>> GetCountriesAsync()
        {
            await Task.CompletedTask;
            return File.ReadLines(Path.Combine(PathToCsvFiles, "./countries.csv"))
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
            await Task.CompletedTask;
            return File.ReadLines(Path.Combine(PathToCsvFiles, $"./provinces_{countryCode}.csv".ToLowerInvariant()))
                .ParseCsv((values, i) => new
                {
                    Code = values[0],
                    Name = values[1],
                    Active = bool.Parse(values[2]),
                }, quoteCharacter: '"')
                .Where(c => c.Active)
                .Select(c => new StateProvince { Code = c.Code, Name = c.Name, CountryCode = countryCode });
        }

        public async Task<IEnumerable<Region>> GetRegionsAsync(string stateProviceCode, string countryCode)
        {
            await Task.CompletedTask;
            return File.ReadLines(Path.Combine(PathToCsvFiles, $"./regions_{stateProviceCode}_{countryCode}.csv".ToLowerInvariant()))
                .ParseCsv((values, i) => new
                {
                    Name = values[0],
                    Active = bool.Parse(values[1])
                }, quoteCharacter: '"')
                .Where(c => c.Active)
                .Select(c => new Region { Name = c.Name, ProvinceCode = stateProviceCode, CountryCode = countryCode });
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
