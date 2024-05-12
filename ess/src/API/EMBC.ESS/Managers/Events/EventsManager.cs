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
using EMBC.ESS.Resources.Payments;
using EMBC.ESS.Resources.Print;
using EMBC.ESS.Resources.Suppliers;
using EMBC.ESS.Resources.Supports;
using EMBC.ESS.Resources.Tasks;
using EMBC.ESS.Resources.Teams;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.ESS.Utilities.Spatial;
using EMBC.Utilities.Caching;
using EMBC.Utilities.Notifications;
using EMBC.Utilities.Telemetry;
using EMBC.Utilities.Transformation;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace EMBC.ESS.Managers.Events;

public partial class EventsManager(
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
    IDataProtectionProvider dataProtectionProvider,
    IConfiguration configuration,
    ISupportingEngine supportingEngine,
    IPaymentRepository paymentRepository,
    ICache cache,
    ILocationService locationService,
    IUserRepository userRepository)
{
    private readonly EvacuationFileLoader evacuationFileLoader = new(mapper, teamRepository, taskRepository, supplierRepository, supportRepository, evacueesRepository, paymentRepository);
    private static TeamMemberStatus[] activeOnlyStatus = [TeamMemberStatus.Active];

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
        var ct = CancellationToken.None;
        var evacuee = mapper.Map<Evacuee>(cmd.Profile);

        Evacuee existingEvacuee = null;
        if (evacuee.Id == null && evacuee.UserId != null)
            existingEvacuee = (await evacueesRepository.Query(new EvacueeQuery { UserId = evacuee.UserId })).Items.SingleOrDefault();
        else if (evacuee.Id != null)
            existingEvacuee = (await evacueesRepository.Query(new EvacueeQuery { EvacueeId = evacuee.Id })).Items.SingleOrDefault();

        evacuee.Id ??= existingEvacuee?.Id;
        //fill last login for new registrants from registrants portal - need to split this command into separate use cases
        evacuee.LastLogin = evacuee.UserId != null && evacuee.LastLogin == null ? DateTime.UtcNow : null;

        var homeAddress = mapper.Map<Resources.Evacuees.Address>(cmd.Profile.HomeAddress);
        if (homeAddress != null)
        {
            var currentAddress = existingEvacuee?.GeocodedHomeAddress?.Address;
            var currentAddressScore = existingEvacuee?.GeocodedHomeAddress?.Geocode.Accuracy ?? 0;
            var geocode = await locationService.ResolveGeocode(new Location($"{homeAddress.AddressLine1}, {homeAddress.City}, {homeAddress.StateProvince}"), ct);

            //save geocoded address if different than existing addrss or if new
            if (homeAddress != currentAddress || geocode.Score != currentAddressScore)
            {
                evacuee.GeocodedHomeAddress = new GeocodedAddress
                {
                    Address = homeAddress,
                    Geocode = mapper.Map<AddressGeocode>(geocode)
                };
            }
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

    public async Task<SuppliersListQueryResponse> Handle(SuppliersListQuery query)
    {
        var task = (EssTask)(await taskRepository.QueryTask(new TaskQuery { ById = query.TaskId })).Items.SingleOrDefault();
        if (task == null) throw new NotFoundException($"Task not found", query.TaskId);
        var team = (await teamRepository.QueryTeams(new TeamQuery { AssignedCommunityCode = task.CommunityCode })).Items.SingleOrDefault();
        if (team == null) return new SuppliersListQueryResponse { Items = Array.Empty<SupplierDetails>() };
        var suppliers = (await supplierRepository.QuerySupplier(new SuppliersByTeamQuery { TeamId = team.Id })).Items;

        return new SuppliersListQueryResponse { Items = mapper.Map<IEnumerable<SupplierDetails>>(suppliers) };
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

    public async System.Threading.Tasks.Task Handle(RecordAuditAccessCommand cmd)
    {
        if (string.IsNullOrEmpty(cmd.RegistrantId) && string.IsNullOrEmpty(cmd.EvacuationFileNumber))
            throw new BusinessLogicException($"Audit must be for a registrant profile or evacuation file");

        await userRepository.RecordAccessAudit(new AccessAuditEntry
        {
            AccessReason = cmd.AccessReasonId,
            TeamMemberId = cmd.TeamMemberId,
            EvacuationFileNumber = cmd.EvacuationFileNumber,
            RegistrantId = cmd.RegistrantId
        });
    }
}
