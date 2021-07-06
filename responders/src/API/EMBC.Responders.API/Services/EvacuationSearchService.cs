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
using EMBC.Responders.API.Controllers;

namespace EMBC.Responders.API.Services
{
    public interface IEvacuationSearchService
    {
        public Task<SearchResults> Search(string firstName, string lastName, string dateOfBirth, Controllers.MemberRole userRole);

        public Task<EvacuationFile> GetEvacuationFile(string fileId);
    }

    public class SearchResults
    {
        public IEnumerable<EvacuationFileSearchResult> Files { get; set; }
        public IEnumerable<RegistrantProfileSearchResult> Registrants { get; set; }
    }

    public class RegistrantProfileSearchResult
    {
        public string Id { get; set; }
        public bool IsRestricted { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public RegistrantStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
        public Address PrimaryAddress { get; set; }
        public IEnumerable<EvacuationFileSearchResult> EvacuationFiles { get; set; }
    }

    public class EvacuationFileSearchResult
    {
        public string Id { get; set; }
        public bool IsRestricted { get; set; }
        public string TaskId { get; set; }
        public Address EvacuatedFrom { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
        public EvacuationFileStatus Status { get; set; }
        public IEnumerable<EvacuationFileSearchResultHouseholdMember> HouseholdMembers { get; set; }
    }

    public class EvacuationFileSearchResultHouseholdMember
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool IsSearchMatch { get; set; }
        public HouseholdMemberType Type { get; set; }
        public bool IsMainApplicant { get; set; }
    }

    public class EvacuationSearchService : IEvacuationSearchService
    {
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;
        private static EvacuationFileStatus[] tier1FileStatuses = new[] { EvacuationFileStatus.Pending, EvacuationFileStatus.Active, EvacuationFileStatus.Expired };
        private static EvacuationFileStatus[] tier2andAboveFileStatuses = new[] { EvacuationFileStatus.Pending, EvacuationFileStatus.Active, EvacuationFileStatus.Expired, EvacuationFileStatus.Completed };

        public EvacuationSearchService(IMessagingClient messagingClient, IMapper mapper)
        {
            this.messagingClient = messagingClient;
            this.mapper = mapper;
        }

        public async Task<SearchResults> Search(string firstName, string lastName, string dateOfBirth, Controllers.MemberRole userRole)
        {
            var searchResults = await messagingClient.Send(new ESS.Shared.Contracts.Submissions.EvacueeSearchQuery
            {
                FirstName = firstName,
                LastName = lastName,
                DateOfBirth = dateOfBirth,
                IncludeRestrictedAccess = userRole != Controllers.MemberRole.Tier1,
                InStatuses = (userRole == Controllers.MemberRole.Tier1 ? tier1FileStatuses : tier2andAboveFileStatuses)
                    .Select(s => Enum.Parse<ESS.Shared.Contracts.Submissions.EvacuationFileStatus>(s.ToString(), true)).ToArray()
            });

            return new SearchResults
            {
                Registrants = mapper.Map<IEnumerable<RegistrantProfileSearchResult>>(searchResults.Profiles),
                Files = mapper.Map<IEnumerable<EvacuationFileSearchResult>>(searchResults.EvacuationFiles)
            };
        }

        public async Task<EvacuationFile> GetEvacuationFile(string fileId)
        {
            var file = (await messagingClient.Send(new ESS.Shared.Contracts.Submissions.EvacuationFilesSearchQuery { FileId = fileId })).Items.SingleOrDefault();
            if (file == null) return null;
            return mapper.Map<EvacuationFile>(file);
        }
    }

    public class EvacuationSearchMapping : Profile
    {
        public EvacuationSearchMapping()
        {
            CreateMap<Services.SearchResults, SearchResults>()
                .ForMember(d => d.Files, opts => opts.MapFrom(s => s.Files))
                .ForMember(d => d.Registrants, opts => opts.MapFrom(s => s.Registrants))
                ;
            CreateMap<ESS.Shared.Contracts.Submissions.EvacuationFileSearchResult, EvacuationFileSearchResult>()
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.Status))
                .ForMember(d => d.EvacuatedFrom, opts => opts.MapFrom(s => s.EvacuationAddress))
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.ModifiedOn, opts => opts.MapFrom(s => s.CreatedOn))
               ;

            CreateMap<ESS.Shared.Contracts.Submissions.ProfileSearchResult, RegistrantProfileSearchResult>()
                .ForMember(d => d.EvacuationFiles, opts => opts.MapFrom(s => s.RecentEvacuationFiles.OrderByDescending(f => f.EvacuationDate).Take(3)))
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.IsVerified ? RegistrantStatus.Verified : RegistrantStatus.NotVerified))
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.RegistrationDate))
                .ForMember(d => d.ModifiedOn, opts => opts.MapFrom(s => s.RegistrationDate))
              ;

            CreateMap<ESS.Shared.Contracts.Submissions.EvacuationFileSearchResultHouseholdMember, EvacuationFileSearchResultHouseholdMember>()
                .ForMember(d => d.Type, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.LinkedRegistrantId) ? HouseholdMemberType.Registrant : HouseholdMemberType.Registrant))
                .ForMember(d => d.IsMainApplicant, s => s.MapFrom(s => s.IsPrimaryRegistrant))
                ;
        }
    }
}
