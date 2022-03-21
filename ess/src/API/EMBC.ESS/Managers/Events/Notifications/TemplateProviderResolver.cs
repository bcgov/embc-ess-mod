using System;
using System.Threading.Tasks;

namespace EMBC.ESS.Managers.Events.Notifications
{
    public interface ITemplateProviderResolver
    {
        ITemplateProvider Resolve(NotificationChannelType channelType);
    }

    public class TemplateProviderResolver : ITemplateProviderResolver
    {
        private readonly Func<NotificationChannelType, ITemplateProvider> resolver;

        public TemplateProviderResolver(Func<NotificationChannelType, ITemplateProvider> resolver) => this.resolver = resolver;

        public ITemplateProvider Resolve(NotificationChannelType channelType) => resolver(channelType);
    }

    public interface ITemplateProvider
    {
        Task<Template> Get(SubmissionTemplateType template);
    }

    public enum NotificationChannelType
    {
        Email
    }

    public enum SubmissionTemplateType
    {
        NewEvacuationFileSubmission,
        NewAnonymousEvacuationFileSubmission,
        NewProfileRegistration,
        InviteProfile
    }

    public abstract class Template
    { }
}
