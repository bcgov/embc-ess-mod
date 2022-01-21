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
using EMBC.ESS.Shared.Contracts;
using EMBC.Registrants.API.Utils;
using Microsoft.Extensions.Logging;

namespace EMBC.Utilities.Messaging
{
    public interface IMessagingClient
    {
        Task<TResponse?> Send<TResponse>(Query<TResponse> command);

        Task<string?> Send(Command command);
    }

    internal class MessagingClient : IMessagingClient
    {
        private readonly Dispatcher.DispatcherClient dispatcherClient;
        private readonly ILogger<MessagingClient> logger;

        public MessagingClient(Dispatcher.DispatcherClient dispatcherClient, ILogger<MessagingClient> logger)
        {
            this.dispatcherClient = dispatcherClient;
            this.logger = logger;
        }

        public async Task<string?> Send(Command command)
        {
            try
            {
                var response = await dispatcherClient.DispatchAsync<string>(command);
                return response;
            }
            catch (ServerException e)
            {
                logger.LogError(e, "Server error when sending command {0}, correlation id {1}", command.GetType().FullName, e.CorrelationId);
                throw;
            }
            catch (Exception e)
            {
                logger.LogError(e, "General error when sending command {0}", command.GetType().FullName);
                throw;
            }
        }

        public async Task<TResponse?> Send<TResponse>(Query<TResponse> command)
        {
            try
            {
                var response = await dispatcherClient.DispatchAsync<TResponse>(command);
                return response;
            }
            catch (ServerException e) when (e.Type == typeof(NotFoundException).FullName)
            {
                return default;
            }
            catch (ServerException e)
            {
                logger.LogError(e, "Server error when sending query {0}, correlation id {1}", command.GetType().FullName, e.CorrelationId);
                throw;
            }
            catch (Exception e)
            {
                logger.LogError(e, "General error when sending query {0}", command.GetType().FullName);
                throw;
            }
        }
    }
}
