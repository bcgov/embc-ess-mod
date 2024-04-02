using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.Utilities.Telemetry;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;

namespace EMBC.Utilities.Notifications.Channels
{
    public class Email : INotificationChannel
    {
        private readonly ITelemetryReporter logger;
        private EmailChannelOptions settings;

        public Email(IOptions<EmailChannelOptions> options, ITelemetryProvider telemetryProvider)
        {
            settings = options.Value;
            this.logger = telemetryProvider.Get<Email>();
        }

        public async Task Send(Notification notification)
        {
            if (!(notification is EmailNotification emailNotification))
            {
                throw new ArgumentException($"Email notification channel can only send notifications of type {nameof(EmailNotification)}, " +
                    $"but was {typeof(Notification).Name}",
                    nameof(notification));
            }

            if (string.IsNullOrEmpty(settings.SmtpServer))
            {
                logger.LogWarning("SMTP server is not configured, skipping sending email notification");
                return;
            }

            using var emailClient = new SmtpClient();

            var message = new MimeMessage();
            message.To.AddRange(emailNotification.To.Select(x => new MailboxAddress(x.Name, x.Address)));
            if (emailNotification.From != null)
            {
                message.From.Add(new MailboxAddress(emailNotification.From.Name, emailNotification.From.Address));
            }
            else
            {
                // Add default sender to from list
                message.From.Add(new MailboxAddress(settings.DefaultSender.Name, settings.DefaultSender.Address));
            }

            message.Subject = $"{settings.SubjectPrefix}{emailNotification.Subject}";
            message.Body = new TextPart(TextFormat.Html)
            {
                Text = emailNotification.Content
            };

            emailClient.Connect(settings.SmtpServer, settings.SmtpPort, settings.SmtpEnableSSL ? SecureSocketOptions.Auto : SecureSocketOptions.None);

            if (settings.HasCredentials)
            {
                emailClient.Authenticate(settings.SmtpUsername, settings.SmtpPassword);
            }

            await emailClient.SendAsync(message);

            emailClient.Disconnect(true);
        }
    }

    public class EmailChannelOptions
    {
        public string SmtpServer { get; set; } = null!;
        public int SmtpPort { get; set; } = 25;
        public string? SmtpUsername { get; set; }
        public string? SmtpPassword { get; set; }
        public bool SmtpEnableSSL { get; set; }
        public EmailAddress DefaultSender { get; set; } = new EmailAddress { Name = "ERA Notifications", Address = "era-no-reply@gov.bc.ca" };
        public string SubjectPrefix { get; set; } = null!;

        public bool HasCredentials => !string.IsNullOrEmpty(SmtpUsername) && !string.IsNullOrEmpty(SmtpPassword);
    }
}
