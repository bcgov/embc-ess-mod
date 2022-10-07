using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using EMBC.ESS.Shared.Contracts;
using EMBC.Utilities.Telemetry;
using Microsoft.Extensions.Options;

namespace EMBC.Utilities.Messaging.Grpc
{
    internal class MessageHandlerRegistry
    {
        private readonly Dictionary<Type, List<MethodInfo>> handlersMap = new Dictionary<Type, List<MethodInfo>>();
        private readonly ITelemetryReporter logger;

        public MessageHandlerRegistry(ITelemetryProvider telemetryProvider, IOptions<MessageHandlingConfiguration> options)
        {
            logger = telemetryProvider.Get<MessageHandlerRegistry>();
            foreach (var type in options.Value.RegisteredHandlers)
            {
                Register(type);
            }
        }

        public MethodInfo[] Resolve(Type messageType)
        {
            var type = handlersMap.Keys.SingleOrDefault(k => k.Equals(messageType));
            if (type == null) throw new ArgumentException($"Request type '{messageType.AssemblyQualifiedName}' has no registered handlers");
            var methods = handlersMap[type] ?? null!;

            //logger.LogDebug("Resolved handler {0} for type {1}", $"{method.DeclaringType?.FullName}.{method.Name}", type);

            return methods.ToArray();
        }

        public void Register<THandlerService>() => Register(typeof(THandlerService));

        public void Register(Type handlerType)
        {
            var methods = handlerType.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);
            foreach (var method in methods)
            {
                Register(method);
            }
        }

        private void Register(MethodInfo method)
        {
            var methodName = $"{method.DeclaringType?.FullName ?? null!}.{method.Name}";
            var requestType = method.GetParameters().Single().ParameterType ?? null!;
            var parameters = method.GetParameters();
            if (parameters.Length != 1)
            {
                throw new InvalidOperationException($"Handler {methodName} can only have a single parameter");
            }

            if (!handlersMap.ContainsKey(requestType)) handlersMap.Add(requestType, new List<MethodInfo>());

            var handlers = handlersMap[requestType];

            string error = string.Empty;

            if (requestType.IsAssignableTo(typeof(Command)))
            {
                logger.LogDebug("Adding {0} to handle command '{1}'", methodName, requestType.AssemblyQualifiedName);

                if (handlers.Count > 0) error = $"Type '{requestType.AssemblyQualifiedName}' already has a registered command handler: {handlers[0].DeclaringType?.FullName}.{handlers[0].Name}, cannot register {methodName})";
            }
            else if (requestType.IsAssignableTo(typeof(Event)))
            {
                logger.LogDebug("Adding {0} to handle event '{1}'", methodName, requestType.AssemblyQualifiedName);
            }
            else if (requestType.IsAssignableTo(typeof(Query<>)))
            {
                logger.LogDebug("Adding {0} to handle query '{1}'", methodName, requestType.AssemblyQualifiedName);
                if (handlers.Count > 0) error = $"Type '{requestType.AssemblyQualifiedName}' already has a registered query handler: {handlers[0].DeclaringType?.FullName}.{handlers[0].Name}, cannot register {methodName})";
            }

            handlers.Add(method);
        }
    }
}
