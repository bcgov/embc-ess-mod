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
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using MimeKit;
using MimeKit.Text;

namespace EMBC.Registrants.API.Utils
{
    public interface IEmailSender
    {
        void Send(EmailMessage message);
    }

    public class EmailAddress
    {
        public string Name { get; set; }
        public string Address { get; set; }
    }

    public class EmailMessage
    {
        public EmailMessage()
        {
            SetToAddresses(new List<EmailAddress>());
            SetFromAddresses(new List<EmailAddress>());
        }

        private List<EmailAddress> toAddresses;
        private List<EmailAddress> fromAddresses;
        public string Subject { get; set; }
        public string Content { get; set; }

        public List<EmailAddress> GetToAddresses()
        {
            return toAddresses;
        }

        public void SetToAddresses(List<EmailAddress> value)
        {
            toAddresses = value;
        }

        public List<EmailAddress> GetFromAddresses()
        {
            return fromAddresses;
        }

        public void SetFromAddresses(List<EmailAddress> value)
        {
            fromAddresses = value;
        }

        public EmailMessage(List<EmailAddress> to, string subject, string body) : this(null, to, subject, body)
        {
        }

        public EmailMessage(List<EmailAddress> fromAddresses, List<EmailAddress> toAddresses, string subject, string body)
        {
            Content = body;
            Subject = subject;
            SetToAddresses(toAddresses);
            SetFromAddresses(fromAddresses);
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

        public void Send(EmailMessage emailMessage)
        {
            if (!Enabled)
            {
                logger.LogWarning("SMTP is not configured, check the environment variables for SMTP_HOST");
                return;
            }
            using (var emailClient = new SmtpClient())
            {
                var message = new MimeMessage();
                message.To.AddRange(emailMessage.GetToAddresses().Select(x => new MailboxAddress(x.Name, x.Address)));
                if (emailMessage.GetFromAddresses() != null && emailMessage.GetFromAddresses().Count > 0)
                {
                    message.From.AddRange(emailMessage.GetFromAddresses().Select(x => new MailboxAddress(x.Name, x.Address)));
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

                try
                {
                    if (emailConfiguration.EnableSSL == false)
                    {
                        // The certificate for the government SMTP server doesn't match the actual server name and so we have to disable SSL.
                        emailClient.Connect(emailConfiguration.Server, emailConfiguration.SmtpPort, SecureSocketOptions.None);
                    }
                    else
                    {
                        emailClient.Connect(emailConfiguration.Server, emailConfiguration.SmtpPort, emailConfiguration.EnableSSL);
                        if (emailConfiguration.SmtpUsername.Length > 0 && emailConfiguration.SmtpPassword.Length > 0)
                        {
                            emailClient.Authenticate(emailConfiguration.SmtpUsername, emailConfiguration.SmtpPassword);
                        }
                    }
                    emailClient.Send(message);

                    emailClient.Disconnect(true);
                }
                catch (ArgumentNullException)
                {
                    logger.LogError("ArgumentNullException sending email message");
                    throw;
                }
                catch (InvalidOperationException)
                {
                    logger.LogError("InvalidOperationException sending email message");
                    throw;
                }
            }
        }
    }
}
