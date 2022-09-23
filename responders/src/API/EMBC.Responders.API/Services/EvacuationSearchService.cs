using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Responders.API.Controllers;
using EMBC.Utilities.Messaging;
using Microsoft.Extensions.Configuration;

namespace EMBC.Responders.API.Services
{
    public interface IEvacuationSearchService
    {
        Task<SearchResults> SearchEvacuations(string firstName, string lastName, string dateOfBirth, string manualFileId, MemberRole userRole);

        Task<EvacuationFile> GetEvacuationFile(string fileId, string needsAssessmentId);

        Task<IEnumerable<EvacuationFileSummary>> GetEvacuationFilesByManualFileId(string manualFileId);

        Task<IEnumerable<EvacuationFileSummary>> GetEvacuationFilesByFileId(string id);

        Task<IEnumerable<EvacuationFileSummary>> GetEvacuationFilesByRegistrantId(string registrantId, MemberRole userRole);

        Task<IEnumerable<RegistrantProfileSearchResult>> SearchRegistrantMatches(string firstName, string lastName, string dateOfBirth, MemberRole userRole);

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
        public bool IsProfileCompleted { get; set; }
        public bool IsAuthenticated { get; set; }
    }

    public class EvacuationFileSearchResult
    {
        public string Id { get; set; }
        public string ManualFileId { get; set; }
        public bool IsPaperBasedFile { get; set; }
        public bool IsRestricted { get; set; }
        public string TaskId { get; set; }
        public DateTime? TaskStartDate { get; set; }
        public DateTime? TaskEndDate { get; set; }
        public string TaskLocationCommunityCode { get; set; }
        public Address EvacuatedFrom { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime ModifiedOn { get; set; }
        public EvacuationFileStatus Status { get; set; }
        public IEnumerable<EvacuationFileSearchResultHouseholdMember> HouseholdMembers { get; set; }
        public bool IsFileCompleted { get; set; }
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
        private readonly IConfiguration configuration;
        private static EvacuationFileStatus[] tier1FileStatuses = new[] { EvacuationFileStatus.Pending, EvacuationFileStatus.Active, EvacuationFileStatus.Expired };
        private static EvacuationFileStatus[] tier2andAboveFileStatuses = new[] { EvacuationFileStatus.Pending, EvacuationFileStatus.Active, EvacuationFileStatus.Expired, EvacuationFileStatus.Completed };

        public EvacuationSearchService(IMessagingClient messagingClient, IMapper mapper, IConfiguration configuration)
        {
            this.messagingClient = messagingClient;
            this.mapper = mapper;
            this.configuration = configuration;
        }

        public async Task<SearchResults> SearchEvacuations(string firstName, string lastName, string dateOfBirth, string manualFileId, MemberRole userRole)
        {
            var allowedStatues = (!string.IsNullOrEmpty(manualFileId) || userRole != MemberRole.Tier1 ? tier2andAboveFileStatuses : tier1FileStatuses)
                .Select(s => Enum.Parse<EMBC.ESS.Shared.Contracts.Events.EvacuationFileStatus>(s.ToString(), true)).ToArray();
            var searchResults = await messagingClient.Send(new EMBC.ESS.Shared.Contracts.Events.EvacueeSearchQuery
            {
                FirstName = firstName,
                LastName = lastName,
                DateOfBirth = dateOfBirth,
                IncludeRestrictedAccess = userRole != MemberRole.Tier1,
                InStatuses = allowedStatues
            });
            return new SearchResults
            {
                Registrants = mapper.Map<IEnumerable<RegistrantProfileSearchResult>>(searchResults.Profiles),
                Files = mapper.Map<IEnumerable<EvacuationFileSearchResult>>(searchResults.EvacuationFiles)
            };
        }

        public async Task<EvacuationFile> GetEvacuationFile(string fileId, string needsAssessmentId)
        {
            var file = (await messagingClient.Send(new EMBC.ESS.Shared.Contracts.Events.EvacuationFilesQuery { FileId = fileId, NeedsAssessmentId = needsAssessmentId })).Items.SingleOrDefault();

            var mappedFile = mapper.Map<EvacuationFile>(file);

            if (mappedFile != null)
            {
                if (mappedFile.Task == null) mappedFile.Task = new EvacuationFileTask();
                mappedFile.Task.Features = GetEvacuationFileFeatures(mappedFile);
            }
            return mappedFile;
        }

        public async Task<IEnumerable<EvacuationFileSummary>> GetEvacuationFilesByManualFileId(string manualFileId)
        {
            var file = (await messagingClient.Send(new EMBC.ESS.Shared.Contracts.Events.EvacuationFilesQuery { ManualFileId = manualFileId }))
                .Items
                .OrderByDescending(f => f.Id)
                .FirstOrDefault();
            return mapper.Map<IEnumerable<EvacuationFileSummary>>(new[] { file });
        }

        public async Task<IEnumerable<EvacuationFileSummary>> GetEvacuationFilesByFileId(string id)
        {
            var query = new EMBC.ESS.Shared.Contracts.Events.EvacuationFilesQuery();
            if (id.StartsWith("T"))
            {
                query.ManualFileId = id;
            }
            else
            {
                query.FileId = id;
            }

            var file = (await messagingClient.Send(query))
            .Items
            .OrderByDescending(f => f.Id)
            .FirstOrDefault();
            var mappedFile = mapper.Map<EvacuationFile>(file);

            if (mappedFile != null && mappedFile.Task != null)
            {
                var task = (await messagingClient.Send(new ESS.Shared.Contracts.Events.TasksSearchQuery { TaskId = mappedFile.Task.TaskNumber })).Items.SingleOrDefault();
                mappedFile.Task.Features = GetEvacuationFileFeatures(mappedFile, task);
            }

            return new[] { mapper.Map<EvacuationFileSummary>(mappedFile) };
        }

        public async Task<IEnumerable<EvacuationFileSummary>> GetEvacuationFilesByRegistrantId(string? registrantId, MemberRole userRole)
        {
            var files = (await messagingClient.Send(new EMBC.ESS.Shared.Contracts.Events.EvacuationFilesQuery
            {
                LinkedRegistrantId = registrantId
            })).Items;

            return mapper.Map<IEnumerable<EvacuationFileSummary>>(files);
        }

        public async Task<IEnumerable<RegistrantProfileSearchResult>> SearchRegistrantMatches(string firstName, string lastName, string dateOfBirth, MemberRole userRole)
        {
            var searchResults = await messagingClient.Send(new EMBC.ESS.Shared.Contracts.Events.EvacueeSearchQuery
            {
                FirstName = firstName,
                LastName = lastName,
                DateOfBirth = dateOfBirth,
                IncludeRestrictedAccess = userRole != MemberRole.Tier1,
                IncludeRegistrantProfilesOnly = true
            });
            return mapper.Map<IEnumerable<RegistrantProfileSearchResult>>(searchResults.Profiles);
        }

        public async Task<IEnumerable<EvacuationFileSearchResult>> SearchEvacuationFileMatches(string firstName, string lastName, string dateOfBirth, MemberRole userRole)
        {
            var searchResults = await messagingClient.Send(new EMBC.ESS.Shared.Contracts.Events.EvacueeSearchQuery
            {
                FirstName = firstName,
                LastName = lastName,
                DateOfBirth = dateOfBirth,
                IncludeRestrictedAccess = true,
                IncludeEvacuationFilesOnly = true,
                InStatuses = (userRole == MemberRole.Tier1 ? tier1FileStatuses : tier2andAboveFileStatuses)
                    .Select(s => Enum.Parse<EMBC.ESS.Shared.Contracts.Events.EvacuationFileStatus>(s.ToString(), true)).ToArray()
            });
            return mapper.Map<IEnumerable<EvacuationFileSearchResult>>(searchResults.EvacuationFiles);
        }

        private IEnumerable<EvacuationFileTaskFeature> GetEvacuationFileFeatures(EvacuationFile file, ESS.Shared.Contracts.Events.IncidentTask task = null)
        {
            // temporary toggle feature for e-transfer
            var etransferEnabled = configuration.GetValue("features:eTransferEnabled", true);

            return new[]
            {
                new EvacuationFileTaskFeature { Name = "digital-support-referrals", Enabled = file.Task?.To >= DateTime.UtcNow },
                new EvacuationFileTaskFeature { Name = "digital-support-etransfer", Enabled = etransferEnabled && (file.Task == null || !file.Task.To.HasValue || file.Task?.To >= DateTime.UtcNow) },
                new EvacuationFileTaskFeature { Name = "paper-support-referrals", Enabled = file.ManualFileId != null },
                new EvacuationFileTaskFeature { Name = "remote-extensions", Enabled = task != null && task.RemoteExtensionsEnabled },
                new EvacuationFileTaskFeature { Name = "case-notes", Enabled = task != null && (task.Status == ESS.Shared.Contracts.Events.IncidentTaskStatus.Active || task.Status == ESS.Shared.Contracts.Events.IncidentTaskStatus.Expired) },
            };
        }
    }

