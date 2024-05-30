using System;

namespace EMBC.Utilities.Messaging
{
    public class ServerException : Exception
    {
        public ServerException(string type, string message) : base(message)
        {
            Type = type;
        }

        public string Type { get; }

        public override string ToString()
        {
            return $"{Type}: {Message}";
        }
    }
}
