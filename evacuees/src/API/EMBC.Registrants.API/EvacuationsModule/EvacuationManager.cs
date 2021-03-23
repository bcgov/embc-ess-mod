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
using EMBC.Registrants.API.SecurityModule;
using EMBC.Registrants.API.Utils;
using Profile = EMBC.Registrants.API.ProfilesModule.Profile;

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

        public EvacuationManager(IEvacuationRepository evacuationRepository, IProfileRepository profileRepository, IMapper mapper, ITemplateEmailService emailService)
        {
            this.evacuationRepository = evacuationRepository;
            this.profileRepository = profileRepository;
            this.mapper = mapper;
            this.emailService = emailService;
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
            if (essFileNumber != null && essFileNumber.Length > 0)
            {
                await evacuationRepository.Update(userid, essFileNumber, evacuationFile);
            }
            else
            {
                essFileNumber = await evacuationRepository.Create(userid, evacuationFile);

                // Check if Create returned an ESS File Number
                if (essFileNumber != string.Empty)
                {
                    // get user by BCServicesCardId
                    Profile profile = await profileRepository.Read(userid);

                    if (profile != null && profile.ContactDetails.Email != null)
                    {
                        // Send email notification of new registrant record created
                        EmailAddress registrantEmailAddress = new EmailAddress
                        {
                            Name = profile.PersonalDetails.FirstName + " " + profile.PersonalDetails.LastName,
                            Address = profile.ContactDetails.Email
                        };
                        emailService.SendEvacuationSubmissionNotificationEmail(registrantEmailAddress, essFileNumber.ToString());
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
