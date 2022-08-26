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
              template switch
              {
                  SubmissionTemplateType.NewAnonymousEvacuationFileSubmission => await GetAnonymousnewTemplate(),
                  SubmissionTemplateType.NewEvacuationFileSubmission => await GetNewTemplate(),
                  SubmissionTemplateType.NewProfileRegistration => await GetRegisterNewTemplate(),
                  SubmissionTemplateType.InviteProfile => await GetInviteTemplate(),
                  _ => throw new NotImplementedException($"No template found for {template}")
              };

        private async Task<EmailTemplate> GetRegisterNewTemplate()
        {
            var emailSubject = "ERA User Profile Successfully Created";
            var emailBody = await LoadTemplate("RegisterNewTemplate");
            return new EmailTemplate { Subject = emailSubject, Content = emailBody };
        }

        private async Task<EmailTemplate> GetNewTemplate()
        {
            var emailSubject = "ESS Self-Registration Completed Successfully";
            var emailBody = await LoadTemplate("NewTemplate");
            return new EmailTemplate { Subject = emailSubject, Content = emailBody };
        }

        private async Task<EmailTemplate> GetAnonymousnewTemplate()
        {
            var emailSubject = "Registration completed successfully";
            var emailBody = await LoadTemplate("AnonymousNewTemplate");
            return new EmailTemplate { Subject = emailSubject, Content = emailBody };
        }

        private async Task<EmailTemplate> GetInviteTemplate()
        {
            return new EmailTemplate
            {
                Subject = "Log in to your Evacuee Registration & Assistance (ERA) User Profile using the BC Services Card app",
                Content = await LoadTemplate("InviteTemplate")
            };
        }

        private static async Task<string> LoadTemplate(string name)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var manifestName = $"EMBC.ESS.Managers.Events.Notifications.Templates.{name}.hbs";
            return await assembly.GetManifestResourceString(manifestName);
        }
    }
}
