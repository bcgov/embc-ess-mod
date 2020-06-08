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
using System.Threading.Tasks;
using EMBC.Suppliers.API.SubmissionModule.Models.Dynamics;
using EMBC.Suppliers.API.SubmissionModule.ViewModels;
using Jasper;

namespace EMBC.Suppliers.API.SubmissionModule.Models
{
    public class SubmissionHandler : ISubmissionHandler
    {
        private readonly ISubmissionRepository submissionRepository;
        private readonly IMessagePublisher publisher;
        private readonly ISubmissionDynamicsCustomActionHandler submissionDynamicsCustomActionHandler;

        public SubmissionHandler(ISubmissionRepository submissionRepository, IMessagePublisher publisher, ISubmissionDynamicsCustomActionHandler submissionDynamicsCustomActionHandler)
        {
            this.submissionRepository = submissionRepository;
            this.publisher = publisher;
            this.submissionDynamicsCustomActionHandler = submissionDynamicsCustomActionHandler;
        }

        public async Task<string> Handle(PersistSupplierSubmissionCommand cmd)
        {
            if (cmd == null) throw new ArgumentNullException(nameof(cmd));
            var referenceNumber = await submissionRepository.SaveAsync(cmd.Submission);

            // Temporary submit to Dynamics before the end of the API call
            // await publisher.Publish(new SubmissionSavedEvent(referenceNumber, cmd.Submission));
            await submissionDynamicsCustomActionHandler.Handle(new SubmissionSavedEvent(referenceNumber, cmd.Submission));

            return referenceNumber;
        }

        public async Task<Submission> Handle(GetSupplierSubmissionCommand cmd)
        {
            if (cmd is null) throw new ArgumentNullException(nameof(cmd));

            var submission = await submissionRepository.GetAsync(cmd.ReferenceNumber);

            return submission;
        }
    }
}
