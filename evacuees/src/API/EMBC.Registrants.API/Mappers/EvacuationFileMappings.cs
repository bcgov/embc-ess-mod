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
using EMBC.Registrants.API.Controllers;

namespace EMBC.Registrants.API.Mappers
{
    public class EvacuationFileMappings : AutoMapper.Profile
    {
        public EvacuationFileMappings()
        {
            CreateMap<AnonymousRegistration, ESS.Shared.Contracts.Submissions.EvacuationFile>()
                .ForMember(d => d.Id, opts => opts.Ignore())
                .ForMember(d => d.EvacuationDate, opts => opts.MapFrom(s => DateTime.Now.ToString("yyyy/MM/dd")))
                .ForMember(d => d.NeedsAssessments, opts => opts.MapFrom(s => new[] { s.PreliminaryNeedsAssessment }))
                .ForMember(d => d.PrimaryRegistrantId, opts => opts.MapFrom(s => (string)null))
                ;

            CreateMap<Profile, ESS.Shared.Contracts.Submissions.RegistrantProfile>()
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => s.PersonalDetails.DateOfBirth))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.PersonalDetails.FirstName))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.PersonalDetails.LastName))
                .ForMember(d => d.Gender, opts => opts.MapFrom(s => s.PersonalDetails.Gender))
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.PersonalDetails.Initials))
                .ForMember(d => d.PreferredName, opts => opts.MapFrom(s => s.PersonalDetails.PreferredName))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.ContactDetails.Email))
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.ContactDetails.Phone))
                ;

            CreateMap<Address, ESS.Shared.Contracts.Submissions.Address>()
                ;

            CreateMap<NeedsAssessment, ESS.Shared.Contracts.Submissions.NeedsAssessment>()
                .ForMember(d => d.FileId, opts => opts.Ignore())
                ;

            CreateMap<HouseholdMember, ESS.Shared.Contracts.Submissions.HouseholdMember>()
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => s.Details.DateOfBirth))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.Details.FirstName))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.Details.LastName))
                .ForMember(d => d.Gender, opts => opts.MapFrom(s => s.Details.Gender))
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.Details.Initials))
                .ForMember(d => d.PreferredName, opts => opts.MapFrom(s => s.Details.PreferredName))
                ;

            CreateMap<Pet, ESS.Shared.Contracts.Submissions.Pet>()
                ;

            CreateMap<EvacuationFile, ESS.Shared.Contracts.Submissions.EvacuationFile>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.EssFileNumber))
                .ForMember(d => d.EvacuationDate, opts => opts.MapFrom(s => s.EvacuationFileDate))
                .ForMember(d => d.PrimaryRegistrantId, opts => opts.Ignore())
                ;
        }
    }
}
