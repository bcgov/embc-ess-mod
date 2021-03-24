// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
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
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using MimeKit;
using MimeKit.Text;

namespace EMBC.Registrants.API.Utils
{
    public interface IEmailSender
    {
        Task SendAsync(EmailMessage message);
    }

    public class EmailAddress
    {
        public string Name { get; set; }
        public string Address { get; set; }
    }

    public class EmailMessage
    {
        public IEnumerable<EmailAddress> ToAddresses { get; set; }
        public IEnumerable<EmailAddress> FromAddresses { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }

        public EmailMessage(List<EmailAddress> to, string subject, string body) : this(null, to, subject, body)
        { }

        public EmailMessage(List<EmailAddress> fromAddresses, List<EmailAddress> toAddresses, string subject, string body)
        {
            Content = body;
            Subject = subject;
            ToAddresses = toAddresses;
            FromAddresses = fromAddresses;
        }
    }
    public interface IEmailConfiguration
    {
        string Server { get; }
        int SmtpPort { get; }
        string SmtpUsername { get; set; }
        string SmtpPassword { get; set; }
        EmailAddress SmtpDefaultSender { get; set; }
        bool EnableSSL { get; set; }
    }

    public class EmailConfiguration : IEmailConfiguration
    {
        public string Server { get; set; }
        public int SmtpPort { get; set; } = 25;
        public string SmtpUsername { get; set; } = string.Empty;
        public string SmtpPassword { get; set; } = string.Empty;
        public EmailAddress SmtpDefaultSender { get; set; } = new EmailAddress()
        {
            Name = "Do Not Reply",
            Address = "no-reply@gov.bc.ca"
        };
        public bool EnableSSL { get; set; } = false;
    }

    public class EmailSender : IEmailSender
    {
        private readonly IEmailConfiguration emailConfiguration;
        private readonly ILogger logger;

        private bool Enabled => !string.IsNullOrEmpty(emailConfiguration.Server);

        public EmailSender(IEmailConfiguration configuration, ILoggerFactory loggerFactory)
        {
            emailConfiguration = configuration;
            logger = loggerFactory.CreateLogger(typeof(EmailSender));
        }

        public async Task SendAsync(EmailMessage emailMessage)
        {
            await Task.CompletedTask;

            if (!Enabled)
            {
                logger.LogWarning("SMTP is not configured, check the environment variables for SMTP_HOST");
                return;
            }
            using (var emailClient = new SmtpClient())
            {
                var message = new MimeMessage();
                message.To.AddRange(emailMessage.ToAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));
                if (emailMessage.FromAddresses != null && emailMessage.FromAddresses.Count() > 0)
                {
                    message.From.AddRange(emailMessage.FromAddresses.Select(x => new MailboxAddress(x.Name, x.Address)));
                }
                else
                {
                    // Add default sender to from list
                    message.From.Add(new MailboxAddress(emailConfiguration.SmtpDefaultSender.Name, emailConfiguration.SmtpDefaultSender.Address));
                }

                message.Subject = emailMessage.Subject;
                message.Body = new TextPart(TextFormat.Html)
                {
                    Text = emailMessage.Content
                };

                emailClient.Connect(emailConfiguration.Server, emailConfiguration.SmtpPort, emailConfiguration.EnableSSL ? SecureSocketOptions.Auto : SecureSocketOptions.None);

                if (!string.IsNullOrEmpty(emailConfiguration.SmtpUsername) && !string.IsNullOrEmpty(emailConfiguration.SmtpPassword))
                {
                    emailClient.Authenticate(emailConfiguration.SmtpUsername, emailConfiguration.SmtpPassword);
                }

                await emailClient.SendAsync(message);

                emailClient.Disconnect(true);
            }
        }
    }
}
