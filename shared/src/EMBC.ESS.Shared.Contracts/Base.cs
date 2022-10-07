using System;
using System.Runtime.Serialization;
using EMBC.ESS.Shared.Contracts.Teams;

namespace EMBC.ESS.Shared.Contracts
{
#pragma warning disable SA1302 // Interface names should begin with I
#pragma warning disable S2326 // Unused type parameters should be removed

    public interface Command
    { }

    public interface Query<TResponse>
    { }

    public interface Event
    { }

#pragma warning restore SA1302 // Interface names should begin with I
#pragma warning restore S2326 // Unused type parameters should be removed

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
    public class TimeoutException : EssApplicationException
    {
        public TimeoutException(string message) : base(message)
        {
        }

        protected TimeoutException(SerializationInfo info, StreamingContext context) : base(info, context)
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
