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

using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.Registrants.API.ProfilesModule;
using EMBC.Registrants.API.Utils;

namespace EMBC.Registrants.API.EvacuationsModule
{
    public interface IEvacuationManager
    {
        Task<IEnumerable<EvacuationFile>> GetEvacuations(string userid);

        Task<EvacuationFile> GetEvacuation(string userid, string essFileNumber);

        Task<string> SaveEvacuation(string userid, string essFileNumber, EvacuationFile evacuationFile);

        Task DeleteEvacuation(string userId, string essFileNumber);
    }

    public class EvacuationManager : IEvacuationManager
    {
        private readonly IEvacuationRepository evacuationRepository;
        private readonly IProfileRepository profileRepository;
        private readonly IMapper mapper;
        private readonly ITemplateEmailService emailService;
        private readonly IEmailSender emailSender;

        public EvacuationManager(IEvacuationRepository evacuationRepository, IProfileRepository profileRepository, IMapper mapper, ITemplateEmailService emailService, IEmailSender emailSender)
        {
            this.evacuationRepository = evacuationRepository;
            this.profileRepository = profileRepository;
            this.mapper = mapper;
            this.emailService = emailService;
            this.emailSender = emailSender;
        }

        public async Task<IEnumerable<EvacuationFile>> GetEvacuations(string userid)
        {
            return await evacuationRepository.Read(userid);
        }

        public async Task<EvacuationFile> GetEvacuation(string userid, string essFileNumber)
        {
            return await evacuationRepository.Read(userid, essFileNumber);
        }

        public async Task<string> SaveEvacuation(string userid, string essFileNumber, EvacuationFile evacuationFile)
        {
            // When an ESS File Number has been defined, perform an update. Otherwise, create a new evacuation.
            if (!string.IsNullOrEmpty(essFileNumber))
            {
                await evacuationRepository.Update(userid, essFileNumber, evacuationFile);
            }
            else
            {
                essFileNumber = await evacuationRepository.Create(userid, evacuationFile);

                // Check if Create returned an ESS File Number
                if (!string.IsNullOrEmpty(essFileNumber))
                {
                    // get user by BCServicesCardId
                    var profile = await profileRepository.Read(userid);

                    if (!string.IsNullOrEmpty(profile?.ContactDetails?.Email))
                    {
                        // Send email notification of new registrant record created
                        var registrantEmailAddress = new EmailAddress
                        {
                            Name = $"{profile.PersonalDetails.FirstName} {profile.PersonalDetails.LastName}",
                            Address = profile.ContactDetails.Email
                        };
                        var emailMessage = emailService.GetEvacuationSubmissionNotificationEmailMessage(registrantEmailAddress, essFileNumber);
                        await emailSender.SendAsync(emailMessage);
                    }
                }
            }

            return essFileNumber;
        }

        public async Task DeleteEvacuation(string userId, string essFileNumber)
        {
            await evacuationRepository.Delete(userId, essFileNumber);
        }
    }
}
