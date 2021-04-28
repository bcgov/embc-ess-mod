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
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS.Utilities.Notifications;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;

namespace EMBC.ESS.Utilities.NotificationSender.Channels
{
    public class Email : INotificationChannel
    {
        private EmailChannelOptions settings;

        public Email(IOptions<EmailChannelOptions> options)
        {
            settings = options.Value;
        }

        public async Task Send(Notification notification)
        {
            if (!(notification is EmailNotification emailNotification))
            {
                throw new ArgumentException($"Email notification channel can only send notifications of type {nameof(EmailNotification)}, " +
                    $"but was {typeof(Notification).Name}",
                    nameof(notification));
            }

            using (var emailClient = new SmtpClient())
            {
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

                message.Subject = emailNotification.Subject;
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
    }

    public class EmailChannelOptions
    {
        public string SmtpServer { get; }
        public int SmtpPort { get; }
        public string SmtpUsername { get; set; }
        public string SmtpPassword { get; set; }
        public bool SmtpEnableSSL { get; set; }
        public EmailAddress DefaultSender { get; set; }

        public bool HasCredentials => !string.IsNullOrEmpty(SmtpUsername) && !string.IsNullOrEmpty(SmtpPassword);
    }
}
