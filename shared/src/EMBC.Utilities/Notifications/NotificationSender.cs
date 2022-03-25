using System;
using System.Threading.Tasks;

namespace EMBC.Utilities.Notifications
{
    public interface INotificationSender
    {
        Task Send(Notification notification);
    }

    public interface INotificationChannel
    {
        Task Send(Notification notification);
    }

    public abstract class Notification
    { }

    public class EmailNotification : Notification
    {
        public EmailAddress? From { get; set; }
        public EmailAddress[] To { get; set; } = Array.Empty<EmailAddress>();
        public string? Subject { get; set; }
        public string? Content { get; set; }
    }

    public class EmailAddress
    {
        public string? Name { get; set; }
        public string? Address { get; set; }
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
