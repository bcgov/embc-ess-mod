using System;
using System.Collections.Generic;

namespace EMBC.Utilities.Messaging
{
    public class MessageHandlingConfiguration
    {
        private readonly List<Type> handlerTypes = new List<Type>();
        public IEnumerable<Type> RegisteredHandlers => handlerTypes;

        public void AddAllHandlersFrom<T>() => AddAllHandlersFrom(typeof(T));

        public void AddAllHandlersFrom(Type handlerType) => handlerTypes.Add(handlerType);
    }
}
