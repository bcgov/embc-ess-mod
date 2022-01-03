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
using System.Reflection;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Extensions;

namespace EMBC.ESS.Managers.Submissions.Notifications
{
    public class EmailTemplate : Template
    {
        public string Subject { get; set; }
        public string Content { get; set; }
    }

    public class EmailTemplateProvider : ITemplateProvider
    {
        public async Task<Template> Get(SubmissionTemplateType template) =>
            await Task.FromResult(template switch
            {
                SubmissionTemplateType.NewAnonymousEvacuationFileSubmission => GetAnonymousnewTemplate(),
                SubmissionTemplateType.NewEvacuationFileSubmission => GetNewTemplate(),
                SubmissionTemplateType.NewProfileRegistration => GetRegisterNewTemplate(),
                SubmissionTemplateType.InviteProfile => GetInviteTemplate(),
                _ => throw new NotImplementedException($"No template found for {template}")
            });

        private EmailTemplate GetRegisterNewTemplate()
        {
            var emailSubject = "Registration completed successfully";
            var emailBody = LoadTemplate("RegisterNewTemplate");
            return new EmailTemplate { Subject = emailSubject, Content = emailBody };
        }

        private EmailTemplate GetNewTemplate()
        {
            var emailSubject = "Registration completed successfully";
            var emailBody = LoadTemplate("NewTemplate");
            return new EmailTemplate { Subject = emailSubject, Content = emailBody };
        }

        private EmailTemplate GetAnonymousnewTemplate()
        {
            var emailSubject = "Registration completed successfully";
            var emailBody = LoadTemplate("AnonymousNewTemplate");
            return new EmailTemplate { Subject = emailSubject, Content = emailBody };
        }

        private EmailTemplate GetInviteTemplate()
        {
            return new EmailTemplate
            {
                Subject = "Connect your Evacuee Registration & Assistance (ERA) Profile with BC Services Card",
                Content = LoadTemplate("InviteTemplate")
            };
        }

        private static string LoadTemplate(string name)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var manifestName = $"EMBC.ESS.Managers.Submissions.Notifications.Templates.{name}.hbs";
            return assembly.GetManifestResourceString(manifestName);
        }
    }
}
