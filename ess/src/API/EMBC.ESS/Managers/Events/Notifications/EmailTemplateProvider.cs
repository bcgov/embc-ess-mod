using System;
using System.Reflection;
using System.Threading.Tasks;
using EMBC.Utilities.Extensions;

namespace EMBC.ESS.Managers.Events.Notifications
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
            var emailSubject = "ERA User Profile Successfully Created";
            var emailBody = LoadTemplate("RegisterNewTemplate");
            return new EmailTemplate { Subject = emailSubject, Content = emailBody };
        }

        private EmailTemplate GetNewTemplate()
        {
            var emailSubject = "ESS Self-Registration Completed Successfully";
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
                Subject = "Connect your Evacuee Registration & Assistance (ERA) User Profile with BC Services Card",
                Content = LoadTemplate("InviteTemplate")
            };
        }

        private static string LoadTemplate(string name)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var manifestName = $"EMBC.ESS.Managers.Events.Notifications.Templates.{name}.hbs";
            return assembly.GetManifestResourceString(manifestName);
        }
    }
}
