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
using System.Threading.Tasks;
using AutoMapper;

namespace EMBC.ESS.Resources.Cases
{
    public class CaseRepository : ICaseRepository
    {
        private readonly IEvacuationRepository evacuationRepository;
        private readonly IMapper mapper;

        public CaseRepository(IEvacuationRepository evacuationRepository, IMapper mapper)
        {
            this.evacuationRepository = evacuationRepository;
            this.mapper = mapper;
        }

        public async Task<ManageCaseCommandResult> ManageCase(ManageCaseCommand cmd)
        {
            return cmd.GetType().Name switch
            {
                nameof(SubmitEvacuationFileNeedsAssessment) => await HandleSubmitEvacuationFileNeedsAssessment((SubmitEvacuationFileNeedsAssessment)cmd),
                nameof(LinkEvacuationFileRegistrant) => await HandleLinkEvacuationFileRegistrant((LinkEvacuationFileRegistrant)cmd),
                nameof(SaveEvacuationFileNote) => await HandleSaveEvacuationFileNote((SaveEvacuationFileNote)cmd),
                nameof(SaveEvacuationFileSupportCommand) => await HandleSaveSupportsToEvacuationFileCommand((SaveEvacuationFileSupportCommand)cmd),
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

        private async Task<ManageCaseCommandResult> HandleSubmitEvacuationFileNeedsAssessment(SubmitEvacuationFileNeedsAssessment cmd)
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

        private async Task<ManageCaseCommandResult> HandleLinkEvacuationFileRegistrant(LinkEvacuationFileRegistrant cmd)
        {
            return new ManageCaseCommandResult { Id = await evacuationRepository.LinkRegistrant(cmd.FileId, cmd.RegistrantId, cmd.HouseholdMemberId) };
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

        private async Task<ManageCaseCommandResult> HandleSaveSupportsToEvacuationFileCommand(SaveEvacuationFileSupportCommand cmd)
        {
            //Concatenating the generated IDs is not the ideal solution, might worth considering splitting supports
            //to their own resource access service. The intent is to ensure all supports are created in a single transaction (Dynamics batch)
            return new ManageCaseCommandResult { Id = string.Join(';', await evacuationRepository.SaveSupports(cmd.FileId, cmd.Supports)) };
        }

        private async Task<ManageCaseCommandResult> HandleVoidEvacuationFileSupportCommand(VoidEvacuationFileSupportCommand cmd)
        {
            return new ManageCaseCommandResult { Id = await evacuationRepository.VoidSupport(cmd.FileId, cmd.SupportId, cmd.VoidReason) };
        }
    }
}
