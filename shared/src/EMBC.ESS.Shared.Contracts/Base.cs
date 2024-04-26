using System;
using System.Runtime.Serialization;
using EMBC.ESS.Shared.Contracts.Teams;

namespace EMBC.ESS.Shared.Contracts
{
#pragma warning disable S101 // Types should be named in PascalCase
#pragma warning disable S2326 // Unused type parameters should be removed

    public interface Command
    { }

    public interface Query<TResponse>
    { }

    public interface Event
    { }

#pragma warning restore S101 // Types should be named in PascalCase
#pragma warning restore S2326 // Unused type parameters should be removed

    [KnownType(typeof(NotFoundException))]
    [KnownType(typeof(BusinessLogicException))]
    [KnownType(typeof(BusinessValidationException))]
    public abstract class EssApplicationException : Exception
    {
        protected EssApplicationException(string message) : base(message)
        {
        }
    }

    public class NotFoundException : EssApplicationException
    {
        public NotFoundException(string message) : base(message)
        {
        }

        public NotFoundException(string message, string id) : base(message)
        {
            Id = id;
        }

        public string Id { get; }
    }

    public class BusinessLogicException : EssApplicationException
    {
        public BusinessLogicException(string message) : base(message)
        {
        }
    }

    public class TimeoutException : EssApplicationException
    {
        public TimeoutException(string message) : base(message)
        {
        }
    }

    [KnownType(typeof(CommunitiesAlreadyAssignedException))]
    [KnownType(typeof(UsernameAlreadyExistsException))]
    public class BusinessValidationException : EssApplicationException
    {
        public BusinessValidationException(string message) : base(message)
        {
        }
    }
}
