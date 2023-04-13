using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Engines.Search;
using EMBC.ESS.Engines.Supporting;
using EMBC.ESS.Managers.Events.Notifications;
using EMBC.ESS.Resources.Evacuations;
using EMBC.ESS.Resources.Evacuees;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Resources.Payments;
using EMBC.ESS.Resources.Print;
using EMBC.ESS.Resources.Suppliers;
using EMBC.ESS.Resources.Supports;
using EMBC.ESS.Resources.Tasks;
using EMBC.ESS.Resources.Teams;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Caching;
using EMBC.Utilities.Notifications;
using EMBC.Utilities.Telemetry;
using EMBC.Utilities.Transformation;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EMBC.ESS.Managers.Events
{
    public class EventsManager
    {
        private readonly ITelemetryProvider telemetryProvider;
        private readonly IMapper mapper;
        private readonly IEvacueesRepository evacueesRepository;
        private readonly IInvitationRepository invitationRepository;
        private readonly ITemplateProviderResolver templateProviderResolver;
        private readonly IEvacuationRepository evacuationRepository;
        private readonly ISupportRepository supportRepository;
        private readonly ITransformator transformator;
        private readonly INotificationSender notificationSender;
        private readonly ITaskRepository taskRepository;
        private readonly ITeamRepository teamRepository;
        private readonly ISupplierRepository supplierRepository;
        private readonly ISearchEngine searchEngine;
        private readonly IPrintRequestsRepository printingRepository;
        private readonly IMetadataRepository metadataRepository;
        private readonly IDataProtectionProvider dataProtectionProvider;
        private readonly IConfiguration configuration;
        private readonly ISupportingEngine supportingEngine;
        private readonly IPaymentRepository paymentRepository;
        private readonly ICache cache;
        private readonly EvacuationFileLoader evacuationFileLoader;
        private readonly IWebHostEnvironment env;
        private static TeamMemberStatus[] activeOnlyStatus = new[] { TeamMemberStatus.Active };

        public EventsManager(
            ITelemetryProvider telemetryProvider,
            IMapper mapper,
            IEvacueesRepository evacueesRepository,
            IInvitationRepository invitationRepository,
            ITemplateProviderResolver templateProviderResolver,
            IEvacuationRepository evacuationRepository,
            ISupportRepository supportRepository,
            ITransformator transformator,
            INotificationSender notificationSender,
            ITaskRepository taskRepository,
            ITeamRepository teamRepository,
            ISupplierRepository supplierRepository,
            ISearchEngine searchEngine,
            IPrintRequestsRepository printingRepository,
            IWebHostEnvironment env,
            IMetadataRepository metadataRepository,
            IDataProtectionProvider dataProtectionProvider,
            IConfiguration configuration,
            ISupportingEngine supportingEngine,
            IPaymentRepository paymentRepository,
            ICache cache)
        {
            this.telemetryProvider = telemetryProvider;
            this.mapper = mapper;
            this.evacueesRepository = evacueesRepository;
            this.invitationRepository = invitationRepository;
            this.templateProviderResolver = templateProviderResolver;
            this.evacuationRepository = evacuationRepository;
            this.supportRepository = supportRepository;
            this.transformator = transformator;
            this.notificationSender = notificationSender;
            this.taskRepository = taskRepository;
            this.teamRepository = teamRepository;
            this.supplierRepository = supplierRepository;
            this.searchEngine = searchEngine;
            this.printingRepository = printingRepository;
            this.metadataRepository = metadataRepository;
            this.dataProtectionProvider = dataProtectionProvider;
            this.configuration = configuration;
            this.supportingEngine = supportingEngine;
            this.paymentRepository = paymentRepository;
            this.cache = cache;
            this.env = env;
            evacuationFileLoader = new EvacuationFileLoader(mapper, teamRepository, taskRepository, supplierRepository, supportRepository, this.evacueesRepository, paymentRepository);
        }

        public async Task<string> Handle(SubmitAnonymousEvacuationFileCommand cmd)
        {
            var file = mapper.Map<Resources.Evacuations.EvacuationFile>(cmd.File);
            var evacuee = mapper.Map<Evacuee>(cmd.SubmitterProfile);

            file.PrimaryRegistrantId = (await evacueesRepository.Manage(new SaveEvacuee { Evacuee = evacuee })).EvacueeId;
            file.NeedsAssessment.HouseholdMembers.Single(m => m.IsPrimaryRegistrant).LinkedRegistrantId = file.PrimaryRegistrantId;

            var caseId = (await evacuationRepository.Manage(new SubmitEvacuationFileNeedsAssessment { EvacuationFile = file })).Id;

            if (!string.IsNullOrEmpty(evacuee.Email))
            {
                await SendEmailNotification(
                    SubmissionTemplateType.NewAnonymousEvacuationFileSubmission,
                    email: evacuee.Email,
                    name: $"{evacuee.LastName}, {evacuee.FirstName}",
                    tokens: new[] { KeyValuePair.Create("fileNumber", caseId) });
            }

            return caseId;
        }

        public async Task<string> Handle(SubmitEvacuationFileCommand cmd)
        {
            var file = mapper.Map<Resources.Evacuations.EvacuationFile>(cmd.File);

            var evacuee = (await evacueesRepository.Query(new EvacueeQuery { EvacueeId = file.PrimaryRegistrantId, UserId = file.PrimaryRegistrantUserId })).Items.SingleOrDefault();

            if (evacuee == null) throw new NotFoundException($"Registrant not found '{file.PrimaryRegistrantId}'", file.PrimaryRegistrantId);
            file.PrimaryRegistrantId = evacuee.Id;

            if (!string.IsNullOrEmpty(file.Id))
            {
                var caseRecord = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery { FileId = file.Id })).Items.SingleOrDefault();
                var existingFile = mapper.Map<Resources.Evacuations.EvacuationFile>(caseRecord);

                if (!string.IsNullOrEmpty(existingFile.TaskId) && !existingFile.TaskId.Equals(file.TaskId, StringComparison.Ordinal))
                    throw new BusinessLogicException($"The ESS Task Number cannot be modified or updated once it's been initially assigned.");
            }

            var caseId = (await evacuationRepository.Manage(new SubmitEvacuationFileNeedsAssessment { EvacuationFile = file })).Id;

            var shouldEmailNotification = string.IsNullOrEmpty(file.Id) && !string.IsNullOrEmpty(evacuee.Email) && string.IsNullOrEmpty(file.ManualFileId);
            if (shouldEmailNotification)
            {
                //notify registrant of the new file and has email
                await SendEmailNotification(
                    SubmissionTemplateType.NewEvacuationFileSubmission,
                    email: evacuee.Email,
                    name: $"{evacuee.LastName}, {evacuee.FirstName}",
                    tokens: new[] { KeyValuePair.Create("fileNumber", caseId) });
            }

            return caseId;
        }

        public async Task<string> Handle(SaveRegistrantCommand cmd)
        {
            var evacuee = mapper.Map<Evacuee>(cmd.Profile);

            if (evacuee.Id == null && evacuee.UserId != null)
            {
                //look up evacuee by user id
                evacuee.Id = (await evacueesRepository.Query(new EvacueeQuery { UserId = evacuee.UserId })).Items.SingleOrDefault()?.Id;
            }

            var result = await evacueesRepository.Manage(new SaveEvacuee { Evacuee = evacuee });

            var newEvacuee = string.IsNullOrEmpty(evacuee.Id);
            if (newEvacuee && !string.IsNullOrEmpty(evacuee.Email))
            {
                await SendEmailNotification(
                    SubmissionTemplateType.NewProfileRegistration,
                    email: evacuee.Email,
                    name: $"{evacuee.LastName}, {evacuee.FirstName}",
                    tokens: Array.Empty<KeyValuePair<string, string>>());
            }

            return result.EvacueeId;
        }

        public async Task<string> Handle(LinkRegistrantCommand cmd)
        {
            if (string.IsNullOrEmpty(cmd.RegistantId)) throw new ArgumentNullException("RegistantId is required");
            if (string.IsNullOrEmpty(cmd.HouseholdMemberId)) throw new ArgumentNullException("HouseholdMemberId is required");

            var caseRecord = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery { FileId = cmd.FileId })).Items.SingleOrDefault();
            var file = mapper.Map<Resources.Evacuations.EvacuationFile>(caseRecord);
            var member = file.HouseholdMembers.SingleOrDefault(m => m.Id == cmd.HouseholdMemberId);
            if (member == null) throw new NotFoundException($"HouseholdMember not found '{cmd.HouseholdMemberId}'", cmd.HouseholdMemberId);

            var memberAlreadyLinked = file.HouseholdMembers.FirstOrDefault(m => m.LinkedRegistrantId == cmd.RegistantId);
            if (memberAlreadyLinked != null) throw new BusinessValidationException($"There is already a HouseholdMember '{memberAlreadyLinked.Id}' linked to the Registrant '{cmd.RegistantId}'");

            var caseId = (await evacuationRepository.Manage(new LinkEvacuationFileRegistrant { FileId = file.Id, RegistrantId = cmd.RegistantId, HouseholdMemberId = cmd.HouseholdMemberId })).Id;
            return caseId;
        }

        public async Task<string> Handle(SetRegistrantVerificationStatusCommand cmd)
        {
            var evacuee = (await evacueesRepository.Query(new EvacueeQuery { EvacueeId = cmd.RegistrantId })).Items.SingleOrDefault();
            if (evacuee == null) throw new NotFoundException($"Could not find existing Registrant with id {cmd.RegistrantId}", cmd.RegistrantId);
            evacuee.Verified = cmd.Verified;
            var res = await evacueesRepository.Manage(new SaveEvacuee { Evacuee = evacuee });
            return res.EvacueeId;
        }

        private async System.Threading.Tasks.Task SendEmailNotification(SubmissionTemplateType notificationType, string email, string name, IEnumerable<KeyValuePair<string, string>> tokens)
        {
            var template = (EmailTemplate)await templateProviderResolver.Resolve(NotificationChannelType.Email).Get(notificationType);
            var emailContent = (await transformator.Transform(new TransformationData
            {
                Template = template.Content,
                Tokens = new Dictionary<string, string>(tokens)
            })).Content;

            await notificationSender.Send(new EmailNotification
            {
                Subject = template.Subject,
                Content = emailContent,
                To = new[] { new EmailAddress { Name = name, Address = email } }
            });
        }

        public async Task<RegistrantsQueryResponse> Handle(RegistrantsQuery query)
        {
            var evacuees = (await evacueesRepository.Query(new EvacueeQuery
            {
                EvacueeId = query.Id,
                UserId = query.UserId
            })).Items;

            var registrants = mapper.Map<IEnumerable<RegistrantProfile>>(evacuees);

            return new RegistrantsQueryResponse { Items = registrants };
        }

        public async Task<EvacuationFilesQueryResponse> Handle(Shared.Contracts.Events.EvacuationFilesQuery query)
        {
            var ct = new CancellationTokenSource().Token;
            if (!string.IsNullOrEmpty(query.PrimaryRegistrantUserId))
            {
                var registrant = (await evacueesRepository.Query(new EvacueeQuery { UserId = query.PrimaryRegistrantUserId })).Items.SingleOrDefault();
                if (registrant == null) throw new NotFoundException($"registrant with user id '{query.PrimaryRegistrantUserId}' not found", query.PrimaryRegistrantUserId);
                query.PrimaryRegistrantId = registrant.Id;
            }
            var foundFiles = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery
            {
                FileId = query.FileId,
                ManualFileId = query.ManualFileId,
                PrimaryRegistrantId = query.PrimaryRegistrantId,
                LinkedRegistrantId = query.LinkedRegistrantId,
                NeedsAssessmentId = query.NeedsAssessmentId,
                IncludeFilesInStatuses = query.IncludeFilesInStatuses.Select(s => Enum.Parse<Resources.Evacuations.EvacuationFileStatus>(s.ToString())).ToArray()
            })).Items;

            var files = mapper.Map<IEnumerable<Shared.Contracts.Events.EvacuationFile>>(foundFiles).ToArray();

            await Parallel.ForEachAsync(files, ct, async (f, ct) => await evacuationFileLoader.Load(f, ct));

            return new EvacuationFilesQueryResponse { Items = files };
        }

        public async Task<EvacueeSearchQueryResponse> Handle(EvacueeSearchQuery query)
        {
            if (string.IsNullOrWhiteSpace(query.FirstName)) throw new ArgumentNullException(nameof(EvacueeSearchQuery.FirstName));
            if (string.IsNullOrWhiteSpace(query.LastName)) throw new ArgumentNullException(nameof(EvacueeSearchQuery.LastName));
            if (string.IsNullOrWhiteSpace(query.DateOfBirth)) throw new ArgumentNullException(nameof(EvacueeSearchQuery.DateOfBirth));
            if (query.InStatuses == null) query.InStatuses = Array.Empty<Shared.Contracts.Events.EvacuationFileStatus>();

            var searchMode = query switch
            {
                var q when !q.IncludeEvacuationFilesOnly && q.IncludeRegistrantProfilesOnly => SearchMode.Registrants,
                var q when q.IncludeEvacuationFilesOnly && !q.IncludeRegistrantProfilesOnly => SearchMode.HouseholdMembers,
                _ => SearchMode.Both
            };

            var searchResults = (EvacueeSearchResponse)await searchEngine.Search(new EvacueeSearchRequest
            {
                FirstName = query.FirstName,
                LastName = query.LastName,
                DateOfBirth = query.DateOfBirth,
                SearchMode = searchMode
            });

            var profiles = new ConcurrentBag<ProfileSearchResult>();
            var profileTasks = searchResults.MatchingRegistrantIds.Select<string, System.Threading.Tasks.Task>(async id =>
            {
                var profile = Enumerable.SingleOrDefault<Evacuee>((await evacueesRepository.Query(new EvacueeQuery { EvacueeId = id })).Items);
                if (profile == null) throw new BusinessValidationException($"Profile {id} not found");
                var files = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery { LinkedRegistrantId = id })).Items;
                var mappedProfile = mapper.Map<ProfileSearchResult>(profile);
                mappedProfile.RecentEvacuationFiles = mapper.Map<IEnumerable<EvacuationFileSearchResult>>(files);
                profiles.Add(mappedProfile);
            });

            var files = new ConcurrentBag<EvacuationFileSearchResult>();
            var householdMemberTasks = searchResults.MatchingHouseholdMemberIds.Select(async id =>
            {
                var file = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery { HouseholdMemberId = id })).Items.SingleOrDefault();
                if (file == null) return;
                var mappedFile = mapper.Map<EvacuationFileSearchResult>(file);
                //mark household members that caused a match
                foreach (var member in mappedFile.HouseholdMembers)
                {
                    if (member.Id == id) member.IsSearchMatch = true;
                }
                files.Add(mappedFile);
            });

            var ct = new CancellationTokenSource().Token;
            await Parallel.ForEachAsync(householdMemberTasks.Union(profileTasks), ct, async (t, ct) => await t);

            var profileResults = profiles.ToArray();
            var fileResults = files.ToArray();

            if (!query.IncludeRestrictedAccess)
            {
                //check if any restricted files exist, then return no results
                var anyRestrictions = profileResults.Any(p => p.RestrictedAccess || p.RecentEvacuationFiles.Any(f => f.RestrictedAccess)) || fileResults.Any(f => f.RestrictedAccess);
                if (anyRestrictions) return new EvacueeSearchQueryResponse();
            }

            if (query.InStatuses.Any())
            {
                //filter files by status
                foreach (var profile in profileResults)
                {
                    profile.RecentEvacuationFiles = profile.RecentEvacuationFiles.Where(f => query.InStatuses.Contains(f.Status)).ToArray();
                }
                fileResults = fileResults.Where(f => query.InStatuses.Contains(f.Status)).ToArray();
            }

            await Parallel.ForEachAsync(fileResults, ct, async (file, ct) =>
            {
                if (file.TaskId != null)
                {
                    var task = (EssTask)(await taskRepository.QueryTask(new TaskQuery { ById = file.TaskId })).Items.SingleOrDefault();
                    if (task != null)
                    {
                        file.TaskStartDate = task.StartDate;
                        file.TaskEndDate = task.EndDate;
                    }
                }
            });

            return new EvacueeSearchQueryResponse
            {
                Profiles = profileResults,
                EvacuationFiles = fileResults
            };
        }

        public async Task<VerifySecurityQuestionsResponse> Handle(VerifySecurityQuestionsQuery query)
        {
            var evacuee = (await evacueesRepository.Query(new EvacueeQuery { EvacueeId = query.RegistrantId, MaskSecurityAnswers = false })).Items.FirstOrDefault();

            if (evacuee == null) throw new NotFoundException($"registrant {query.RegistrantId} not found", query.RegistrantId);

            var numberOfCorrectAnswers = query.Answers
                .Select(a => evacuee.SecurityQuestions.Any(q => a.Answer.Equals(q.Answer, StringComparison.OrdinalIgnoreCase) && a.Question.Equals(q.Question, StringComparison.OrdinalIgnoreCase)))
                .Count(a => a);
            return new VerifySecurityQuestionsResponse { NumberOfCorrectAnswers = numberOfCorrectAnswers };
        }

        public async Task<VerifySecurityPhraseResponse> Handle(VerifySecurityPhraseQuery query)
        {
            var file = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery
            {
                FileId = query.FileId,
                MaskSecurityPhrase = false
            })).Items.FirstOrDefault();

            if (file == null) throw new NotFoundException($"Evacuation File {query.FileId} not found", query.FileId);

            var isCorrect = string.Equals(file.SecurityPhrase, query.SecurityPhrase, StringComparison.OrdinalIgnoreCase);

            return new VerifySecurityPhraseResponse
            {
                IsCorrect = isCorrect
            };
        }

        public async Task<string> Handle(SaveEvacuationFileNoteCommand cmd)
        {
            if (string.IsNullOrEmpty(cmd.FileId)) throw new ArgumentNullException("FileId is required");

            if (!string.IsNullOrEmpty(cmd.Note.Id))
            {
                var file = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery
                {
                    FileId = cmd.FileId,
                })).Items.SingleOrDefault();

                if (file == null) throw new NotFoundException($"Evacuation File {cmd.FileId} not found", cmd.FileId);

                var noteToUpdate = file.Notes.SingleOrDefault(n => n.Id == cmd.Note.Id);

                if (noteToUpdate == null) throw new NotFoundException($"Evacuation File Note {cmd.Note.Id} not found", cmd.Note.Id);

                if (!noteToUpdate.CreatingTeamMemberId.Equals(cmd.Note.CreatedBy.Id, StringComparison.Ordinal) || noteToUpdate.AddedOn < DateTime.UtcNow.AddHours(-24))
                    throw new BusinessLogicException($"The note may be edited only by the user who created it withing a 24 hour period.");
            }

            var note = mapper.Map<Resources.Evacuations.Note>(cmd.Note);
            var id = (await evacuationRepository.Manage(new SaveEvacuationFileNote { FileId = cmd.FileId, Note = note })).Id;
            return id;
        }

        public async Task<string> Handle(ChangeNoteStatusCommand cmd)
        {
            if (string.IsNullOrEmpty(cmd.FileId)) throw new ArgumentNullException("FileId is required");
            if (string.IsNullOrEmpty(cmd.NoteId)) throw new ArgumentNullException("NoteId is required");

            var file = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery
            {
                FileId = cmd.FileId,
            })).Items.SingleOrDefault();
            if (file == null) throw new NotFoundException($"Evacuation File {cmd.FileId} not found", cmd.FileId);

            var note = file.Notes.SingleOrDefault(n => n.Id == cmd.NoteId);
            if (note == null) throw new NotFoundException($"Evacuation File Note {cmd.NoteId} not found", cmd.NoteId);

            note.IsHidden = cmd.IsHidden;
            var id = (await evacuationRepository.Manage(new SaveEvacuationFileNote { FileId = cmd.FileId, Note = note })).Id;
            return id;
        }

        public async Task<TasksSearchQueryResult> Handle(TasksSearchQuery query)
        {
            var esstask = (await taskRepository.QueryTask(new TaskQuery
            {
                ById = query.TaskId
            })).Items;
            var esstasks = mapper.Map<IEnumerable<IncidentTask>>(esstask);

            return new TasksSearchQueryResult { Items = esstasks };
        }

        public async Task<string> Handle(ProcessSupportsCommand cmd)
        {
            if (string.IsNullOrEmpty(cmd.FileId)) throw new ArgumentNullException(nameof(cmd.FileId));
            if (string.IsNullOrEmpty(cmd.RequestingUserId)) throw new ArgumentNullException(nameof(cmd.RequestingUserId));

            var requestingUser = (await teamRepository.GetMembers(userId: cmd.RequestingUserId, includeStatuses: activeOnlyStatus)).SingleOrDefault();
            if (requestingUser == null) throw new BusinessValidationException($"User {cmd.RequestingUserId} not found");

            foreach (var support in cmd.Supports)
            {
                support.CreatedBy = new Shared.Contracts.Events.TeamMember { Id = requestingUser.Id };
                support.CreatedOn = DateTime.UtcNow;
            }

            var validationResponse = (DigitalSupportsValidationResponse)await supportingEngine.Validate(new DigitalSupportsValidationRequest
            {
                FileId = cmd.FileId,
                Supports = cmd.Supports
            });
            if (!validationResponse.IsValid) throw new BusinessValidationException(string.Join(',', validationResponse.Errors));

            var response = (ProcessDigitalSupportsResponse)await supportingEngine.Process(new ProcessDigitalSupportsRequest
            {
                FileId = cmd.FileId,
                Supports = cmd.Supports,
                RequestingUserId = requestingUser.Id,
                IncludeSummaryInReferralsPrintout = cmd.IncludeSummaryInReferralsPrintout
            });

            return response.PrintRequestId;
        }

        public async System.Threading.Tasks.Task Handle(ProcessPaperSupportsCommand cmd)
        {
            if (string.IsNullOrEmpty(cmd.FileId)) throw new ArgumentNullException(nameof(cmd.FileId));
            if (string.IsNullOrEmpty(cmd.RequestingUserId)) throw new ArgumentNullException(nameof(cmd.RequestingUserId));

            var requestingUser = (await teamRepository.GetMembers(userId: cmd.RequestingUserId, includeStatuses: activeOnlyStatus)).SingleOrDefault();
            if (requestingUser == null) throw new BusinessValidationException($"User {cmd.RequestingUserId} not found");

            foreach (var referral in cmd.Supports)
            {
                referral.CreatedBy = new Shared.Contracts.Events.TeamMember { Id = requestingUser.Id };
                referral.CreatedOn = DateTime.UtcNow;
            }

            var validationResponse = (PaperSupportsValidationResponse)await supportingEngine.Validate(new PaperSupportsValidationRequest
            {
                FileId = cmd.FileId,
                Supports = cmd.Supports
            });
            if (!validationResponse.IsValid) throw new BusinessValidationException(string.Join(',', validationResponse.Errors));

            await supportingEngine.Process(new ProcessPaperSupportsRequest { FileId = cmd.FileId, Supports = cmd.Supports });
        }

        public async Task<string> Handle(VoidSupportCommand cmd)
        {
            if (string.IsNullOrEmpty(cmd.FileId)) throw new ArgumentNullException("FileId is required");
            if (string.IsNullOrEmpty(cmd.SupportId)) throw new ArgumentNullException("SupportId is required");

            var id = ((ChangeSupportStatusCommandResult)await supportRepository.Manage(new ChangeSupportStatusCommand
            {
                Items = new[]
                {
                    SupportStatusTransition.VoidSupport(cmd.SupportId, Enum.Parse<Resources.Supports.SupportVoidReason>(cmd.VoidReason.ToString()))
                }
            })).Ids.SingleOrDefault();
            return id;
        }

        public async Task<string> Handle(CancelSupportCommand cmd)
        {
            if (string.IsNullOrEmpty(cmd.FileId)) throw new ArgumentNullException("FileId is required");
            if (string.IsNullOrEmpty(cmd.SupportId)) throw new ArgumentNullException("SupportId is required");

            // check invariants
            var support = ((SearchSupportQueryResult)await supportRepository.Query(new Resources.Supports.SearchSupportsQuery { ById = cmd.SupportId })).Items.SingleOrDefault();
            if (support == null) throw new NotFoundException($"Support {cmd.SupportId} not found");
            if (support.SupportDelivery is not Resources.Supports.ETransfer) throw new BusinessValidationException($"Support {cmd.SupportId} is not an etransfer and cannot be cancelled");
            var relatedPayments = ((SearchPaymentResponse)await paymentRepository.Query(new SearchPaymentRequest { ByLinkedSupportId = cmd.SupportId })).Items;
            if (relatedPayments.Any()) throw new BusinessValidationException($"Support {cmd.SupportId} already has associated payments");

            var id = ((ChangeSupportStatusCommandResult)await supportRepository.Manage(new ChangeSupportStatusCommand
            {
                Items = new[]
                {
                   new SupportStatusTransition { SupportId = cmd.SupportId, ToStatus = Resources.Supports.SupportStatus.Cancelled, Reason = cmd.Reason }
                }
            })).Ids.SingleOrDefault();
            return id;
        }

        public async Task<SuppliersListQueryResponse> Handle(SuppliersListQuery query)
        {
            var task = (EssTask)(await taskRepository.QueryTask(new TaskQuery { ById = query.TaskId })).Items.SingleOrDefault();
            if (task == null) throw new NotFoundException($"Task not found", query.TaskId);
            var team = (await teamRepository.QueryTeams(new TeamQuery { AssignedCommunityCode = task.CommunityCode })).Items.SingleOrDefault();
            if (team == null) return new SuppliersListQueryResponse { Items = Array.Empty<SupplierDetails>() };
            var suppliers = (await supplierRepository.QuerySupplier(new SuppliersByTeamQuery { TeamId = team.Id })).Items;

            return new SuppliersListQueryResponse { Items = mapper.Map<IEnumerable<SupplierDetails>>(suppliers) };
        }

        public async Task<PrintRequestQueryResult> Handle(PrintRequestQuery query)
        {
            if (string.IsNullOrEmpty(query.PrintRequestId)) throw new ArgumentNullException(nameof(query.PrintRequestId));
            if (string.IsNullOrEmpty(query.RequestingUserId)) throw new ArgumentNullException(nameof(query.RequestingUserId));

            //get the print request
            var printRequest = (await printingRepository.Query(new QueryPrintRequests { ById = query.PrintRequestId })).Cast<ReferralPrintRequest>().SingleOrDefault();
            if (printRequest == null) throw new NotFoundException("print request not found", query.PrintRequestId);

            //get requesting user
            if (printRequest.RequestingUserId != query.RequestingUserId) throw new BusinessLogicException($"User {query.RequestingUserId} cannot query print for another user ({printRequest.RequestingUserId})");
            var requestingUser = mapper.Map<Shared.Contracts.Events.TeamMember>((await teamRepository.GetMembers(userId: printRequest.RequestingUserId, includeStatuses: activeOnlyStatus)).SingleOrDefault());
            if (requestingUser == null) throw new NotFoundException($"User {printRequest.RequestingUserId} not found", printRequest.RequestingUserId);

            //load the file
            var file = mapper.Map<Shared.Contracts.Events.EvacuationFile>((await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery
            {
                FileId = printRequest.FileId
            })).Items.SingleOrDefault());
            if (file == null) throw new NotFoundException($"Evacuation file {printRequest.FileId} not found", printRequest.Id);

            var evacuee = (await evacueesRepository.Query(new EvacueeQuery { EvacueeId = file.PrimaryRegistrantId })).Items.SingleOrDefault();

            if (evacuee == null) throw new NotFoundException($"Registrant not found '{file.PrimaryRegistrantId}'", file.PrimaryRegistrantId);

            var ct = new CancellationTokenSource().Token;
            await evacuationFileLoader.Load(file, ct);

            //Find referrals to print
            var referrals = file.Supports.Where(s => printRequest.SupportIds.Contains(s.Id)).ToArray();
            if (referrals.Length != printRequest.SupportIds.Count())
                throw new BusinessLogicException($"Print request {printRequest.Id} has {printRequest.SupportIds.Count()} linked supports, but evacuation file {printRequest.FileId} doesn't have all of them");

            var isProduction = env.IsProduction();

            //convert referrals to html
            var generatedReferrals = (GenerateReferralsResponse)await supportingEngine.Generate(new GenerateReferralsRequest()
            {
                File = file,
                Supports = referrals,
                AddSummary = printRequest.IncludeSummary,
                AddWatermark = !isProduction,
                PrintingMember = requestingUser,
                evacuee = evacuee
            });

            var content = generatedReferrals.Content;
            var contentType = "text/html";

            await printingRepository.Manage(new MarkPrintRequestAsComplete { PrintRequestId = printRequest.Id });

            return new PrintRequestQueryResult
            {
                Content = content,
                ContentType = contentType,
                PrintedOn = printRequest.CreatedOn
            };
        }

        public async Task<string> Handle(ReprintSupportCommand cmd)
        {
            if (string.IsNullOrEmpty(cmd.FileId)) throw new ArgumentNullException(nameof(cmd.FileId));
            if (string.IsNullOrEmpty(cmd.RequestingUserId)) throw new ArgumentNullException(nameof(cmd.RequestingUserId));
            if (string.IsNullOrEmpty(cmd.SupportId)) throw new ArgumentNullException(nameof(cmd.SupportId));

            var requestingUser = (await teamRepository.GetMembers(userId: cmd.RequestingUserId, includeStatuses: activeOnlyStatus)).Single();

            var now = DateTime.UtcNow;
            var referralPrintId = await printingRepository.Manage(new SavePrintRequest
            {
                PrintRequest = new ReferralPrintRequest
                {
                    FileId = cmd.FileId,
                    SupportIds = new[] { cmd.SupportId },
                    IncludeSummary = cmd.IncludeSummary,
                    RequestingUserId = requestingUser.Id,
                    Type = ReferralPrintType.Reprint,
                    Comments = cmd.ReprintReason,
                    Title = $"referral-{cmd.SupportId}-{now:yyyyMMddhhmmss:R}"
                }
            });

            return referralPrintId;
        }

        public async Task<string> Handle(InviteRegistrantCommand cmd)
        {
            var evacuee = (await evacueesRepository.Query(new EvacueeQuery { EvacueeId = cmd.RegistrantId })).Items.SingleOrDefault();
            if (evacuee == null) throw new NotFoundException($"registrant not found", cmd.RegistrantId);
            if (evacuee.Authenticated == true) throw new BusinessLogicException($"registrant {cmd.RegistrantId} is already authenticated");

            var inviteId = (await invitationRepository.Manage(new CreateNewEmailInvitation
            {
                EvacueeId = cmd.RegistrantId,
                Email = cmd.Email,
                InviteDate = DateTime.UtcNow,
                RequestingUserId = cmd.RequestingUserId
            })).InviteId;

            var invite = (await invitationRepository.Query(new EmailInvitationQuery { InviteId = inviteId })).Items.Single();
            var dp = dataProtectionProvider.CreateProtector(nameof(InviteRegistrantCommand)).ToTimeLimitedDataProtector();
            var encryptedInviteId = dp.Protect(inviteId, invite.ExpiryDate);
            await SendEmailNotification(
                SubmissionTemplateType.InviteProfile,
                email: cmd.Email,
                name: $"{evacuee.LastName}, {evacuee.FirstName}",
                tokens: new[]
                {
                    KeyValuePair.Create("inviteExpiryDate", invite.ExpiryDate.ToShortDateString()),
                    KeyValuePair.Create("inviteUrl", $"{configuration.GetValue<string>("REGISTRANTS_PORTAL_BASE_URL")}/verified-registration?inviteId={WebUtility.UrlEncode(encryptedInviteId)}")
                });

            return inviteId;
        }

        public async Task<string> Handle(ProcessRegistrantInviteCommand cmd)
        {
            if (string.IsNullOrEmpty(cmd.InviteId)) throw new ArgumentNullException(nameof(cmd.InviteId));
            if (string.IsNullOrEmpty(cmd.LoggedInUserId)) throw new ArgumentNullException(nameof(cmd.LoggedInUserId));

            var dp = dataProtectionProvider.CreateProtector(nameof(InviteRegistrantCommand)).ToTimeLimitedDataProtector();
            var inviteId = WebUtility.UrlDecode(dp.Unprotect(cmd.InviteId));
            var invite = (await invitationRepository.Query(new EmailInvitationQuery { InviteId = inviteId })).Items.SingleOrDefault();
            if (invite == null) throw new NotFoundException($"invite not found", inviteId);

            var registrantId = invite.EvacueeId;

            // get evacuee record
            var evacuee = (await evacueesRepository.Query(new EvacueeQuery { EvacueeId = registrantId })).Items.SingleOrDefault();
            if (evacuee == null) throw new NotFoundException($"registrant not found", registrantId);
            if (evacuee.UserId != null) throw new BusinessLogicException($"registrant {evacuee.Id} is already associated with user id {evacuee.UserId}");

            // validate the user id is not already in use
            var evacueeWithUserId = (await evacueesRepository.Query(new EvacueeQuery { UserId = cmd.LoggedInUserId })).Items.SingleOrDefault();
            if (evacueeWithUserId != null) throw new BusinessLogicException($"registrant {evacueeWithUserId.Id} is already associated with user id {evacueeWithUserId.UserId}");

            // associate the evacauee with the user id and mark as verified and authenticated
            evacuee.UserId = cmd.LoggedInUserId;
            evacuee.Authenticated = true;
            evacuee.Verified = true;
            var evacueeId = (await evacueesRepository.Manage(new SaveEvacuee { Evacuee = evacuee })).EvacueeId;

            // mark invite as used
            await invitationRepository.Manage(new CompleteInvitation { InviteId = invite.InviteId });

            return evacueeId;
        }

        public async Task<SearchSupportsQueryResponse> Handle(Shared.Contracts.Events.SearchSupportsQuery query)
        {
            if (string.IsNullOrEmpty(query.ManualReferralId) && string.IsNullOrEmpty(query.FileId))
                throw new BusinessValidationException($"Search supports must have criteria");

            var supports = mapper.Map<IEnumerable<Shared.Contracts.Events.Support>>(((SearchSupportQueryResult)await supportRepository.Query(new Resources.Supports.SearchSupportsQuery
            {
                ByManualReferralId = query.ManualReferralId,
                ByEvacuationFileId = query.FileId
            })).Items);

            var ct = new CancellationTokenSource().Token;
            await Parallel.ForEachAsync(supports, ct, async (s, ct) => await evacuationFileLoader.Load(s, ct));
            return new SearchSupportsQueryResponse
            {
                Items = supports
            };
        }

        public async System.Threading.Tasks.Task Handle(ProcessPendingSupportsCommand _)
        {
            var logger = telemetryProvider.Get(nameof(ProcessPendingSupportsCommand));
            var ct = new CancellationTokenSource().Token;

            var foundSupports = true;
            //handle limited number of pending support at a time
            while (foundSupports)
            {
                // get all pending scan supports
                var pendingScanSupports = ((SearchSupportQueryResult)await supportRepository.Query(new Resources.Supports.SearchSupportsQuery
                {
                    ByStatus = Resources.Supports.SupportStatus.PendingScan,
                    LimitNumberOfResults = 20
                })).Items.ToArray();

                foundSupports = pendingScanSupports.Any();

                if (foundSupports)
                {
                    logger.LogInformation("Found {0} pending scan supports", pendingScanSupports.Length);
                    // scan and get flags
                    var response = (CheckSupportComplianceResponse)await supportingEngine.Validate(new CheckSupportComplianceRequest
                    {
                        Supports = mapper.Map<IEnumerable<Shared.Contracts.Events.Support>>(pendingScanSupports)
                    });

                    await Parallel.ForEachAsync(response.Flags, ct, async (sf, ct) =>
                    {
                        try
                        {
                            var currentSupport = ((SearchSupportQueryResult)await supportRepository.Query(new Resources.Supports.SearchSupportsQuery
                            {
                                ById = sf.Key.Id
                            })).Items.SingleOrDefault();
                            var task = (EssTask)(await taskRepository.QueryTask(new TaskQuery { ById = currentSupport.TaskId })).Items.SingleOrDefault();
                            var flags = mapper.Map<IEnumerable<Resources.Supports.SupportFlag>>(sf.Value);

                            await supportRepository.Manage(new SubmitSupportForApprovalCommand
                            {
                                SupportId = currentSupport.Id,
                                Flags = flags
                            });

                            if (!flags.Any() && task.AutoApprovedEnabled)
                            {
                                await supportRepository.Manage(new ApproveSupportCommand
                                {
                                    SupportId = currentSupport.Id
                                });
                            }
                        }
                        catch (Exception e)
                        {
                            logger.LogError(e, "Failed to process pending support {0}", sf.Key.Id);
                        }
                    });
                }
            }
        }

        public async System.Threading.Tasks.Task Handle(ProcessApprovedSupportsCommand _)
        {
            var logger = telemetryProvider.Get(nameof(ProcessApprovedSupportsCommand));
            var foundSupports = true;
            while (foundSupports)
            {
                var approvedSupports = ((PendingPaymentSupportSearchResponse)await searchEngine.Search(new PendingPaymentSupportSearchRequest())).Supports.ToArray();

                foundSupports = approvedSupports.Any();

                if (foundSupports)
                {
                    logger.LogInformation("Found {0} approved supports", approvedSupports.Length);
                    var payments = ((GeneratePaymentsResponse)await supportingEngine.Generate(new GeneratePaymentsRequest
                    {
                        Supports = approvedSupports.Select(s => new Engines.Supporting.PayableSupport
                        {
                            Amount = s.Amount,
                            FileId = s.FileId,
                            SupportId = s.SupportId,
                            PayeeId = s.PayeeId,
                            Delivery = s.Delivery is PayableSupportInteracDelivery d
                                ? new PaymentDelivery
                                {
                                    NotificationEmail = d.NotificationEmail,
                                    NotificationPhone = d.NotificationPhone,
                                    RecipientFirstName = d.RecipientFirstName,
                                    RecipientLastName = d.RecipientLastName
                                }
                                : null
                        }).ToArray()
                    })).Payments.ToArray();

                    logger.LogInformation("Generating {0} payments", payments.Length);

                    foreach (var payment in payments)
                    {
                        await paymentRepository.Manage(new CreatePaymentRequest { Payment = payment });
                    }
                }
            }
        }

        public async System.Threading.Tasks.Task Handle(ProcessPendingPaymentsCommand _)
        {
            var logger = telemetryProvider.Get(nameof(ProcessPendingPaymentsCommand));
            var ct = new CancellationTokenSource().Token;

            var newPayments = ((SearchPaymentResponse)await paymentRepository.Query(new SearchPaymentRequest
            {
                ByStatus = PaymentStatus.Created,
                ByQueueStatus = QueueStatus.Pending,
            })).Items.Cast<InteracSupportPayment>().ToArray();

            logger.LogInformation("Found {0} new payments", newPayments.Length);

            if (newPayments.Any())
            {
                var casBatchName = $"ERA-batch-{DateTime.Now.ToString("yyyyMMddhhmmss")}";
                var result = (IssuePaymentsBatchResponse)await paymentRepository.Manage(new IssuePaymentsBatchRequest
                {
                    BatchId = casBatchName,
                    PaymentIds = newPayments.Select(p => p.Id)
                });

                logger.LogInformation("Batch {0} results: {1} issued; {2} failed", casBatchName, result.IssuedPayments.Count(), result.FailedPayments.Count());
            }

            var failedPayments = ((SearchPaymentResponse)await paymentRepository.Query(new SearchPaymentRequest
            {
                ByStatus = PaymentStatus.Failed,
                ByQueueStatus = QueueStatus.Pending,
            })).Items.Cast<InteracSupportPayment>().ToArray();

            logger.LogInformation("Found {0} failed payments", failedPayments.Length);
            await Parallel.ForEachAsync(failedPayments, ct, async (payment, ct) =>
            {
                try
                {
                    await paymentRepository.Manage(new CancelPaymentRequest { PaymentId = payment.Id, Reason = payment.FailureReason });
                    await Parallel.ForEachAsync(payment.LinkedSupportIds, ct, async (supportId, ct) =>
                    {
                        try
                        {
                            await supportRepository.Manage(new SubmitSupportForReviewCommand { SupportId = supportId });
                        }
                        catch (Exception e)
                        {
                            logger.LogError(e, "Payment {0}, support {1}: failed to submit for review", payment.Id, supportId);
                        }
                    });
                }
                catch (Exception e)
                {
                    logger.LogError(e, "Failed to cancel payment {0}", payment.Id);
                }
            });

            var issuedPayments = ((SearchPaymentResponse)await paymentRepository.Query(new SearchPaymentRequest
            {
                ByStatus = PaymentStatus.Issued,
                ByQueueStatus = QueueStatus.Pending,
            })).Items.Cast<InteracSupportPayment>().ToArray();

            logger.LogInformation("Found {0} issued payments", issuedPayments.Length);
            await Parallel.ForEachAsync(issuedPayments, ct, async (payment, ct) =>
            {
                try
                {
                    await paymentRepository.Manage(new MarkPaymentAsIssuedRequest { PaymentId = payment.Id });
                    await supportRepository.Manage(new ChangeSupportStatusCommand
                    {
                        Items = payment.LinkedSupportIds.Select(s => new SupportStatusTransition { SupportId = s, ToStatus = Resources.Supports.SupportStatus.Issued }).ToArray()
                    });
                }
                catch (Exception e)
                {
                    logger.LogError(e, "payment {0}: failed to transition related supports to status Issued", payment.Id);
                }
            });

            var clearedPayments = ((SearchPaymentResponse)await paymentRepository.Query(new SearchPaymentRequest
            {
                ByStatus = PaymentStatus.Cleared,
                ByQueueStatus = QueueStatus.Pending,
            })).Items.Cast<InteracSupportPayment>().ToArray();

            logger.LogInformation("Found {0} cleared payments", clearedPayments.Length);
            await Parallel.ForEachAsync(clearedPayments, ct, async (payment, ct) =>
            {
                try
                {
                    await paymentRepository.Manage(new MarkPaymentAsPaidRequest { PaymentId = payment.Id });
                    await supportRepository.Manage(new ChangeSupportStatusCommand
                    {
                        Items = payment.LinkedSupportIds.Select(s => new SupportStatusTransition { SupportId = s, ToStatus = Resources.Supports.SupportStatus.Paid }).ToArray()
                    });
                }
                catch (Exception e)
                {
                    logger.LogError(e, "payment{0}: failed to mark as paid", payment.Id);
                }
            });
        }

        public async System.Threading.Tasks.Task Handle(ReconcilePaymentsCommand _)
        {
            var ct = new CancellationTokenSource().Token;
            var logger = telemetryProvider.Get(nameof(ReconcilePaymentsCommand));
            var lastPollDate = await CalculateEarliestDateForPolling(ct);
            logger.LogInformation($"Polling for CAS payments after {lastPollDate}");

            var issuedPayments = ((GetCasPaymentStatusResponse)await paymentRepository.Query(new GetCasPaymentStatusRequest
            {
                ChangedFrom = lastPollDate,
                InStatus = CasPaymentStatus.Pending
            })).Payments.ToArray();

            await Parallel.ForEachAsync(issuedPayments, ct, async (paymentDetails, ct) =>
             {
                 try
                 {
                     await paymentRepository.Manage(new ProcessCasPaymentReconciliationStatusRequest { CasPaymentDetails = paymentDetails });
                 }
                 catch (Exception e)
                 {
                     logger.LogError(e, $"Failed to reconcile issued payment {paymentDetails.PaymentId}: {e.Message}");
                 }
             });

            var clearedPayments = ((GetCasPaymentStatusResponse)await paymentRepository.Query(new GetCasPaymentStatusRequest
            {
                ChangedFrom = lastPollDate,
                InStatus = CasPaymentStatus.Cleared
            })).Payments.ToArray();

            await Parallel.ForEachAsync(clearedPayments, ct, async (paymentDetails, ct) =>
            {
                try
                {
                    await paymentRepository.Manage(new ProcessCasPaymentReconciliationStatusRequest { CasPaymentDetails = paymentDetails });
                }
                catch (Exception e)
                {
                    logger.LogError(e, $"Failed to reconcile cleared payment {paymentDetails.PaymentId}: {e.Message}");
                }
            });

            var failedPayments = ((GetCasPaymentStatusResponse)await paymentRepository.Query(new GetCasPaymentStatusRequest
            {
                ChangedFrom = lastPollDate,
                InStatus = CasPaymentStatus.Failed
            })).Payments.ToArray();

            await Parallel.ForEachAsync(failedPayments, ct, async (paymentDetails, ct) =>
            {
                try
                {
                    await paymentRepository.Manage(new ProcessCasPaymentReconciliationStatusRequest { CasPaymentDetails = paymentDetails });
                }
                catch (Exception e)
                {
                    logger.LogError(e, $"Failed to reconcile failed payment {paymentDetails.PaymentId}: {e.Message}");
                }
            });

            // set the last poll time to -5 mins to account for system clock differences
            var nextPollDate = DateTime.SpecifyKind(DateTime.UtcNow.AddMinutes(-5), DateTimeKind.Utc);
            await cache.Set(paymentPollingCacheKey, nextPollDate, TimeSpan.FromDays(7), ct);

            logger.LogInformation("Reconciled {0} issued payments, {1} failed payments, {2} cleared payments; set last polling date to {3} UTC",
                issuedPayments.Length,
                clearedPayments.Length,
                failedPayments.Length,
                nextPollDate);
        }

        private const string paymentPollingCacheKey = "CASPollDate";

        private async Task<DateTime> CalculateEarliestDateForPolling(CancellationToken ct)
        {
            var lastPollDate = await cache.Get<DateTime?>(paymentPollingCacheKey, ct);
            if (lastPollDate.HasValue) return lastPollDate.Value;

            var earliestSentPayment = ((SearchPaymentResponse)await paymentRepository.Query(new SearchPaymentRequest
            {
                ByStatus = PaymentStatus.Sent,
                ByQueueStatus = QueueStatus.None,
                LimitNumberOfItems = 1,
            })).Items.Cast<InteracSupportPayment>().FirstOrDefault();

            // calculate date of last status update: the earliest date of the payments in status 'Sent'
            lastPollDate = earliestSentPayment?.SentOn ?? new DateTime(2022, 6, 7);

            return lastPollDate.Value;
        }
    }
}
