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
using EMBC.ESS;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;

namespace EMBC.Registrants.API.Utils
{
    public static class DispatcherClientEx
    {
        public static async Task<TReply> DispatchAsync<TReply>(this Dispatcher.DispatcherClient dispatcherClient, object content)
        {
            var request = new RequestEnvelope
            {
                CorrelationId = Guid.NewGuid().ToString(),
                Type = content.GetType().AssemblyQualifiedName,
                Content = Value.Parser.ParseJson(JsonSerializer.Serialize(content))
            };
            var response = await dispatcherClient.DispatchAsync(request);
            if (response.Empty) return default;
            if (response.Error) throw new ServerException(response.CorrelationId, response.ErrorType, response.ErrorMessage, response.ErrorDetails);
            var responseType = System.Type.GetType(response.Type, an => Assembly.Load(an.Name), null, true, true);
            return (TReply)JsonSerializer.Deserialize(JsonFormatter.Default.Format(response.Content), responseType);
        }
    }

    public class ServerException : Exception
    {
        public ServerException(string correlationId, string type, string message, string details) : base(message)
        {
            CorrelationId = correlationId;
            Type = type;
            Details = details;
        }

        public string CorrelationId { get; }
        public string Type { get; }
        public string Details { get; }
    }
}
