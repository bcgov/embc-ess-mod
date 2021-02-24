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
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace EMBC.ESS.Utilities.Messaging
{
    public class DispatcherService : Dispatcher.DispatcherBase
    {
        private readonly MessageHandlerRegistry serviceRegistry;
        private readonly IServiceProvider serviceProvider;
        private readonly ILogger<DispatcherService> logger;

        public DispatcherService(MessageHandlerRegistry serviceRegistry, IServiceProvider serviceProvider, ILogger<DispatcherService> logger)
        {
            this.serviceRegistry = serviceRegistry;
            this.serviceProvider = serviceProvider;
            this.logger = logger;
        }

        public async override Task<ReplyEnvelope> Dispatch(RequestEnvelope request, ServerCallContext context)
        {
            try
            {
                var (requestType, messageHandler) = serviceRegistry.Resolve(request.Type);
                var handlerInstance = serviceProvider.GetRequiredService(messageHandler.DeclaringType);
                var requestMessage = JsonSerializer.Deserialize(JsonFormatter.Default.Format(request.Content), requestType);
                var replyMessage = await messageHandler.InvokeAsync(handlerInstance, new object[] { requestMessage });

                return await Task.FromResult(new ReplyEnvelope
                {
                    Type = replyMessage.GetType().FullName,
                    Content = Value.Parser.ParseJson(JsonSerializer.Serialize(replyMessage))
                });
            }
            catch (Exception e)
            {
                logger.LogError(e, "Error when processing request type {0}", request.Type);
                throw;
            }
        }
    }

    public static class DispatcherServiceEx
    {
        public static async Task<object> InvokeAsync(this MethodBase method, object obj, params object[] parameters)
        {
            var task = (Task)method.Invoke(obj, parameters);
            await task.ConfigureAwait(false);
            return task.GetType().GetProperty("Result").GetValue(task);
        }
    }
}
