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
using AutoMapper;
using EMBC.ESS.Resources.Cases.Evacuations;
using EMBC.ESS.Resources.Contacts;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Microsoft.OData.Edm;

namespace EMBC.ESS.Resources.Cases
{
    public class CaseRepository : ICaseRepository
    {
        private readonly IEvacuationRepository evacuationRepository;
        private readonly EssContext essContext;
        private readonly IMapper mapper;

        public CaseRepository(IEvacuationRepository evacuationRepository, EssContext essContext, IMapper mapper)
        {
            this.evacuationRepository = evacuationRepository;
            this.essContext = essContext;
            this.mapper = mapper;
        }

        public async Task<ManageCaseCommandResult> ManageCase(ManageCaseCommand cmd)
        {
            return cmd.GetType().Name switch
            {
                nameof(SaveEvacuationFile) => await HandleSaveEvacuationFile((SaveEvacuationFile)cmd),
                nameof(DeleteEvacuationFile) => await HandleDeleteEvacuationFile((DeleteEvacuationFile)cmd),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public async Task<CaseQueryResult> QueryCase(CaseQuery query)
        {
            return query.GetType().Name switch
            {
                nameof(SearchEvacuationFilesQuery) => await HandleSearchEvacuationFilesQuery((SearchEvacuationFilesQuery)query),
                nameof(EvacuationFilesQuery) => await HandleQueryEvacuationFile((EvacuationFilesQuery)query),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        public async Task<CaseQueryResult> HandleQueryEvacuationFile(EvacuationFilesQuery query)
        {
            var result = new CaseQueryResult();
            var evacuationFiles = new List<EvacuationFile>();

            if (!string.IsNullOrEmpty(query.FileId))
            {
                evacuationFiles.Add(await evacuationRepository.Read(query.FileId));
            }
            else if (!string.IsNullOrEmpty(query.UserId))
            {
                evacuationFiles = (List<EvacuationFile>)await evacuationRepository.ReadAll(query.UserId);
            }

            result.Items = evacuationFiles;
            return result;
        }

        public async Task<CaseQueryResult> HandleSearchEvacuationFilesQuery(SearchEvacuationFilesQuery query)
        {
            return new CaseQueryResult { Items = await evacuationRepository.ReadAll(query) };
        }

        private async Task<ManageCaseCommandResult> HandleSaveEvacuationFile(SaveEvacuationFile cmd)
        {
            if (string.IsNullOrEmpty(cmd.EvacuationFile.Id))
            {
                return new ManageCaseCommandResult { CaseId = await evacuationRepository.Create(cmd.EvacuationFile) };
            }
            else
            {
                return new ManageCaseCommandResult { CaseId = await evacuationRepository.Update(cmd.EvacuationFile) };
            }
        }

        private async Task<ManageCaseCommandResult> HandleDeleteEvacuationFile(DeleteEvacuationFile cmd)
        {
            return new ManageCaseCommandResult { CaseId = await evacuationRepository.Delete(cmd.Id) };
        }

        private bool CheckIfUnder19Years(Date birthdate, Date currentDate)
        {
            return birthdate.AddYears(19) >= currentDate;
        }
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
