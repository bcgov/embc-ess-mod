using System;

namespace EMBC.Utilities.Messaging
{
    [Serializable]
    public class ServerException : Exception
    {
        public ServerException(string type, string message) : base(message)
        {
            Type = type;
        }

        protected ServerException(
          System.Runtime.Serialization.SerializationInfo info,
          System.Runtime.Serialization.StreamingContext context) : base(info, context) { }

        public string Type { get; } = string.Empty;

        public override string ToString()
        {
            return $"{Type}: {Message}";
        }
    }
}
