using System;

namespace EMBC.Utilities.Messaging
{
    public class ClientException : Exception
    {
        public ClientException(string type, string message) : base(message)
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
