using System.Collections.Generic;
using System.IO.Abstractions;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Suppliers.API.Utilities;

namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
    public class FileBasedCachedListsProvider : ICachedListsProvider
    {
        private readonly IFileSystem fileSystem;
        private readonly FileBasedCachedListsOptions options;
        private string path => options.CachePath;

        public FileBasedCachedListsProvider(IFileSystem fileSystem, FileBasedCachedListsOptions options)
        {
            this.fileSystem = fileSystem;
            this.options = options;
        }

        public async Task<IEnumerable<CountryEntity>> GetCountriesAsync()
        {
            return (await fileSystem.File.ReadAllLinesAsync(fileSystem.Path.Combine(path, "./countries.csv")))
             .ParseCsv((values, i) => new
             {
                 era_countryid = values[0],
                 era_countrycode = values[1],
                 era_isocountrycode = values[2],
                 era_name = values[3]
             }, quoteCharacter: '"')
             .Select(c => new CountryEntity
             {
                 era_name = c.era_name,
                 era_countrycode = c.era_countrycode,
                 era_countryid = c.era_countryid,
                 era_isocountrycode = c.era_isocountrycode
             });
        }

        public async Task<IEnumerable<JurisdictionEntity>> GetJurisdictionsAsync()
        {
            return (await fileSystem.File.ReadAllLinesAsync(fileSystem.Path.Combine(path, $"./jurisdictions.csv")))
                      .ParseCsv((values, i) => new
                      {
                          era_jurisdictionid = values[0],
                          era_jurisdictionname = values[1],
                          era_type = values[2],
                          _era_relatedprovincestate_value = values[3],
                      }, quoteCharacter: '"')
                      .Select(c => new JurisdictionEntity
                      {
                          era_jurisdictionid = c.era_jurisdictionid,
                          era_jurisdictionname = c.era_jurisdictionname,
                          era_type = c.era_type,
                          _era_relatedprovincestate_value = c._era_relatedprovincestate_value
                      });
        }

        //public async Task<IEnumerable<JurisdictionEntity>> GetJurisdictionsAsync(string stateProvinceId)
        //{
        //    return (await GetJurisdictionsAsync()).Where(j => j._era_relatedprovincestate_value == stateProvinceId);
        //}

        public async Task<IEnumerable<StateProvinceEntity>> GetStateProvincesAsync()
        {
            return (await fileSystem.File.ReadAllLinesAsync(fileSystem.Path.Combine(path, $"./stateprovinces.csv")))
                 .ParseCsv((values, i) => new
                 {
                     era_provinceterritoriesid = values[0],
                     era_code = values[1],
                     era_name = values[2],
                     _era_relatedcountry_value = values[3]
                 }, quoteCharacter: '"')
                 .Select(c => new StateProvinceEntity
                 {
                     era_name = c.era_name,
                     era_code = c.era_code,
                     era_provinceterritoriesid = c.era_provinceterritoriesid,
                     _era_relatedcountry_value = c._era_relatedcountry_value
                 });
        }

        //public async Task<IEnumerable<StateProvinceEntity>> GetStateProvincesAsync(string countryId)
        //{
        //    return (await GetStateProvincesAsync()).Where(sp => sp._era_relatedcountry_value == countryId);
        //}

        public async Task<IEnumerable<SupportEntity>> GetSupportsAsync()
        {
            return (await fileSystem.File.ReadAllLinesAsync(fileSystem.Path.Combine(path, "./supports.csv")))
                .ParseCsv((values, i) => new
                {
                    era_supportid = values[0],
                    era_name = values[1]
                }, quoteCharacter: '"')
                .Select(c => new SupportEntity { era_name = c.era_name, era_supportid = c.era_supportid });
        }

        //public async Task<IEnumerable> GetDistrictsAsync()
        //{
        //    await Task.CompletedTask;
        //    return Array.Empty<object>();
        //}

        //public async Task<IEnumerable> GetRegionsAsync()
        //{
        //    await Task.CompletedTask;
        //    return Array.Empty<object>();
        //}

        public async Task SetCountriesAsync(IEnumerable<CountryEntity> countries)
        {
            using var fs = fileSystem.File.CreateText(fileSystem.Path.Combine(path, "./countries.csv"));
            await countries.ToCsv(fs.BaseStream, '"');
            await fs.FlushAsync();
        }

        public async Task SetStateProvincesAsync(IEnumerable<StateProvinceEntity> stateProvinces)
        {
            using var fs = fileSystem.File.Create(fileSystem.Path.Combine(path, "./stateprovinces.csv"));
            await stateProvinces.ToCsv(fs, '"');
            await fs.FlushAsync();
        }

        public async Task SetJurisdictionsAsync(IEnumerable<JurisdictionEntity> jurisdictions)
        {
            using var fs = fileSystem.File.Create(fileSystem.Path.Combine(path, "./jurisdictions.csv"));
            await jurisdictions.ToCsv(fs, '"');
            await fs.FlushAsync();
        }

        public async Task SetSupportsAsync(IEnumerable<SupportEntity> supports)
        {
            using var fs = fileSystem.File.Create(fileSystem.Path.Combine(path, "./supports.csv"));
            await supports.ToCsv(fs, '"');
            await fs.FlushAsync();
        }
    }
}
