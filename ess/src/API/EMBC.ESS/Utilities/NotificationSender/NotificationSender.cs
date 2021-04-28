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
using System.Threading.Tasks;

namespace EMBC.ESS.Utilities.NotificationSender
{
    public interface INotificationSender
    {
        Task Send(Notification notification);
    }

    public interface INotificationChannel
    {
        Task Send(Notification notification);
    }

    public abstract class Notification { }

    public class EmailNotification : Notification
    {
        public EmailAddress From { get; set; }
        public EmailAddress[] To { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
    }

    public class EmailAddress
    {
        public string Name { get; set; }
        public string Address { get; set; }
    }

    public class NotificationSender : INotificationSender
    {
        private readonly Func<Type, INotificationChannel> channelResolver;

        public NotificationSender(Func<Type, INotificationChannel> channelResolver)
        {
            this.channelResolver = channelResolver;
        }

        public async Task Send(Notification notification)
        {
            var channel = channelResolver(notification.GetType());
            await channel.Send(notification);
        }
    }
}
