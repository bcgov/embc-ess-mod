// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
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

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Location;
using EMBC.Registrants.API.Utils;

namespace EMBC.Registrants.API.Services
{
    public interface IAddressService
    {
        Task<IEnumerable<Shared.Jurisdiction>> GetCommunities(string countryCode = null, string stateProvinceCode = null, Shared.JurisdictionType[] types = null);

        Task<IEnumerable<Shared.StateProvince>> GetStateProvinces(string countryCode = null);

        Task<IEnumerable<Shared.Country>> GetCountries();
    }

    public class AddressService : IAddressService
    {
        private readonly IMapper mapper;
        private readonly IMessagingClient client;

        public AddressService(IMapper mapper, IMessagingClient client)
        {
            this.mapper = mapper;
            this.client = client;
        }

        public async Task<IEnumerable<Shared.Jurisdiction>> GetCommunities(string countryCode = null, string stateProvinceCode = null, Shared.JurisdictionType[] types = null)
        {
            var items = (await client.Send(new CommunitiesQueryCommand()
            {
                CountryCode = countryCode,
                StateProvinceCode = stateProvinceCode,
                Types = types.Select(t => (CommunityType)t)
            })).Items;

            return mapper.Map<IEnumerable<Shared.Jurisdiction>>(items);
        }

        public async Task<IEnumerable<Shared.StateProvince>> GetStateProvinces(string countryCode = null)
        {
            var items = (await client.Send(new StateProvincesQueryCommand()
            {
                CountryCode = countryCode,
            })).Items;

            return mapper.Map<IEnumerable<Shared.StateProvince>>(items);
        }

        public async Task<IEnumerable<Shared.Country>> GetCountries()
        {
            var items = (await client.Send(new CountriesQueryCommand())).Items;

            return mapper.Map<IEnumerable<Shared.Country>>(items);
        }
    }

    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<Country, Shared.Country>().ReverseMap();
            CreateMap<StateProvince, Shared.StateProvince>().ReverseMap();
            CreateMap<Community, Shared.Jurisdiction>().ReverseMap();
        }
    }
}
