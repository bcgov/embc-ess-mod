// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
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
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Registrants.API.SecurityModule;

namespace EMBC.Registrants.API.EvacuationsModule
{
    public interface IEvacuationManager
    {
        Task<IEnumerable<NeedsAssessment>> GetEvacuations(string userid);

        Task<string> SaveEvacuation(string userid, string essFileNumber, NeedsAssessment needsAssessment);
    }

    public class EvacuationManager : IEvacuationManager
    {
        private readonly IEvacuationRepository evacuationRepository;
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public EvacuationManager(IEvacuationRepository evacuationRepository, IUserRepository userRepository, IMapper mapper)
        {
            this.evacuationRepository = evacuationRepository;
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<NeedsAssessment>> GetEvacuations(string userid)
        {
            return await evacuationRepository.Read(userid);
        }

        public async Task<string> SaveEvacuation(string userid, string essFileNumber, NeedsAssessment needsAssessment)
        {
//            if (await evacuationRepository.DoesEvacuationExist(userid, essFileNumber))
//            {
//                await evacuationRepository.Update(userid, essFileNumber, needsAssessment);
//            }
//            else
//            {
                essFileNumber = await evacuationRepository.Create(userid, needsAssessment);
//            }

                return essFileNumber;
        }
    }
}
