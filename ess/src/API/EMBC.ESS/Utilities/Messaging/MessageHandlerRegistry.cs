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
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace EMBC.ESS.Utilities.Messaging
{
    public class MessageHandlerRegistry
    {
        private Dictionary<Type, MethodInfo> registry = new Dictionary<Type, MethodInfo>();

        public (Type type, MethodInfo) Resolve(string messageType)
        {
            var type = registry.Keys.SingleOrDefault(k => k.FullName == messageType);
            if (type == null) throw new InvalidOperationException($"message type {messageType} has no handler registered");
            return (type, registry[type]);
        }

        private void Register(MethodInfo method)
        {
            var parameters = method.GetParameters();
            if (parameters.Length != 1)
            {
                throw new InvalidOperationException($"handler {method.DeclaringType.FullName}.{method.Name} can only have a single parameter");
            }
            var requestType = method.GetParameters().Single().ParameterType;

            if (!registry.TryAdd(requestType, method))
            {
                throw new InvalidOperationException($"handler {method.DeclaringType.FullName}.{method.Name}'s parameter type {requestType.FullName} " +
                    $"already has a registered handler: {registry[requestType].DeclaringType.FullName}.{registry[requestType].Name})");
            }
        }

        public void Register<THandlerService>()
        {
            var type = typeof(THandlerService);
            var methods = type.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);

            foreach (var method in methods)
            {
                Register(method);
            }
        }
    }
}
