using System;
using System.Runtime.Serialization;
using EMBC.ESS.Shared.Contracts.Teams;

namespace EMBC.ESS.Shared.Contracts
{
#pragma warning disable SA1302 // Interface names should begin with I

    public interface Command
    { }

    public interface Query<TResponse>
    { }

#pragma warning restore SA1302 // Interface names should begin with I

    [Serializable]
    [KnownType(typeof(NotFoundException))]
    [KnownType(typeof(BusinessLogicException))]
    [KnownType(typeof(BusinessValidationException))]
    public abstract class EssApplicationException : Exception
    {
        public EssApplicationException(string message) : base(message)
        {
        }

        protected EssApplicationException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }

    [Serializable]
    public class NotFoundException : EssApplicationException
    {
        public NotFoundException(string message) : base(message)
        {
        }

        public NotFoundException(string message, string id) : base(message)
        {
            Id = id;
        }

        protected NotFoundException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }

        public string Id { get; }
    }

    [Serializable]
    public class BusinessLogicException : EssApplicationException
    {
        public BusinessLogicException(string message) : base(message)
        {
        }

        protected BusinessLogicException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }

    [Serializable]
    //TODO: remove these dependencies
    [KnownType(typeof(CommunitiesAlreadyAssignedException))]
    [KnownType(typeof(UsernameAlreadyExistsException))]
    public class BusinessValidationException : EssApplicationException
    {
        public BusinessValidationException(string message) : base(message)
        {
        }

        protected BusinessValidationException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
