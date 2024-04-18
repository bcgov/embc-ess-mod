using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Messaging;

namespace EMBC.Registrants.API.Services
{
    public interface IEvacuationSearchService
    {
        Task<IEnumerable<EvacuationFile>> GetFiles(string byRegistrantUserId, EvacuationFileStatus[] byStatus, CancellationToken ct);

        Task<RegistrantProfile> GetRegistrantByUserId(string userId, CancellationToken ct);
    }

    public class EvacuationSearchService : IEvacuationSearchService
    {
        private readonly IMessagingClient messagingClient;

        public EvacuationSearchService(IMessagingClient messagingClient)
        {
            this.messagingClient = messagingClient;
        }

        public async Task<IEnumerable<EvacuationFile>> GetFiles(string byRegistrantUserId, EvacuationFileStatus[] byStatus, CancellationToken ct)
        {
            var files = (await messagingClient.Send(new EvacuationFilesQuery
            {
                PrimaryRegistrantUserId = byRegistrantUserId,
                IncludeFilesInStatuses = byStatus
            }, ct)).Items;

            return files;
        }

        public async Task<RegistrantProfile> GetRegistrantByUserId(string userId, CancellationToken ct)
        {
            var registrant = (await messagingClient.Send(new RegistrantsQuery { UserId = userId }, ct)).Items.SingleOrDefault();

            return registrant;
        }
    }
}
