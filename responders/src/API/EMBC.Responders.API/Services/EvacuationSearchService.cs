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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Submissions;
using EMBC.Responders.API.Controllers;

namespace EMBC.Responders.API.Services
{
    public interface IEvacuationSearchService
    {
        public Task<SearchResults> Search(string firstName, string lastName, string dateOfBirth, MemberRole userRole);
    }

    public class Searchresults
    {
        public IEnumerable<EvacuationFile> Files { get; set; }
        public IEnumerable<RegistrantProfile> Registrants { get; set; }
    }

    public class EvacuationSearchService : IEvacuationSearchService
    {
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;

        public EvacuationSearchService(IMessagingClient messagingClient, IMapper mapper)
        {
            this.messagingClient = messagingClient;
            this.mapper = mapper;
        }

        public async Task<SearchResults> Search(string firstName, string lastName, string dateOfBirth, MemberRole userRole)
        {
            var registrants = (await messagingClient.Send(new RegistrantsSearchQuery
            {
                FirstName = firstName,
                LastName = lastName,
                DateOfBirth = dateOfBirth
            })).Items;

            var files = (await messagingClient.Send(new EvacuationFilesSearchQuery
            {
                FirstName = firstName,
                LastName = lastName,
                DateOfBirth = dateOfBirth
            })).Items;

            //TODO: check if any result has restrictions

            return new SearchResults
            {
                Registrants = mapper.Map<IEnumerable<RegistrantProfileSearchResult>>(registrants),
                Files = mapper.Map<IEnumerable<EvacuationFileSearchResult>>(files)
            };
        }
    }

    public class EvacuationSearchMapping : Profile
    {
        public EvacuationSearchMapping()
        {
            CreateMap<EvacuationFile, EvacuationFileSearchResult>()
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.Status))
                .ForMember(d => d.HouseholdMembers, opts => opts.MapFrom(s => s.NeedsAssessments.First().HouseholdMembers))
                .ForMember(d => d.EvacuatedFrom, opts => opts.MapFrom(s => s.EvacuatedFromAddress))
                ;

            Func<string, bool> isGuid = s => Guid.TryParse(s, out var _);
            CreateMap<ESS.Shared.Contracts.Submissions.Address, Controllers.Address>()
                .ForMember(d => d.City, opts => opts.MapFrom(s => isGuid(s.Community) ? null : s.Community))
                .ForMember(d => d.CommunityCode, opts => opts.MapFrom(s => !isGuid(s.Community) ? null : s.Community))
                .ForMember(d => d.StateProvinceCode, opts => opts.MapFrom(s => s.StateProvince))
                .ForMember(d => d.CountryCode, opts => opts.MapFrom(s => s.Country))
                ;

            CreateMap<RegistrantWithFiles, RegistrantProfileSearchResult>()
                .IncludeMembers(s => s.RegistrantProfile)
                .ForMember(d => d.EvacuationFiles, opts => opts.MapFrom(s => s.Files))
                ;

            CreateMap<RegistrantProfile, RegistrantProfileSearchResult>()
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => DateTime.Now))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => RegistrantStatus.NotVerified))
                .ForMember(d => d.EvacuationFiles, opts => opts.Ignore())
                ;

            CreateMap<HouseholdMember, EvacuationFileHouseholdMember>()
                .ForMember(d => d.Type, opts => opts.MapFrom(s => s.IsPrimaryRegistrant ? HouseholdMemberType.MainApplicant : HouseholdMemberType.HouseholdMember))
                .ForMember(d => d.IsMatch, opts => opts.Ignore())
                ;
        }
    }
}
