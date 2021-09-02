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
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Responders.API.Controllers;
using Microsoft.AspNetCore.Http;

namespace EMBC.Responders.API.Services
{
    public interface IEvacuationSearchService
    {
        Task<SearchResults> SearchEvacuations(string firstName, string lastName, string dateOfBirth, MemberRole userRole);

        Task<EvacuationFile> GetEvacuationFile(string fileId, string needsAssessmentId);

        Task<IEnumerable<EvacuationFileSummary>> GetEvacuationFiles(string registrantId, MemberRole userRole);

        Task<IEnumerable<RegistrantProfile>> SearchRegistrantMatches(string firstName, string lastName, string dateOfBirth);

        Task<IEnumerable<EvacuationFileSearchResult>> SearchEvacuationFileMatches(string firstName, string lastName, string dateOfBirth, MemberRole userRole);
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
        public string TaskLocationCommunityCode { get; set; }
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
        public bool? IsRestricted { get; set; }
    }

    public class EvacuationSearchService : IEvacuationSearchService
    {
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;
        private readonly IHttpContextAccessor httpContext;
        private static EvacuationFileStatus[] tier1FileStatuses = new[] { EvacuationFileStatus.Pending, EvacuationFileStatus.Active, EvacuationFileStatus.Expired };
        private static EvacuationFileStatus[] tier2andAboveFileStatuses = new[] { EvacuationFileStatus.Pending, EvacuationFileStatus.Active, EvacuationFileStatus.Expired, EvacuationFileStatus.Completed };

        private ClaimsPrincipal User => httpContext.HttpContext.User;

        public EvacuationSearchService(IMessagingClient messagingClient, IMapper mapper, IHttpContextAccessor httpContext)
        {
            this.messagingClient = messagingClient;
            this.mapper = mapper;
            this.httpContext = httpContext;
        }

        public async Task<SearchResults> SearchEvacuations(string firstName, string lastName, string dateOfBirth, MemberRole userRole)
        {
            var searchResults = await messagingClient.Send(new ESS.Shared.Contracts.Submissions.EvacueeSearchQuery
            {
                FirstName = firstName,
                LastName = lastName,
                DateOfBirth = dateOfBirth,
                IncludeRestrictedAccess = userRole != MemberRole.Tier1,
                InStatuses = (userRole == MemberRole.Tier1 ? tier1FileStatuses : tier2andAboveFileStatuses)
                    .Select(s => Enum.Parse<ESS.Shared.Contracts.Submissions.EvacuationFileStatus>(s.ToString(), true)).ToArray()
            });

            return new SearchResults
            {
                Registrants = mapper.Map<IEnumerable<RegistrantProfileSearchResult>>(searchResults.Profiles),
                Files = mapper.Map<IEnumerable<EvacuationFileSearchResult>>(searchResults.EvacuationFiles)
            };
        }

        public async Task<EvacuationFile> GetEvacuationFile(string fileId, string needsAssessmentId)
        {
            var file = (await messagingClient.Send(new ESS.Shared.Contracts.Submissions.EvacuationFilesQuery { FileId = fileId, NeedsAssessmentId = needsAssessmentId })).Items.SingleOrDefault();
            if (file == null) return null;

            var mappedFile = mapper.Map<EvacuationFile>(file);

            return mappedFile;
        }

        public async Task<IEnumerable<EvacuationFileSummary>> GetEvacuationFiles(string registrantId, MemberRole userRole)
        {
            var files = (await messagingClient.Send(new ESS.Shared.Contracts.Submissions.EvacuationFilesQuery
            {
                LinkedRegistrantId = registrantId,
                IncludeFilesInStatuses = (userRole == MemberRole.Tier1 ? tier1FileStatuses : tier2andAboveFileStatuses)
                    .Select(s => Enum.Parse<ESS.Shared.Contracts.Submissions.EvacuationFileStatus>(s.ToString(), true)).ToArray()
            })).Items;

            return mapper.Map<IEnumerable<EvacuationFileSummary>>(files);
        }

        public async Task<IEnumerable<RegistrantProfile>> SearchRegistrantMatches(string firstName, string lastName, string dateOfBirth)
        {
            var searchResults = await messagingClient.Send(new ESS.Shared.Contracts.Submissions.EvacueeSearchQuery
            {
                FirstName = firstName,
                LastName = lastName,
                DateOfBirth = dateOfBirth,
                IncludeRestrictedAccess = true,
                IncludeRegistrantProfilesOnly = true
            });
            return mapper.Map<IEnumerable<RegistrantProfile>>(searchResults.Profiles);
        }

