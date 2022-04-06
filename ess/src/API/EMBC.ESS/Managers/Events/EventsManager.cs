using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Engines.Search;
using EMBC.ESS.Engines.Supporting;
using EMBC.ESS.Managers.Events.Notifications;
using EMBC.ESS.Resources.Evacuations;
using EMBC.ESS.Resources.Evacuees;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Resources.Print;
using EMBC.ESS.Resources.Suppliers;
using EMBC.ESS.Resources.Supports;
using EMBC.ESS.Resources.Tasks;
using EMBC.ESS.Resources.Teams;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Utilities.PdfGenerator;
using EMBC.Utilities.Extensions;
using EMBC.Utilities.Notifications;
using EMBC.Utilities.Transformation;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;

namespace EMBC.ESS.Managers.Events
{
    public class EventsManager
    {
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
        private readonly IPdfGenerator pdfGenerator;
        private readonly IMetadataRepository metadataRepository;
        private readonly IDataProtectionProvider dataProtectionProvider;
        private readonly IConfiguration configuration;
        private readonly ISupportingEngine supportingEngine;
        private readonly EvacuationFileLoader evacuationFileLoader;
        private readonly IWebHostEnvironment env;
        private static TeamMemberStatus[] activeOnlyStatus = new[] { TeamMemberStatus.Active };

        public EventsManager(
            IMapper mapper,
            IEvacueesRepository contactRepository,
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
            IPdfGenerator pdfGenerator,
            IWebHostEnvironment env,
            IMetadataRepository metadataRepository,
            IDataProtectionProvider dataProtectionProvider,
            IConfiguration configuration,
            ISupportingEngine supportingEngine)
        {
            this.mapper = mapper;
            this.evacueesRepository = contactRepository;
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
            this.pdfGenerator = pdfGenerator;
            this.metadataRepository = metadataRepository;
            this.dataProtectionProvider = dataProtectionProvider;
            this.configuration = configuration;
            this.supportingEngine = supportingEngine;
            this.env = env;
            evacuationFileLoader = new EvacuationFileLoader(mapper, teamRepository, taskRepository, supplierRepository, supportRepository, evacueesRepository);
        }

        public async Task<string> Handle(SubmitAnonymousEvacuationFileCommand cmd)
        {
            var file = mapper.Map<Resources.Evacuations.EvacuationFile>(cmd.File);
            var contact = mapper.Map<Evacuee>(cmd.SubmitterProfile);

            file.PrimaryRegistrantId = (await evacueesRepository.Manage(new SaveEvacuee { Evacuee = contact })).EvacueeId;
            file.NeedsAssessment.HouseholdMembers.Where(m => m.IsPrimaryRegistrant).Single().LinkedRegistrantId = file.PrimaryRegistrantId;

            var caseId = (await evacuationRepository.Manage(new SubmitEvacuationFileNeedsAssessment { EvacuationFile = file })).Id;

            if (contact.Email != null)
            {
                await SendEmailNotification(
                    SubmissionTemplateType.NewAnonymousEvacuationFileSubmission,
                    email: contact.Email,
                    name: $"{contact.LastName}, {contact.FirstName}",
                    tokens: new[] { KeyValuePair.Create("fileNumber", caseId) });
            }

            return caseId;
        }

        public async Task<string> Handle(SubmitEvacuationFileCommand cmd)
        {
            var file = mapper.Map<Resources.Evacuations.EvacuationFile>(cmd.File);

            var query = new EvacueeQuery();
            //TODO: replace this with an explicit property for userid
            if (Guid.TryParse(file.PrimaryRegistrantId, out var _))
            {
                query.EvacueeId = file.PrimaryRegistrantId;
            }
            else
            {
                query.UserId = file.PrimaryRegistrantId;
            }

            var contact = (await evacueesRepository.Query(query)).Items.SingleOrDefault();

            if (contact == null) throw new NotFoundException($"Registrant not found '{file.PrimaryRegistrantId}'", file.PrimaryRegistrantId);
            file.PrimaryRegistrantId = contact.Id;

            if (!string.IsNullOrEmpty(file.Id))
            {
                var caseRecord = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery { FileId = file.Id })).Items.SingleOrDefault();
                var existingFile = mapper.Map<Resources.Evacuations.EvacuationFile>(caseRecord);

                if (!string.IsNullOrEmpty(existingFile.TaskId) && !existingFile.TaskId.Equals(file.TaskId, StringComparison.Ordinal))
                    throw new BusinessLogicException($"The ESS Task Number cannot be modified or updated once it's been initially assigned.");
            }

