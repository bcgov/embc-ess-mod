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
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Engines.Search;
using EMBC.ESS.Resources.Cases;
using EMBC.ESS.Resources.Contacts;
using EMBC.ESS.Resources.Tasks;
using EMBC.ESS.Resources.Team;
using EMBC.ESS.Shared.Contracts.Submissions;
using EMBC.ESS.Utilities.Extensions;
using EMBC.ESS.Utilities.Notifications;
using EMBC.ESS.Utilities.Transformation;

namespace EMBC.ESS.Managers.Submissions
{
    public class SubmissionsManager
    {
        private readonly IMapper mapper;
        private readonly IContactRepository contactRepository;
        private readonly ITemplateProviderResolver templateProviderResolver;
        private readonly ICaseRepository caseRepository;
        private readonly ITransformator transformator;
        private readonly INotificationSender notificationSender;
        private readonly ITaskRepository taskRepository;
        private readonly ITeamRepository teamRepository;
        private readonly ISearchEngine searchEngine;

        public SubmissionsManager(
            IMapper mapper,
            IContactRepository contactRepository,
            ITemplateProviderResolver templateProviderResolver,
            ICaseRepository caseRepository,
            ITransformator transformator,
            INotificationSender notificationSender,
            ITaskRepository taskRepository,
            ITeamRepository teamRepository,
            ISearchEngine searchEngine)
        {
            this.mapper = mapper;
            this.contactRepository = contactRepository;
            this.templateProviderResolver = templateProviderResolver;
            this.caseRepository = caseRepository;
            this.transformator = transformator;
            this.notificationSender = notificationSender;
            this.taskRepository = taskRepository;
            this.teamRepository = teamRepository;
            this.searchEngine = searchEngine;
        }

        public async Task<string> Handle(SubmitAnonymousEvacuationFileCommand cmd)
        {
            var file = mapper.Map<Resources.Cases.EvacuationFile>(cmd.File);
            var contact = mapper.Map<Contact>(cmd.SubmitterProfile);

            file.PrimaryRegistrantId = (await contactRepository.ManageContact(new SaveContact { Contact = contact })).ContactId;
            file.NeedsAssessment.HouseholdMembers.Where(m => m.IsPrimaryRegistrant).Single().LinkedRegistrantId = file.PrimaryRegistrantId;

            var caseId = (await caseRepository.ManageCase(new SaveEvacuationFile { EvacuationFile = file })).Id;

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
            var file = mapper.Map<Resources.Cases.EvacuationFile>(cmd.File);
            var contact = (await contactRepository.QueryContact(new RegistrantQuery { ContactId = file.PrimaryRegistrantId })).Items.SingleOrDefault();

            if (contact == null) throw new Exception($"Registrant not found '{file.PrimaryRegistrantId}'");

            var caseId = (await caseRepository.ManageCase(new SaveEvacuationFile { EvacuationFile = file })).Id;

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
            if (cmd.Profile.SecurityQuestions.Count() > 3) throw new Exception($"Registrant can have a max of 3 Security Questions");
            var contact = mapper.Map<Contact>(cmd.Profile);
            var result = await contactRepository.ManageContact(new SaveContact { Contact = contact });

            if (string.IsNullOrEmpty(cmd.Profile.Id))
            {
                //send email when creating a new registrant profile
                if (contact.Email != null)
                {
                    await SendEmailNotification(
                        SubmissionTemplateType.newProfileRegistration,
                        email: contact.Email,
                        name: $"{contact.LastName}, {contact.FirstName}",
                        tokens: Array.Empty<KeyValuePair<string, string>>());
                }
            }

            return result.ContactId;
        }

        public async Task<string> Handle(LinkRegistrantCommand cmd)
        {
            if (string.IsNullOrEmpty(cmd.RegistantId)) throw new ArgumentNullException("RegistantId is required");
            if (string.IsNullOrEmpty(cmd.HouseholdMemberId)) throw new ArgumentNullException("HouseholdMemberId is required");

            var caseRecord = (await caseRepository.QueryCase(new Resources.Cases.EvacuationFilesQuery { FileId = cmd.FileId })).Items.SingleOrDefault();
            var file = mapper.Map<Resources.Cases.EvacuationFile>(caseRecord);
            var member = file.HouseholdMembers.Where(m => m.Id == cmd.HouseholdMemberId).SingleOrDefault();

            if (member == null) throw new Exception($"HouseholdMember not found '{cmd.HouseholdMemberId}'");

            member.LinkedRegistrantId = cmd.RegistantId;
            var caseId = (await caseRepository.ManageCase(new SaveEvacuationFile { EvacuationFile = file })).Id;

            return caseId;
        }

