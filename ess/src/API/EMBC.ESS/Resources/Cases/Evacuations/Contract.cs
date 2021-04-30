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
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Cases.Evacuations
{
    public interface IEvacuationRepository
    {
        Task<string> Create(string userId, EvacuationFile evacuationFile);

        Task<IEnumerable<EvacuationFile>> Read(string userId);

        Task<EvacuationFile> Read(string userId, string essFileNumber);

        Task<string> Update(string userId, string essFileNumber, EvacuationFile evacuationFile);

        Task Delete(string userId, string essFileNumber);
    }

    public enum EvacueeType
    {
        Person = 174360000,
        Pet = 174360001
    }

    public enum RegistrantType
    {
        Primary = 174360000,
        Member = 174360001
    }
}
