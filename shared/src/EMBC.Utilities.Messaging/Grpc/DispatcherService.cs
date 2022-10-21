using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using EMBC.ESS.Shared.Contracts;
using EMBC.Utilities.Telemetry;
using Google.Protobuf;
using Grpc.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace EMBC.Utilities.Messaging.Grpc
{
    internal class DispatcherService : Dispatcher.DispatcherBase
    {
        private readonly ITelemetryReporter logger;

        public DispatcherService(ITelemetryProvider telemetryProvider)
        {
            logger = telemetryProvider.Get<DispatcherService>();
        }

        [Authorize]
        public override async Task<ReplyEnvelope> Dispatch(RequestEnvelope request, ServerCallContext context)
        {
            var serviceProvider = context.GetHttpContext().RequestServices;
            var handlerRegistry = serviceProvider.GetRequiredService<IOptions<HandlerRegistry>>().Value;

            var requestType = Type.GetType(request.Type, an => Assembly.Load(an.Name ?? null!), null, true, true) ?? null!;
            var handlers = handlerRegistry.Resolve(requestType);
            if (handlers == null || !handlers.Any()) throw new InvalidOperationException($"Message handler for {requestType} not found");

            using var ms = new MemoryStream(request.Data.ToByteArray());
            var message = await JsonSerializer.DeserializeAsync(ms, requestType) ?? null!;

            var ct = context.CancellationToken;
            if (requestType.IsAssignableTo(typeof(Event)))
            {
                Parallel.ForEach(handlers, handler => _ = ThreadPool
                    .QueueUserWorkItem(sp => DispatchHandler(handler, request, message, sp, ct).GetAwaiter().GetResult(), serviceProvider.CreateScope().ServiceProvider, false));
                return CreateReply(request, null);
            }
            else
            {
                return await DispatchHandler(handlers[0], request, message, serviceProvider, ct);
            }
        }

        private async Task<ReplyEnvelope> DispatchHandler(MethodInfo handler, RequestEnvelope request, object message, IServiceProvider serviceProvider, CancellationToken ct)
        {
            var sw = Stopwatch.StartNew();
            try
            {
                var handlerInstance = serviceProvider.GetRequiredService(handler.DeclaringType ?? null!);
                var replyMessage = await handler.InvokeAsync(handlerInstance, new object[] { message });

                var reply = CreateReply(request, replyMessage);

                sw.Stop();
                logger.LogInformation("GRPC Dispatch request {requestId} {requestType} responded {status} with {replyType} in {elapsed} ms", request.CorrelationId, request.Type, "OK", reply.Type, sw.Elapsed.TotalMilliseconds);
                return reply;
            }
            catch (Exception e)
            {
                sw.Stop();
                var reply = CreateErrorReply(request, e);

                logger.LogError(e, "GRPC Dispatch request {requestId} {requestType} responded {status} in {elapsed} ms: {error}", request.CorrelationId, request.Type, "ERROR", sw.Elapsed.TotalMilliseconds, reply.ErrorMessage);
                return reply;
            }
        }

        private ReplyEnvelope CreateReply(RequestEnvelope request, object? replyMessage) => new ReplyEnvelope
        {
            CorrelationId = request.CorrelationId,
            Type = replyMessage?.GetType()?.AssemblyQualifiedName ?? string.Empty,
            Data = replyMessage == null
                        ? ByteString.Empty
                        : UnsafeByteOperations.UnsafeWrap(JsonSerializer.SerializeToUtf8Bytes(replyMessage)),
            Empty = replyMessage == null
        };

        private ReplyEnvelope CreateErrorReply(RequestEnvelope request, Exception error) => new ReplyEnvelope
        {
            CorrelationId = request.CorrelationId,
            Error = true,
            ErrorType = error.GetType().AssemblyQualifiedName,
            ErrorMessage = error.Message,
        };
    }

    internal static class DispatcherServiceEx
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
