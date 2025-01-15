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
                  SubmissionTemplateType.NewAnonymousEvacuationFileSubmission => await GetAnonymousNewTemplate(),
                  SubmissionTemplateType.NewEvacuationFileSubmission => await GetNewTemplate(),
                  SubmissionTemplateType.NewProfileRegistration => await GetRegisterNewTemplate(),
                  SubmissionTemplateType.InviteProfile => await GetInviteTemplate(),
                  SubmissionTemplateType.ETransferConfirmation => await GetETransferConfirmationTemplate(),
                  /* DEVOPS-32: New Templates */
                  SubmissionTemplateType.NewResponderAnonymousEvacuationFileSubmission => await GetResponderAnonymousNewTemplate(),
                  SubmissionTemplateType.NewResponderEvacuationFileSubmission => await GetResponderNewTemplate(),
                  SubmissionTemplateType.NewResponderProfileRegistration => await GetResponderRegisterNewTemplate(),

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

        private async Task<EmailTemplate> GetAnonymousNewTemplate()
        {
            var emailSubject = "Registration completed successfully";
            var emailBody = await LoadTemplate("AnonymousNewTemplate");
            return new EmailTemplate { Subject = emailSubject, Content = emailBody };
        }

        private async Task<EmailTemplate> GetETransferConfirmationTemplate()
        {
            return new EmailTemplate
            {
                Subject = "Confirmation of e-Transfer for Emergency Support Services (ESS)",
                Content = await LoadTemplate("ETransferConfirmationTemplate")
            };
        }
        private async Task<EmailTemplate> GetInviteTemplate()
        {
            return new EmailTemplate
            {
                Subject = "Log in to your Evacuee Registration & Assistance (ERA) User Profile using the BC Services Card app",
                Content = await LoadTemplate("InviteTemplate")
            };
        }

        private async Task<EmailTemplate> GetResponderRegisterNewTemplate()
        {
            var emailSubject = "ERA User Profile Successfully Created";
            var emailBody = await LoadTemplate("ResponderRegisterNewTemplate");
            return new EmailTemplate { Subject = emailSubject, Content = emailBody };
        }

        private async Task<EmailTemplate> GetResponderNewTemplate()
        {
            var emailSubject = "ESS Self-Registration Completed Successfully";
            var emailBody = await LoadTemplate("ResponderNewTemplate");
            return new EmailTemplate { Subject = emailSubject, Content = emailBody };
        }

        private async Task<EmailTemplate> GetResponderAnonymousNewTemplate()
        {
            var emailSubject = "ERA User Profile Successfully Created";
            var emailBody = await LoadTemplate("ResponderAnonymousNewTemplate");
            return new EmailTemplate { Subject = emailSubject, Content = emailBody };
        }

        private static async Task<string> LoadTemplate(string name)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var manifestName = $"EMBC.ESS.Managers.Events.Notifications.Templates.{name}.hbs";
            return await assembly.GetManifestResourceString(manifestName);
        }
    }
}
