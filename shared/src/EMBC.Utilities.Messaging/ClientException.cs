using System;

namespace EMBC.Utilities.Messaging
{
    [Serializable]
    public class ClientException : Exception
    {
        public ClientException(string type, string message) : base(message)
        {
            Type = type;
        }

        protected ClientException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }

        public string Type { get; } = string.Empty;

        public override string ToString()
        {
            return $"{Type}: {Message}";
        }
    }
}
