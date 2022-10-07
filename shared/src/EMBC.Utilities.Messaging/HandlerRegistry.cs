using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using EMBC.ESS.Shared.Contracts;
using EMBC.Utilities.Extensions;

namespace EMBC.Utilities.Messaging
{
    public class HandlerRegistry
    {
        private readonly Dictionary<Type, MethodInfo[]> handlersMap = new Dictionary<Type, MethodInfo[]>();

        public MethodInfo[] Resolve(Type messageType)
        {
            var type = handlersMap.Keys.SingleOrDefault(k => k.Equals(messageType));
            if (type == null) throw new ArgumentException($"Request type '{messageType.AssemblyQualifiedName}' has no registered handlers");

            return handlersMap[type];
        }

        public void AddAllHandlersFrom<T>() => AddAllHandlersFrom(typeof(T));

        public void AddAllHandlersFrom(Type handlerType)
        {
            var methods = handlerType.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly).Where(m => !m.IsSpecialName).ToArray();
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

            if (!handlersMap.ContainsKey(requestType)) handlersMap.Add(requestType, Array.Empty<MethodInfo>());

            var handlers = handlersMap[requestType].ToList();

            string error = string.Empty;

            if (requestType.IsAssignableTo(typeof(Command)) && handlers.Count > 0)
                error = $"Type '{requestType.AssemblyQualifiedName}' already has a registered command handler: {handlers[0].DeclaringType?.FullName}.{handlers[0].Name}, cannot register {methodName})";
            else if (requestType.IsAssignableToGenericType(typeof(Query<>)) && handlers.Count > 0)
                error = $"Type '{requestType.AssemblyQualifiedName}' already has a registered query handler: {handlers[0].DeclaringType?.FullName}.{handlers[0].Name}, cannot register {methodName})";

            if (!string.IsNullOrEmpty(error)) throw new InvalidOperationException(error);
            handlers.Add(method);
            handlersMap[requestType] = handlers.ToArray();
        }
    }
}