        public async Task<IEnumerable<EvacuationFileSearchResult>> SearchEvacuationFileMatches(string firstName, string lastName, string dateOfBirth, MemberRole userRole)
        {
            var searchResults = await messagingClient.Send(new ESS.Shared.Contracts.Submissions.EvacueeSearchQuery
            {
                FirstName = firstName,
                LastName = lastName,
                DateOfBirth = dateOfBirth,
                IncludeRestrictedAccess = true,
                IncludeEvacuationFilesOnly = true,
                InStatuses = (userRole == MemberRole.Tier1 ? tier1FileStatuses : tier2andAboveFileStatuses)
                    .Select(s => Enum.Parse<ESS.Shared.Contracts.Submissions.EvacuationFileStatus>(s.ToString(), true)).ToArray()
            });
            return mapper.Map<IEnumerable<EvacuationFileSearchResult>>(searchResults.EvacuationFiles);
        }
    }

    public class EvacuationSearchMapping : Profile
    {
        public EvacuationSearchMapping()
        {
            CreateMap<ESS.Shared.Contracts.Submissions.EvacuationFileSearchResult, EvacuationFileSearchResult>()
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.Status))
                .ForMember(d => d.EvacuatedFrom, opts => opts.MapFrom(s => s.EvacuationAddress))
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.ModifiedOn, opts => opts.MapFrom(s => s.LastModified))
               ;

            CreateMap<ESS.Shared.Contracts.Submissions.ProfileSearchResult, RegistrantProfileSearchResult>()
                .ForMember(d => d.EvacuationFiles, opts => opts.MapFrom(s => s.RecentEvacuationFiles.OrderByDescending(f => f.EvacuationDate).Take(3)))
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.IsVerified ? RegistrantStatus.Verified : RegistrantStatus.NotVerified))
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.RegistrationDate))
                .ForMember(d => d.ModifiedOn, opts => opts.MapFrom(s => s.LastModified))
              ;

            CreateMap<ESS.Shared.Contracts.Submissions.ProfileSearchResult, RegistrantProfile>()
                .ForMember(d => d.Restriction, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.VerifiedUser, opts => opts.MapFrom(s => s.IsVerified))
                .ForMember(d => d.AuthenticatedUser, opts => opts.MapFrom(s => s.IsAuthenticated))
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.RegistrationDate))
                .ForMember(d => d.ModifiedOn, opts => opts.MapFrom(s => s.LastModified))
                .ForMember(d => d.ContactDetails, opts => opts.Ignore())
                .ForMember(d => d.PersonalDetails, opts => opts.MapFrom(s => new PersonDetails
                {
                    FirstName = s.FirstName,
                    LastName = s.LastName,
                    DateOfBirth = s.DateOfBirth
                }))
                .ForMember(d => d.MailingAddress, opts => opts.Ignore())
                .ForMember(d => d.SecurityQuestions, opts => opts.Ignore())
                .ForMember(d => d.IsMailingAddressSameAsPrimaryAddress, opts => opts.Ignore())
              ;

            CreateMap<ESS.Shared.Contracts.Submissions.EvacuationFileSearchResultHouseholdMember, EvacuationFileSearchResultHouseholdMember>()
                .ForMember(d => d.Type, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.LinkedRegistrantId) ? HouseholdMemberType.HouseholdMember : HouseholdMemberType.Registrant))
                .ForMember(d => d.IsMainApplicant, opts => opts.MapFrom(s => s.IsPrimaryRegistrant))
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                ;

            CreateMap<ESS.Shared.Contracts.Submissions.EvacuationFile, EvacuationFileSummary>()
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.CreatedOn))
                .ForMember(d => d.EvacuationFileDate, opts => opts.MapFrom(s => s.EvacuationDate))
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.Task, opts => opts.MapFrom(s => s.RelatedTask == null ? null : new EvacuationFileTask
                {
                    TaskNumber = s.RelatedTask.Id,
                    CommunityCode = s.RelatedTask.CommunityCode,
                    From = s.RelatedTask.StartDate,
                    To = s.RelatedTask.EndDate
                }))
            ;
        }
    }
}
