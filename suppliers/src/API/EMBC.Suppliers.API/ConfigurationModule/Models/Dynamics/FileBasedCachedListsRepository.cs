// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.IO.Abstractions;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Suppliers.API.Utilities;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;

namespace EMBC.Suppliers.API.ConfigurationModule.Models.Dynamics
{
    public class FileBasedCachedListsRepository : IListsRepository
    {
        private readonly IFileSystem fileSystem;
        private readonly IDistributedCache cache;
        private readonly FileBasedCachedListsOptions options;
        private string path => options.CachePath;
        private const string sourceCsvFolder = "./ConfigurationModule/Models/Data";

        public FileBasedCachedListsRepository(IFileSystem fileSystem, IDistributedCache cache, IOptions<FileBasedCachedListsOptions> options)
        {
            this.fileSystem = fileSystem;
            this.cache = cache;
            this.options = options.Value;
            if (!fileSystem.Directory.Exists(this.options.CachePath)) fileSystem.Directory.CreateDirectory(this.options.CachePath);
            foreach (var file in fileSystem.Directory.GetFiles(sourceCsvFolder, "*.csv"))
            {
                var destFile = fileSystem.Path.Combine(this.options.CachePath, fileSystem.Path.GetFileName(file));
                if (!fileSystem.File.Exists(destFile)) fileSystem.File.Copy(file, destFile);
            }
        }

        private async Task<string[]> GetOrAddAsync(string sourceFileName)
        {
            var cache_key = $"lists_{sourceFileName}";
            var cachedContent = await cache.GetStringAsync(cache_key);
            if (cachedContent == null)
            {
                cachedContent = await fileSystem.File.ReadAllTextAsync(fileSystem.Path.Combine(path, sourceFileName));
                await cache.SetStringAsync(cache_key, cachedContent, new DistributedCacheEntryOptions { AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(71) });
            }
            return cachedContent.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.RemoveEmptyEntries);
        }

        public async Task<IEnumerable<CountryEntity>> GetCountriesAsync()
        {
            return (await GetOrAddAsync("./countries.csv"))
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
            return (await GetOrAddAsync("./jurisdictions.csv"))
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

        public async Task<IEnumerable<StateProvinceEntity>> GetStateProvincesAsync()
        {
            return (await GetOrAddAsync("./stateprovinces.csv"))
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

        public async Task<IEnumerable<SupportEntity>> GetSupportsAsync()
        {
            return (await GetOrAddAsync("./supports.csv"))
                .ParseCsv((values, i) => new
                {
                    era_supportid = values[0],
                    era_name = values[1]
                }, quoteCharacter: '"')
                .Select(c => new SupportEntity { era_name = c.era_name, era_supportid = c.era_supportid });
        }

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
