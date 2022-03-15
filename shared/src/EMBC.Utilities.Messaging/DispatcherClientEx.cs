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
using System.IO;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using Google.Protobuf;
using Grpc.Core;

namespace EMBC.Utilities.Messaging
{
    internal static class DispatcherClientEx
    {
        public static async Task<TReply?> DispatchAsync<TReply>(this Dispatcher.DispatcherClient dispatcherClient, object content)
        {
            var request = new RequestEnvelope
            {
                CorrelationId = Guid.NewGuid().ToString(),
                Type = content.GetType().AssemblyQualifiedName,
                Data = UnsafeByteOperations.UnsafeWrap(JsonSerializer.SerializeToUtf8Bytes(content))
            };
            var response = await dispatcherClient.DispatchAsync(request, new CallOptions(deadline: DateTime.UtcNow.AddSeconds(118), headers: new Metadata()));
            if (response.Error)
            {
                var errorType = Type.GetType(response.ErrorType, an => Assembly.Load(an.Name ?? null!), null, true, true) ?? null!;
                var exception = (Exception)(Activator.CreateInstance(errorType, response.ErrorMessage) ?? null!);
                throw exception;
                //var serializer = new System.Runtime.Serialization.DataContractSerializer(errorType);
                //using var ms = new MemoryStream(response.Data.ToByteArray());
                //ms.Position = 0;
                //var reader = XmlDictionaryReader.CreateTextReader(ms, XmlDictionaryReaderQuotas.Max);
                //var exception = (Exception)(serializer.ReadObject(reader) ?? null!);
                //throw exception;
            }
            else
            {
                if (response.Empty || string.IsNullOrEmpty(response.Type)) return default;
                var responseType = Type.GetType(response.Type, an => Assembly.Load(an.Name ?? null!), null, true, true) ?? null!;
                using var ms = new MemoryStream(response.Data.ToByteArray());
                return (TReply?)JsonSerializer.Deserialize(ms, responseType);
            }
        }
    }
}