        public async System.Threading.Tasks.Task Handle(DeleteRegistrantCommand cmd)
        {
            var contact = (await contactRepository.QueryContact(new RegistrantQuery { UserId = cmd.UserId })).Items.SingleOrDefault();
            if (contact == null) return;
            await contactRepository.ManageContact(new DeleteContact { ContactId = contact.Id });
        }

        public async Task<string> Handle(SetRegistrantVerificationStatusCommand cmd)
        {
            var contact = (await contactRepository.QueryContact(new RegistrantQuery { ContactId = cmd.RegistrantId })).Items.SingleOrDefault();
            if (contact == null) throw new Exception($"Couuld not find existing Registrant with id {cmd.RegistrantId}");
            contact.Verified = cmd.Verified;
            var res = await contactRepository.ManageContact(new SaveContact { Contact = contact });
            return res.ContactId;
        }

        private async System.Threading.Tasks.Task SendEmailNotification(SubmissionTemplateType notificationType, string email, string name, IEnumerable<KeyValuePair<string, string>> tokens)
        {
            var template = (EmailTemplate)await templateProviderResolver.Resolve(NotificationChannelType.Email).Get(notificationType);
            var emailContent = (await transformator.Transform(new TransformationData
            {
                Template = template.Content,
                Tokens = tokens
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
            var contacts = (await contactRepository.QueryContact(new RegistrantQuery
            {
                ContactId = query.Id,
                UserId = query.UserId
            })).Items;
            var registrants = mapper.Map<IEnumerable<RegistrantProfile>>(contacts);

            return new RegistrantsQueryResponse { Items = registrants.ToArray() };
        }

        public async Task<EvacuationFilesQueryResponse> Handle(Shared.Contracts.Submissions.EvacuationFilesQuery query)
        {
            if (!string.IsNullOrEmpty(query.PrimaryRegistrantUserId))
            {
                var registrant = (await contactRepository.QueryContact(new RegistrantQuery { UserId = query.PrimaryRegistrantUserId })).Items.SingleOrDefault();
                if (registrant == null) throw new Exception($"registrant with user id '{query.PrimaryRegistrantUserId}' not found");
                query.PrimaryRegistrantId = registrant.Id;
            }
            var cases = (await caseRepository.QueryCase(new Resources.Cases.EvacuationFilesQuery
            {
                FileId = query.FileId,
                PrimaryRegistrantId = query.PrimaryRegistrantId,
                LinkedRegistrantId = query.LinkedRegistrantId,
                IncludeFilesInStatuses = query.IncludeFilesInStatuses.Select(s => Enum.Parse<Resources.Cases.EvacuationFileStatus>(s.ToString())).ToArray()
            })).Items.Cast<Resources.Cases.EvacuationFile>();

            var files = mapper.Map<IEnumerable<Shared.Contracts.Submissions.EvacuationFile>>(cases);

            foreach (var file in files)
            {
                if (file.NeedsAssessment.CompletedBy?.Id != null)
                {
                    var member = (await teamRepository.GetMembers(userId: file.NeedsAssessment.CompletedBy.Id, onlyActive: false)).SingleOrDefault();
                    if (member != null)
                    {
                        file.NeedsAssessment.CompletedBy.DisplayName = $"{member.FirstName} {member.LastName.Substring(0, 1)}.";
                        file.NeedsAssessment.CompletedBy.TeamId = member.TeamId;
                        file.NeedsAssessment.CompletedBy.TeamName = member.TeamName;
                    }
                }
                if (file.RelatedTask?.Id != null)
                {
                    var task = (EssTask)(await taskRepository.QueryTask(new TaskQuery { ById = file.RelatedTask.Id })).Items.SingleOrDefault();
                    if (task != null) file.RelatedTask = mapper.Map<IncidentTask>(task);
                }
            }

            foreach (var note in files.SelectMany(c => c.Notes))
            {
                if (string.IsNullOrEmpty(note.CreatingTeamMemberId)) continue;
                var teamMembers = await teamRepository.GetMembers(null, null, note.CreatingTeamMemberId);
                var member = teamMembers.SingleOrDefault();
                if (member == null) continue;
                note.MemberName = $"{member.FirstName}, {member.LastName.Substring(0, 1)}";
                note.TeamId = member.TeamId;
                note.TeamName = member.TeamName;
            }

            return new EvacuationFilesQueryResponse { Items = files };
        }

        public async Task<EvacueeSearchQueryResponse> Handle(EvacueeSearchQuery query)
        {
            if (string.IsNullOrWhiteSpace(query.FirstName)) throw new ArgumentNullException(nameof(EvacueeSearchQuery.FirstName));
            if (string.IsNullOrWhiteSpace(query.LastName)) throw new ArgumentNullException(nameof(EvacueeSearchQuery.LastName));
            if (string.IsNullOrWhiteSpace(query.DateOfBirth)) throw new ArgumentNullException(nameof(EvacueeSearchQuery.DateOfBirth));
            if (query.InStatuses == null) query.InStatuses = Array.Empty<Shared.Contracts.Submissions.EvacuationFileStatus>();

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
            var profileTasks = searchResults.MatchingRegistrantIds.Select(async id =>
            {
                var profile = (await contactRepository.QueryContact(new RegistrantQuery { ContactId = id })).Items.Single();
                var files = (await caseRepository.QueryCase(new Resources.Cases.EvacuationFilesQuery { PrimaryRegistrantId = id })).Items;
                var mappedProfile = mapper.Map<ProfileSearchResult>(profile);
                mappedProfile.RecentEvacuationFiles = mapper.Map<IEnumerable<EvacuationFileSearchResult>>(files);
                profiles.Add(mappedProfile);
            });

            var files = new ConcurrentBag<EvacuationFileSearchResult>();
            var householdMemberTasks = searchResults.MatchingHouseholdMemberIds.Select(async id =>
            {
                var file = (await caseRepository.QueryCase(new Resources.Cases.EvacuationFilesQuery { HouseholdMemberId = id })).Items.SingleOrDefault();
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

            return new EvacueeSearchQueryResponse
            {
                Profiles = profileResults,
                EvacuationFiles = fileResults
            };
        }

        public async Task<VerifySecurityQuestionsResponse> Handle(VerifySecurityQuestionsQuery query)
        {
            var contact = (await contactRepository.QueryContact(new RegistrantQuery { ContactId = query.RegistrantId, MaskSecurityAnswers = false })).Items.FirstOrDefault();

            if (contact == null) throw new Exception($"registrant {query.RegistrantId} not found");

            var numberOfCorrectAnswers = query.Answers
                .Select(a => contact.SecurityQuestions.Any(q => a.Answer.Equals(q.Answer, StringComparison.OrdinalIgnoreCase) && a.Answer.Equals(q.Answer, StringComparison.OrdinalIgnoreCase)))
                .Count(a => a);
            return new VerifySecurityQuestionsResponse { NumberOfCorrectAnswers = numberOfCorrectAnswers };
        }

        public async Task<VerifySecurityPhraseResponse> Handle(VerifySecurityPhraseQuery query)
        {
            var file = (await caseRepository.QueryCase(new Resources.Cases.EvacuationFilesQuery
            {
                FileId = query.FileId,
                MaskSecurityPhrase = false
            })).Items.Cast<Resources.Cases.EvacuationFile>().FirstOrDefault();

            if (file == null) throw new Exception($"Evacuation File {query.FileId} not found");

            var isCorrect = string.Equals(file.SecurityPhrase, query.SecurityPhrase, StringComparison.OrdinalIgnoreCase);

            return new VerifySecurityPhraseResponse
            {
                IsCorrect = isCorrect
            };
        }

        public async Task<string> Handle(SaveEvacuationFileNoteCommand cmd)
        {
            if (string.IsNullOrEmpty(cmd.FileId)) throw new ArgumentNullException("FileId is required");

            var note = mapper.Map<Resources.Cases.Note>(cmd.Note);
            var id = (await caseRepository.ManageCase(new SaveEvacuationFileNote { FileId = cmd.FileId, Note = note })).Id;
            return id;
        }

        public async Task<EvacuationFileNotesQueryResponse> Handle(Shared.Contracts.Submissions.EvacuationFileNotesQuery query)
        {
            var file = (await caseRepository.QueryCase(new Resources.Cases.EvacuationFilesQuery
            {
                FileId = query.FileId,
            })).Items.Cast<Resources.Cases.EvacuationFile>().FirstOrDefault();

            if (file == null) throw new Exception($"Evacuation File {query.FileId} not found");

            var notes = file.Notes;

            if (!string.IsNullOrEmpty(query.NoteId)) notes = notes.Where(n => n.Id == query.NoteId).ToArray();

            return new EvacuationFileNotesQueryResponse { Notes = mapper.Map<IEnumerable<Shared.Contracts.Submissions.Note>>(notes) };
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
    }
}
