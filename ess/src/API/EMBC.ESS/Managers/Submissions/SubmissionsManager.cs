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

using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Resources.Contacts;
using EMBC.ESS.Shared.Contracts.Submissions;

namespace EMBC.ESS.Managers.Submissions
{
    public class SubmissionsManager
    {
        private readonly IMapper mapper;
        private readonly IContactRepository contactRepository;

        public SubmissionsManager(IMapper mapper, IContactRepository contactRepository)
        {
            this.mapper = mapper;
            this.contactRepository = contactRepository;
        }

        public async Task<string> Handle(SubmitAnonymousEvacuationFileCommand cmd)
        {
            return await Task.FromResult("new ess number");
        }

        public async Task<string> Handle(SubmitEvacuationFileCommand cmd)
        {
            return await Task.FromResult("new ess number");
        }

        public async Task<EvacuationFilesQueryResult> Handle(EvacuationFilesQuery query)
        {
            return await Task.FromResult(new EvacuationFilesQueryResult());
        }

        public async Task<EvacuationFilesQueryResult> Handle(EvacuationFilesSearchQuery query)
        {
            return await Task.FromResult(new EvacuationFilesQueryResult());
        }

        public async Task<RegistrantsQueryResult> Handle(RegistrantsQuery query)
        {
            var items = (await contactRepository.QueryContact(new ContactQuery { UserName = query.ByUserName })).Items;

            return new RegistrantsQueryResult { Items = mapper.Map<IEnumerable<RegistrantProfile>>(items) };
        }

        public async Task<RegistrantsQueryResult> Handle(RegistrantsSearchQuery query)
        {
            return await Task.FromResult(new RegistrantsQueryResult());
        }

        public async Task<string> Handle(SaveRegistrantCommand cmd)
        {
            return await Task.FromResult("registrant id");
        }

        public async Task Handle(DeleteRegistrantCommand cmd)
        {
            await Task.CompletedTask;
        }
    }
}
