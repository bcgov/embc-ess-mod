﻿// -------------------------------------------------------------------------
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
using System.Diagnostics;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace EMBC.Utilities.Messaging
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

        public override async Task<ReplyEnvelope> Dispatch(RequestEnvelope request, ServerCallContext context)
        {
            var sw = Stopwatch.StartNew();
            try
            {
                var requestType = System.Type.GetType(request.Type, an => Assembly.Load(an.Name), null, true, true);
                var messageHandler = serviceRegistry.Resolve(requestType);
                var handlerInstance = serviceProvider.GetRequiredService(messageHandler.DeclaringType);
                var requestMessage = JsonSerializer.Deserialize(JsonFormatter.Default.Format(request.Content), requestType);
                var replyMessage = await messageHandler.InvokeAsync(handlerInstance, new object[] { requestMessage });
                var replyType = replyMessage?.GetType();

                var reply = new ReplyEnvelope
                {
                    CorrelationId = request.CorrelationId,
                    Type = replyType?.AssemblyQualifiedName ?? string.Empty,
                    Content = replyMessage == null
                        ? Value.ForNull()
                        : Value.Parser.ParseJson(JsonSerializer.Serialize(replyMessage)),
                    Empty = replyMessage == null
                };

                sw.Stop();
                logger.LogInformation("GRPC Dispatch request {requestId} {requestType} responded {status} with {replyType} in {elapsed} ms", request.CorrelationId, requestType.FullName, "OK", replyType?.FullName, sw.Elapsed.TotalMilliseconds);
                return reply;
            }
            catch (Exception e)
            {
                var reply = new ReplyEnvelope
                {
                    CorrelationId = request.CorrelationId,
                    Error = true,
                    ErrorType = e.GetType().FullName,
                    ErrorMessage = e.Message,
                    ErrorDetails = e.ToString()
                };
                sw.Stop();

                logger.LogError(e, "GRPC Dispatch request {requestId} {requestType} responded {status} in {elapsed} ms", request.CorrelationId, request.Type, "ERROR", sw.Elapsed.TotalMilliseconds);

                return reply;
            }
        }
    }

    public static class DispatcherServiceEx
    {
        public static async Task<object> InvokeAsync(this MethodInfo method, object obj, params object[] parameters)
        {
            var task = (Task)method.Invoke(obj, parameters);
            await task.ConfigureAwait(false);
            return method.ReturnType.IsGenericType
                ? task.GetType().GetProperty("Result").GetValue(task)
                : null;
        }
    }
}
