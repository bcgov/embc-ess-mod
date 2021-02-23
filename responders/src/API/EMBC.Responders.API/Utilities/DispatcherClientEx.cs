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

using System.Text.Json;
using System.Threading.Tasks;
using EMBC.ESS;
using Google.Protobuf;
using Google.Protobuf.WellKnownTypes;

namespace EMBC.Responders.API
{
    public static class DispatcherClientEx
    {
        public static async Task<TReply> SendRequest<TRequest, TReply>(this Dispatcher.DispatcherClient dispatcherClient, TRequest request)
        {
            var response = await dispatcherClient.ProcessAsync(new RequestEnvelope
            {
                Type = typeof(TRequest).FullName,
                Content = Value.Parser.ParseJson(JsonSerializer.Serialize(request))
            });

            return JsonSerializer.Deserialize<TReply>(JsonFormatter.Default.Format(response.Content));
        }
    }
}
