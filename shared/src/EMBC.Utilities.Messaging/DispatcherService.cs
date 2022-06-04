using System;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using Google.Protobuf;
using Grpc.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace EMBC.Utilities.Messaging
{
    internal class DispatcherService : Dispatcher.DispatcherBase
    {
        [Authorize]
        public override async Task<ReplyEnvelope> Dispatch(RequestEnvelope request, ServerCallContext context)
        {
            var serviceProvider = context.GetHttpContext().RequestServices;
            var serviceRegistry = serviceProvider.GetRequiredService<MessageHandlerRegistry>();
            var logger = serviceProvider.GetRequiredService<ILogger<DispatcherService>>();

            var sw = Stopwatch.StartNew();
            try
            {
                var requestType = System.Type.GetType(request.Type, an => Assembly.Load(an.Name ?? null!), null, true, true) ?? null!;
                var messageHandler = serviceRegistry.Resolve(requestType);
                if (messageHandler == null) throw new InvalidOperationException($"Message handler for {requestType} not found");
                var handlerInstance = serviceProvider.GetRequiredService(messageHandler.DeclaringType ?? null!);
                using var ms = new MemoryStream(request.Data.ToByteArray());
                var requestMessage = await JsonSerializer.DeserializeAsync(ms, requestType) ?? null!;
                var replyMessage = await messageHandler.InvokeAsync(handlerInstance, new object[] { requestMessage });
                var replyType = replyMessage?.GetType();

                var reply = new ReplyEnvelope
                {
                    CorrelationId = request.CorrelationId,
                    Type = replyType?.AssemblyQualifiedName ?? string.Empty,
                    Data = replyMessage == null
                        ? ByteString.Empty
                        : UnsafeByteOperations.UnsafeWrap(JsonSerializer.SerializeToUtf8Bytes(replyMessage)),
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
                    ErrorType = e.GetType().AssemblyQualifiedName,
                    ErrorMessage = e.Message,
                };
                sw.Stop();

                logger.LogError(e, "GRPC Dispatch request {requestId} {requestType} responded {status} in {elapsed} ms", request.CorrelationId, request.Type, "ERROR", sw.Elapsed.TotalMilliseconds);

                return reply;
            }
        }
    }

    public static class DispatcherServiceEx
    {
        public static async Task<object?> InvokeAsync(this MethodInfo method, object obj, params object[] parameters)
        {
            var task = (Task)(method.Invoke(obj, parameters) ?? null!);
            await task.ConfigureAwait(false);
            return method.ReturnType.IsGenericType
                ? task.GetType().GetProperty("Result")?.GetValue(task)
                : null;
        }
    }
}
