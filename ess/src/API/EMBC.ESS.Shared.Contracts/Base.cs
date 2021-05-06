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

namespace EMBC.ESS.Shared.Contracts
{
#pragma warning disable SA1302 // Interface names should begin with I

    public interface Command { }

    public interface Query<TResponse> { }

#pragma warning restore SA1302 // Interface names should begin with I

    public class NotFoundException : Exception
    {
        public NotFoundException(string message, string id) : base(message)
        {
            Id = id;
        }

        public string Id { get; }
    }
}
