﻿// -------------------------------------------------------------------------
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
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics;

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
                nameof(SaveEvacuationFileNote) => await HandleSaveEvacuationFileNote((SaveEvacuationFileNote)cmd),
                nameof(SaveEvacuationFileSupportCommand) => await HandleAddSupportToEvacuationFileCommand((SaveEvacuationFileSupportCommand)cmd),
                nameof(VoidEvacuationFileSupportCommand) => await HandleVoidEvacuationFileSupportCommand((VoidEvacuationFileSupportCommand)cmd),
                _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
            };
        }

        public async Task<CaseQueryResult> QueryCase(CaseQuery query)
        {
            return query.GetType().Name switch
            {
                nameof(EvacuationFilesQuery) => await HandleQueryEvacuationFile((EvacuationFilesQuery)query),
                _ => throw new NotSupportedException($"{query.GetType().Name} is not supported")
            };
        }

        public async Task<CaseQueryResult> HandleQueryEvacuationFile(EvacuationFilesQuery query)
        {
            var result = new CaseQueryResult();

            result.Items = await evacuationRepository.Read(query);

            return result;
        }

        private async Task<ManageCaseCommandResult> HandleSaveEvacuationFile(SaveEvacuationFile cmd)
        {
            if (string.IsNullOrEmpty(cmd.EvacuationFile.Id))
            {
                return new ManageCaseCommandResult { Id = await evacuationRepository.Create(cmd.EvacuationFile) };
            }
            else
            {
                return new ManageCaseCommandResult { Id = await evacuationRepository.Update(cmd.EvacuationFile) };
            }
        }

        private async Task<ManageCaseCommandResult> HandleDeleteEvacuationFile(DeleteEvacuationFile cmd)
        {
            return new ManageCaseCommandResult { Id = await evacuationRepository.Delete(cmd.Id) };
        }

        private async Task<ManageCaseCommandResult> HandleSaveEvacuationFileNote(SaveEvacuationFileNote cmd)
        {
            if (string.IsNullOrEmpty(cmd.Note.Id))
            {
                return new ManageCaseCommandResult { Id = await evacuationRepository.CreateNote(cmd.FileId, cmd.Note) };
            }
            else
            {
                return new ManageCaseCommandResult { Id = await evacuationRepository.UpdateNote(cmd.FileId, cmd.Note) };
            }
        }

        private async Task<ManageCaseCommandResult> HandleAddSupportToEvacuationFileCommand(SaveEvacuationFileSupportCommand cmd)
        {
            if (string.IsNullOrEmpty(cmd.Support.Id))
            {
                return new ManageCaseCommandResult { Id = await evacuationRepository.CreateSupport(cmd.FileId, cmd.Support) };
            }
            else
            {
                return new ManageCaseCommandResult { Id = await evacuationRepository.UpdateSupport(cmd.FileId, cmd.Support) };
            }
        }

        private async Task<ManageCaseCommandResult> HandleVoidEvacuationFileSupportCommand(VoidEvacuationFileSupportCommand cmd)
        {
            return new ManageCaseCommandResult { Id = await evacuationRepository.VoidSupport(cmd.FileId, cmd.SupportId, cmd.VoidReason) };
        }
    }
}
