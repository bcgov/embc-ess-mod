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
using EMBC.ESS.Resources.Cases;
using EMBC.ESS.Resources.Contacts;
using EMBC.ESS.Resources.Tasks;
using EMBC.ESS.Resources.Team;
using EMBC.ESS.Shared.Contracts.Submissions;
using EMBC.ESS.Utilities.Notifications;
using EMBC.ESS.Utilities.Transformation;
using Task = System.Threading.Tasks.Task;

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

        public SubmissionsManager(
            IMapper mapper,
            IContactRepository contactRepository,
            ITemplateProviderResolver templateProviderResolver,
            ICaseRepository caseRepository,
            ITransformator transformator,
            INotificationSender notificationSender,
            ITaskRepository taskRepository,
            ITeamRepository teamRepository)
        {
            this.mapper = mapper;
            this.contactRepository = contactRepository;
            this.templateProviderResolver = templateProviderResolver;
            this.caseRepository = caseRepository;
            this.transformator = transformator;
            this.notificationSender = notificationSender;
            this.taskRepository = taskRepository;
            this.teamRepository = teamRepository;
        }

        public async Task<string> Handle(SubmitAnonymousEvacuationFileCommand cmd)
        {
            var file = mapper.Map<Resources.Cases.EvacuationFile>(cmd.File);
            var contact = mapper.Map<Contact>(cmd.SubmitterProfile);

            file.PrimaryRegistrantId = (await contactRepository.ManageContact(new SaveContact { Contact = contact })).ContactId;
            file.NeedsAssessment.HouseholdMembers.Where(m => m.IsPrimaryRegistrant).Single().LinkedRegistrantId = file.PrimaryRegistrantId;

            var caseId = (await caseRepository.ManageCase(new SaveEvacuationFile { EvacuationFile = file })).CaseId;

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
            var contact = (await contactRepository.QueryContact(new ContactQuery { ContactId = file.PrimaryRegistrantId })).Items.SingleOrDefault();

            if (contact == null) throw new Exception($"Registrant not found '{file.PrimaryRegistrantId}'");

            var caseId = (await caseRepository.ManageCase(new SaveEvacuationFile { EvacuationFile = file })).CaseId;

            if (cmd.File.SecurityPhraseChanged) await caseRepository.ManageCase(new UpdateSecurityPhrase { Id = caseId, SecurityPhrase = file.SecurityPhrase });

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

            var updatedQuestions = mapper.Map<IEnumerable<Resources.Contacts.SecurityQuestion>>(cmd.Profile.SecurityQuestions.Where(s => s.AnswerChanged));

            if (updatedQuestions.Count() > 0)
            {
                await contactRepository.ManageContact(new UpdateSecurityQuestions { ContactId = result.ContactId, SecurityQuestions = updatedQuestions });
            }

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

        public async Task Handle(DeleteRegistrantCommand cmd)
        {
            var contact = (await contactRepository.QueryContact(new ContactQuery { UserId = cmd.UserId })).Items.SingleOrDefault();
            if (contact == null) return;
            await contactRepository.ManageContact(new DeleteContact { ContactId = contact.Id });
        }

        private async Task SendEmailNotification(SubmissionTemplateType notificationType, string email, string name, IEnumerable<KeyValuePair<string, string>> tokens)
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

        public async Task<RegistrantsSearchQueryResult> Handle(RegistrantsSearchQuery query)
        {
            var contacts = (await contactRepository.QueryContact(new SearchContactQuery
            {
                ContactId = query.Id,
                UserId = query.UserId,
                FirstName = query.FirstName,
                LastName = query.LastName,
                DateOfBirth = query.DateOfBirth
            })).Items;
            var registrants = mapper.Map<IEnumerable<RegistrantProfile>>(contacts);

            var results = new List<RegistrantWithFiles>();
            var resultTasks = registrants.Select(async r =>
            {
                var result = new RegistrantWithFiles { RegistrantProfile = r, Files = Array.Empty<Shared.Contracts.Submissions.EvacuationFile>() };
                if (query.IncludeCases)
                {
                    var files = (await caseRepository.QueryCase(new EvacuationFilesQuery { PrimaryRegistrantId = r.Id })).Items.Cast<Resources.Cases.EvacuationFile>();
                    result.Files = mapper.Map<IEnumerable<Shared.Contracts.Submissions.EvacuationFile>>(files);
                }
                results.Add(result);
            });

            Task.WaitAll(resultTasks.ToArray());
            return new RegistrantsSearchQueryResult { Items = results };
        }

        public async Task<EvacuationFilesSearchQueryResult> Handle(EvacuationFilesSearchQuery query)
        {
            if (!string.IsNullOrEmpty(query.PrimaryRegistrantUserId))
            {
                var registrant = (await contactRepository.QueryContact(new ContactQuery { UserId = query.PrimaryRegistrantUserId })).Items.SingleOrDefault();
                if (registrant == null) throw new Exception($"registrant with user id '{query.PrimaryRegistrantUserId}' not found");
                query.PrimaryRegistrantId = registrant.Id;
            }
            var cases = (await caseRepository.QueryCase(new EvacuationFilesQuery
            {
                FileId = query.FileId,
                PrimaryRegistrantId = query.PrimaryRegistrantId,
                FirstName = query.FirstName,
                LastName = query.LastName,
                DateOfBirth = query.DateOfBirth,
                IncludeHouseholdMembers = query.IncludeHouseholdMembers,
                IncludeFilesInStatuses = query.IncludeFilesInStatuses.Select(s => Enum.Parse<Resources.Cases.EvacuationFileStatus>(s.ToString())).ToArray()
            })).Items.Cast<Resources.Cases.EvacuationFile>();

            var results = mapper.Map<IEnumerable<Shared.Contracts.Submissions.EvacuationFile>>(cases);

            foreach (var note in results.SelectMany(c => c.Notes))
            {
                var teamMembers = await teamRepository.GetMembers(null, null, note.CreatingTeamMemberId);
                var member = teamMembers.SingleOrDefault();
                if (member == null) continue;
                note.MemberName = $"{member.FirstName}, {member.LastName.Substring(0, 1)}";
                note.TeamId = member.TeamId;
                note.TeamName = member.TeamName;
            }

            return new EvacuationFilesSearchQueryResult { Items = results };
        }

        public async Task<VerifySecurityQuestionsResponse> Handle(VerifySecurityQuestionsQuery query)
        {
            IEnumerable<Contact> contacts = Array.Empty<Contact>();
            contacts = (await contactRepository.QueryContact(new ContactQuery { ContactId = query.RegistrantId, MaskSecurityAnswers = false })).Items;
            VerifySecurityQuestionsResponse ret = new VerifySecurityQuestionsResponse
            {
                NumberOfCorrectAnswers = 0
            };

            if (contacts.Count() == 1)
            {
                Contact contact = contacts.First();
                if (contact.SecurityQuestions != null && contact.SecurityQuestions.Count() > 0)
                {
                    for (int i = 0; i < query.Answers.Count(); ++i)
                    {
                        Shared.Contracts.Submissions.SecurityQuestion question = query.Answers.ElementAt(i);
                        string submittedAnswer = question.Answer;
                        string savedAnswer = contact.SecurityQuestions.Where(q => q.Id == question.Id).FirstOrDefault().Answer;
                        if (string.Equals(savedAnswer, submittedAnswer, StringComparison.OrdinalIgnoreCase))
                        {
                            ++ret.NumberOfCorrectAnswers;
                        }
                    }
                }
            }

            return ret;
        }

        public async Task<VerifySecurityPhraseResponse> Handle(VerifySecurityPhraseQuery query)
        {
            var file = (await caseRepository.QueryCase(new EvacuationFilesQuery
            {
                FileId = query.FileId,
                MaskSecurityPhrase = false
            })).Items.Cast<Resources.Cases.EvacuationFile>().FirstOrDefault();

            if (file == null) throw new Exception($"Evacuation File {query.FileId} not found");

            VerifySecurityPhraseResponse ret = new VerifySecurityPhraseResponse
            {
                IsCorrect = string.Equals(file.SecurityPhrase, query.SecurityPhrase, StringComparison.OrdinalIgnoreCase)
            };
            return ret;
        }

        public async Task<string> Handle(SaveEvacuationFileNotes cmd)
        {
            await Task.CompletedTask;
            throw new NotImplementedException();
        }

        public async Task<EvacuationFileNotesQueryResult> Handle(EvacuationFileNotesQuery query)
        {
            await Task.CompletedTask;
            throw new NotImplementedException();
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