            var caseId = (await evacuationRepository.Manage(new SubmitEvacuationFileNeedsAssessment { EvacuationFile = file })).Id;

            if (string.IsNullOrEmpty(file.Id) && !string.IsNullOrEmpty(contact.Email))
            {
                //notify registrant of the new file and has email
                await SendEmailNotification(
                    SubmissionTemplateType.NewEvacuationFileSubmission,
                    email: contact.Email,
                    name: $"{contact.LastName}, {contact.FirstName}",
                    tokens: new[] { KeyValuePair.Create("fileNumber", caseId) });
            }

            return caseId;
        }

        public async Task<string> Handle(SaveRegistrantCommand cmd)
        {
            var contact = mapper.Map<Evacuee>(cmd.Profile);
            var result = await evacueesRepository.Manage(new SaveEvacuee { Evacuee = contact });

            if (string.IsNullOrEmpty(cmd.Profile.Id))
            {
                //send email when creating a new registrant profile
                if (contact.Email != null)
                {
                    await SendEmailNotification(
                        SubmissionTemplateType.NewProfileRegistration,
                        email: contact.Email,
                        name: $"{contact.LastName}, {contact.FirstName}",
                        tokens: Array.Empty<KeyValuePair<string, string>>());
                }
            }

            return result.EvacueeId;
        }

        public async Task<string> Handle(LinkRegistrantCommand cmd)
        {
            if (string.IsNullOrEmpty(cmd.RegistantId)) throw new ArgumentNullException("RegistantId is required");
            if (string.IsNullOrEmpty(cmd.HouseholdMemberId)) throw new ArgumentNullException("HouseholdMemberId is required");

            var caseRecord = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery { FileId = cmd.FileId })).Items.SingleOrDefault();
            var file = mapper.Map<Resources.Evacuations.EvacuationFile>(caseRecord);
            var member = file.HouseholdMembers.Where(m => m.Id == cmd.HouseholdMemberId).SingleOrDefault();
            if (member == null) throw new NotFoundException($"HouseholdMember not found '{cmd.HouseholdMemberId}'", cmd.HouseholdMemberId);

            var memberAlreadyLinked = file.HouseholdMembers.Where(m => m.LinkedRegistrantId == cmd.RegistantId).FirstOrDefault();
            if (memberAlreadyLinked != null) throw new BusinessValidationException($"There is already a HouseholdMember '{memberAlreadyLinked.Id}' linked to the Registrant '{cmd.RegistantId}'");

            var caseId = (await evacuationRepository.Manage(new LinkEvacuationFileRegistrant { FileId = file.Id, RegistrantId = cmd.RegistantId, HouseholdMemberId = cmd.HouseholdMemberId })).Id;
            return caseId;
        }

        public async Task<string> Handle(SetRegistrantVerificationStatusCommand cmd)
        {
            var contact = (await evacueesRepository.Query(new EvacueeQuery { EvacueeId = cmd.RegistrantId })).Items.SingleOrDefault();
            if (contact == null) throw new NotFoundException($"Could not find existing Registrant with id {cmd.RegistrantId}", cmd.RegistrantId);
            contact.Verified = cmd.Verified;
            var res = await evacueesRepository.Manage(new SaveEvacuee { Evacuee = contact });
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
            var contacts = (await evacueesRepository.Query(new EvacueeQuery
            {
                EvacueeId = query.Id,
                UserId = query.UserId
            })).Items;
            var registrants = mapper.Map<IEnumerable<RegistrantProfile>>(contacts);

            return new RegistrantsQueryResponse { Items = registrants.ToArray() };
        }

        public async Task<EvacuationFilesQueryResponse> Handle(Shared.Contracts.Events.EvacuationFilesQuery query)
        {
            if (!string.IsNullOrEmpty(query.PrimaryRegistrantUserId))
            {
                var registrant = (await evacueesRepository.Query(new EvacueeQuery { UserId = query.PrimaryRegistrantUserId })).Items.SingleOrDefault();
                if (registrant == null) throw new NotFoundException($"registrant with user id '{query.PrimaryRegistrantUserId}' not found", query.PrimaryRegistrantUserId);
                query.PrimaryRegistrantId = registrant.Id;
            }
            var cases = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery
            {
                FileId = query.FileId,
                ExternalReferenceId = query.ExternalReferenceId,
                PrimaryRegistrantId = query.PrimaryRegistrantId,
                LinkedRegistrantId = query.LinkedRegistrantId,
                NeedsAssessmentId = query.NeedsAssessmentId,
                IncludeFilesInStatuses = query.IncludeFilesInStatuses.Select(s => Enum.Parse<Resources.Evacuations.EvacuationFileStatus>(s.ToString())).ToArray()
            })).Items.Cast<Resources.Evacuations.EvacuationFile>();

            var files = mapper.Map<IEnumerable<Shared.Contracts.Events.EvacuationFile>>(cases);

            foreach (var file in files)
            {
                await evacuationFileLoader.Load(file);
            }

            return new EvacuationFilesQueryResponse { Items = files };
        }

        public async Task<EvacueeSearchQueryResponse> Handle(EvacueeSearchQuery query)
        {
            if (string.IsNullOrWhiteSpace(query.FirstName)) throw new ArgumentNullException(nameof(EvacueeSearchQuery.FirstName));
            if (string.IsNullOrWhiteSpace(query.LastName)) throw new ArgumentNullException(nameof(EvacueeSearchQuery.LastName));
            if (string.IsNullOrWhiteSpace(query.DateOfBirth)) throw new ArgumentNullException(nameof(EvacueeSearchQuery.DateOfBirth));
            if (query.InStatuses == null) query.InStatuses = Array.Empty<Shared.Contracts.Events.EvacuationFileStatus>();

            var searchMode = !query.IncludeEvacuationFilesOnly && query.IncludeRegistrantProfilesOnly
                ? SearchMode.Registrants
                : query.IncludeEvacuationFilesOnly && !query.IncludeRegistrantProfilesOnly
                    ? SearchMode.HouseholdMembers
                    : SearchMode.Both;

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

            await householdMemberTasks.Union(profileTasks).ToArray().ForEachAsync(5, t => t);

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

            foreach (var file in fileResults)
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
            }

            return new EvacueeSearchQueryResponse
            {
                Profiles = profileResults,
                EvacuationFiles = fileResults
            };
        }

        public async Task<VerifySecurityQuestionsResponse> Handle(VerifySecurityQuestionsQuery query)
        {
            var contact = (await evacueesRepository.Query(new EvacueeQuery { EvacueeId = query.RegistrantId, MaskSecurityAnswers = false })).Items.FirstOrDefault();

            if (contact == null) throw new NotFoundException($"registrant {query.RegistrantId} not found", query.RegistrantId);

            var numberOfCorrectAnswers = query.Answers
                .Select(a => contact.SecurityQuestions.Any(q => a.Answer.Equals(q.Answer, StringComparison.OrdinalIgnoreCase) && a.Answer.Equals(q.Answer, StringComparison.OrdinalIgnoreCase)))
                .Count(a => a);
            return new VerifySecurityQuestionsResponse { NumberOfCorrectAnswers = numberOfCorrectAnswers };
        }

        public async Task<VerifySecurityPhraseResponse> Handle(VerifySecurityPhraseQuery query)
        {
            var file = (await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery
            {
                FileId = query.FileId,
                MaskSecurityPhrase = false
            })).Items.Cast<Resources.Evacuations.EvacuationFile>().FirstOrDefault();

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
                })).Items.Cast<Resources.Evacuations.EvacuationFile>().SingleOrDefault();

                if (file == null) throw new NotFoundException($"Evacuation File {cmd.FileId} not found", cmd.FileId);

                var noteToUpdate = file.Notes.Where(n => n.Id == cmd.Note.Id).SingleOrDefault();

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
            })).Items.Cast<Resources.Evacuations.EvacuationFile>().SingleOrDefault();
            if (file == null) throw new NotFoundException($"Evacuation File {cmd.FileId} not found", cmd.FileId);

            var note = file.Notes.Where(n => n.Id == cmd.NoteId).SingleOrDefault();
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

            var requestingUser = (await teamRepository.GetMembers(userId: cmd.RequestingUserId, includeStatuses: activeOnlyStatus)).Cast<Resources.Teams.TeamMember>().SingleOrDefault();
            if (requestingUser == null) throw new BusinessValidationException($"User {cmd.RequestingUserId} not found");

            foreach (var support in cmd.Supports)
            {
                support.CreatedBy = new Shared.Contracts.Events.TeamMember { Id = requestingUser.Id };
                support.CreatedOn = DateTime.UtcNow;
            }

            var supports = mapper.Map<IEnumerable<Resources.Supports.Support>>(cmd.Supports);

            var validationResponse = (DigitalSupportsValidationResponse)await supportingEngine.Validate(new DigitalSupportsValidationRequest { FileId = cmd.FileId, Supports = cmd.Supports });
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

            var requestingUser = (await teamRepository.GetMembers(userId: cmd.RequestingUserId, includeStatuses: activeOnlyStatus)).Cast<Resources.Teams.TeamMember>().SingleOrDefault();
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
            var requestingUser = mapper.Map<Shared.Contracts.Events.TeamMember>((await teamRepository.GetMembers(userId: printRequest.RequestingUserId, includeStatuses: activeOnlyStatus)).Cast<Resources.Teams.TeamMember>().SingleOrDefault());
            if (requestingUser == null) throw new NotFoundException($"User {printRequest.RequestingUserId} not found", printRequest.RequestingUserId);

            //load the file
            var file = mapper.Map<Shared.Contracts.Events.EvacuationFile>((await evacuationRepository.Query(new Resources.Evacuations.EvacuationFilesQuery
            {
                FileId = printRequest.FileId
            })).Items.Cast<Resources.Evacuations.EvacuationFile>().SingleOrDefault());
            if (file == null) throw new NotFoundException($"Evacuation file {printRequest.FileId} not found", printRequest.Id);
            await evacuationFileLoader.Load(file);

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
                PrintingMember = requestingUser
            });

            //convert to pdf
            //var content = await pdfGenerator.Generate(generatedReferrals.Content);
            //var contentType = "application/pdf";

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

            var requestingUser = (await teamRepository.GetMembers(userId: cmd.RequestingUserId, includeStatuses: activeOnlyStatus)).Cast<Resources.Teams.TeamMember>().Single();

            var now = DateTime.UtcNow;
            var referralPrintId = await printingRepository.Manage(new SavePrintRequest
            {
                PrintRequest = new ReferralPrintRequest
                {
                    FileId = cmd.FileId,
                    SupportIds = new[] { cmd.SupportId },
                    IncludeSummary = false,
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
            if (evacuee.Authenticated) throw new BusinessLogicException($"registrant {cmd.RegistrantId} is already authenticated");

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

            // associate the contact with the user id and mark as verified and authenticated
            evacuee.UserId = cmd.LoggedInUserId;
            evacuee.Authenticated = true;
            evacuee.Verified = true;
            var contactId = (await evacueesRepository.Manage(new SaveEvacuee { Evacuee = evacuee })).EvacueeId;

            // mark invite as used
            await invitationRepository.Manage(new CompleteInvitation { InviteId = invite.InviteId });

            return contactId;
        }

        public async Task<SearchSupportsQueryResponse> Handle(Shared.Contracts.Events.SearchSupportsQuery query)
        {
            if (string.IsNullOrEmpty(query.ExternalReferenceId) && string.IsNullOrEmpty(query.FileId))
                throw new BusinessValidationException($"Search supports must have criteria");

            var supports = mapper.Map<IEnumerable<Shared.Contracts.Events.Support>>(((SearchSupportQueryResult)await supportRepository.Query(new Resources.Supports.SearchSupportsQuery
            {
                ByExternalReferenceId = query.ExternalReferenceId,
                ByEvacuationFileId = query.FileId
            })).Items);

            foreach (var support in supports)
            {
                await evacuationFileLoader.Load(support);
            }
            return new SearchSupportsQueryResponse
            {
                Items = supports
            };
        }

        public async System.Threading.Tasks.Task Handle(ProcessPendingSupportsCommand _)
        {
            var pendingScanSupports = ((SearchSupportQueryResult)await supportRepository.Query(new Resources.Supports.SearchSupportsQuery
            {
                ByStatus = Resources.Supports.SupportStatus.PendingScan
            })).Items;

            var response = (CheckSupportComplianceResponse)await supportingEngine.Validate(new CheckSupportComplianceRequest { Supports = mapper.Map<IEnumerable<Shared.Contracts.Events.Support>>(pendingScanSupports) });

            foreach (var support in response.Flags)
            {
                await supportRepository.Manage(new SetFlagsCommand
                {
                    SupportId = support.Key.Id,
                    Flags = mapper.Map<IEnumerable<Resources.Supports.SupportFlag>>(support.Value)
                });
                await supportRepository.Manage(new ChangeSupportStatusCommand
                {
                    Items = new[] { new SupportStatusTransition { SupportId = support.Key.Id, ToStatus = Resources.Supports.SupportStatus.PendingApproval } }
                });
            }
        }
    }
}
