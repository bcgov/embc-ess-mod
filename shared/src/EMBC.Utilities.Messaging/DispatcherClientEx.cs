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
                var errorType = Type.GetType(response.ErrorType, an => Assembly.Load(an.Name ?? null!), null, false, true);
                var exception = errorType != null
                    ? (Exception)(Activator.CreateInstance(errorType, response.ErrorMessage) ?? null!)
                    : new Exception(response.ErrorMessage);

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
