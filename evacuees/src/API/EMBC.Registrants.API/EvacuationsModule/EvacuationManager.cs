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
    }

    public class EvacuationManager : IEvacuationManager
    {
        private readonly IEvacuationRepository evacuationRepository;
        private readonly IProfileRepository profileRepository;
        private readonly IMapper mapper;
        private readonly IEmailSender emailSender;

        public EvacuationManager(IEvacuationRepository evacuationRepository, IProfileRepository profileRepository, IMapper mapper, IEmailSender emailSender)
        {
            this.evacuationRepository = evacuationRepository;
            this.profileRepository = profileRepository;
            this.mapper = mapper;
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
                        SendEvacuationSubmissionNotificationEmail(registrantEmailAddress, essFileNumber.ToString());
                    }
                }
            }

            return essFileNumber;
        }

        /// <summary>
        /// Sends a notification email to a verified Registrant after they submit an Evacuation
        /// </summary>
        /// <param name="toAddress">Registrant's Email Address</param>
        /// <param name="essFileNumber">ESS File Number</param>
        private void SendEvacuationSubmissionNotificationEmail(EmailAddress toAddress, string essFileNumber)
        {
            System.Collections.Generic.List<EmailAddress> toList = new System.Collections.Generic.List<EmailAddress> { toAddress };
            string emailSubject = "Registration completed successfully";
            string emailBody = $@"
<p><b>Submission Complete</b>
<p>
<p>Your Emergency Support Services (ESS) File Number is: " + essFileNumber + $@"
<p>Thank you for submitting your online self-registration.
<p>
<p><b>Next Steps</b>
<p>Please keep a record of your Emergency Support Services File Number to receive emergency support services that can be
    provided up to 72 hours starting from the time connecting in with a local ESS Responder at a Reception Centre. After
    a need's assessment interview with a local ESS Responder has been completed, supports are provided to purchase goods
    and services if eligible. Any goods and services purchased prior to a need’s assessment interview are not eligible
    for retroactive reimbursement.
<p>
<p>If you are under <b>EVACUATION ALERT</b> or <b>DO NOT</b> require emergency serves at this time, no further action is
    required.
<p>
<p>If you are under <b>EVACUATION ORDER</b>, and require emergency supports, proceed to your nearest Reception Centre. A
    list of open Reception Centres can be found at Emergency Info BC.
<p>
<p>If <b>NO</b> nearby Reception Centre is open and immediate action is required, please contact your First Nation
    Government or Local Authority for next steps.";

            EmailMessage emailMessage = new EmailMessage(toList, emailSubject, emailBody);
            emailSender.Send(emailMessage);
        }
    }
}
