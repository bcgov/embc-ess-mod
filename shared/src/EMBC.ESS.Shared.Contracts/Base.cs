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
using System.Runtime.Serialization;
using System.Text.Json.Serialization;
using EMBC.ESS.Shared.Contracts.Team;

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

        protected EssApplicationException(SerializationInfo info, StreamingContext context) : base(info, context) { }
    }

    [Serializable]
    public class NotFoundException : EssApplicationException
    {
        public NotFoundException(string message) : base(message) { }

        public NotFoundException(string message, string id) : base(message)
        {
            Id = id;
        }

        protected NotFoundException(SerializationInfo info, StreamingContext context) : base(info, context) { }

        public string Id { get; }
    }

    [Serializable]
    public class BusinessLogicException : EssApplicationException
    {
        public BusinessLogicException(string message) : base(message)
        {
        }

        protected BusinessLogicException(SerializationInfo info, StreamingContext context) : base(info, context) { }
    }

    [Serializable]
    [KnownType(typeof(CommunitiesAlreadyAssignedException))]
    [KnownType(typeof(UsernameAlreadyExistsException))]
    public class BusinessValidationException : EssApplicationException
    {
        public BusinessValidationException(string message) : base(message)
        {
        }

        protected BusinessValidationException(SerializationInfo info, StreamingContext context) : base(info, context) { }
    }
}
