using System;
using System.IO;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using Google.Protobuf;
using Grpc.Core;

namespace EMBC.Utilities.Messaging.Grpc
{
    internal static class DispatcherClientEx
    {
        public static async Task<TReply?> DispatchAsync<TReply>(this Dispatcher.DispatcherClient dispatcherClient, object content)
        {
            try
            {
                var request = new RequestEnvelope
                {
                    CorrelationId = Guid.NewGuid().ToString(),
                    Type = content.GetType().AssemblyQualifiedName,
                    Data = UnsafeByteOperations.UnsafeWrap(JsonSerializer.SerializeToUtf8Bytes(content))
                };
                var response = await dispatcherClient.DispatchAsync(request, new CallOptions(deadline: DateTime.UtcNow.AddSeconds(118), headers: new Metadata()));

                if (response.Error) throw new ServerException(response.ErrorType, response.ErrorMessage);

                if (response.Empty || string.IsNullOrEmpty(response.Type)) return default;
                var responseType = Type.GetType(response.Type, an => Assembly.Load(an.Name ?? null!), null, true, true) ?? null!;
                using var ms = new MemoryStream(response.Data.ToByteArray());
                return (TReply?)JsonSerializer.Deserialize(ms, responseType);
            }
            catch (RpcException e) when (e.Status.StatusCode == StatusCode.DeadlineExceeded)
            {
                throw new ClientException(typeof(ESS.Shared.Contracts.TimeoutException).AssemblyQualifiedName ?? string.Empty, e.Message);
            }
        }
    }
}