    public class EvacuationSearchMapping : Profile
    {
        public EvacuationSearchMapping()
        {
            CreateMap<EMBC.ESS.Shared.Contracts.Events.EvacuationFileSearchResult, EvacuationFileSearchResult>()
                .ForMember(d => d.IsPaperBasedFile, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.ManualFileId)))
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.EvacuatedFrom, opts => opts.MapFrom(s => s.EvacuationAddress))
                .ForMember(d => d.ModifiedOn, opts => opts.MapFrom(s => s.LastModified))
               ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.ProfileSearchResult, RegistrantProfileSearchResult>()
                .ForMember(d => d.EvacuationFiles, opts => opts.MapFrom(s => s.RecentEvacuationFiles.OrderByDescending(f => f.EvacuationDate).Take(3)))
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.IsVerified ? RegistrantStatus.Verified : RegistrantStatus.NotVerified))
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.RegistrationDate))
                .ForMember(d => d.ModifiedOn, opts => opts.MapFrom(s => s.LastModified))
             ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.EvacuationFileSearchResultHouseholdMember, EvacuationFileSearchResultHouseholdMember>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.LinkedRegistrantId == null ? null : s.LinkedRegistrantId))
                .ForMember(d => d.Type, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.LinkedRegistrantId) ? HouseholdMemberType.HouseholdMember : HouseholdMemberType.Registrant))
                .ForMember(d => d.IsMainApplicant, opts => opts.MapFrom(s => s.IsPrimaryRegistrant))
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                ;

            CreateMap<EMBC.ESS.Shared.Contracts.Events.EvacuationFile, EvacuationFileSummary>()
                .ForMember(d => d.IssuedOn, opts => opts.MapFrom(s => s.CreatedOn)) //temporary until files contain issued on
                .ForMember(d => d.EvacuationFileDate, opts => opts.MapFrom(s => s.EvacuationDate))
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.HasSupports, opts => opts.MapFrom(s => s.Supports.Any()))
                .ForMember(d => d.Task, opts => opts.MapFrom(s => s.RelatedTask == null
                    ? new EvacuationFileTask()
                    : new EvacuationFileTask
                    {
                        TaskNumber = s.RelatedTask.Id,
                        CommunityCode = s.RelatedTask.CommunityCode,
                        From = s.RelatedTask.StartDate,
                        To = s.RelatedTask.EndDate
                    }))
            ;

            CreateMap<EvacuationFile, EvacuationFileSummary>()
                .ForMember(d => d.HasSupports, opts => opts.MapFrom(s => s.Supports.Any()))
                .ForMember(d => d.CreatedOn, opts => opts.Ignore())
                .ForMember(d => d.IssuedOn, opts => opts.Ignore())
            ;
        }
    }
}
