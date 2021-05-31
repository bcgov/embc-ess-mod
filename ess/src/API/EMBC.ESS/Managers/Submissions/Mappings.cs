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

using AutoMapper;

namespace EMBC.ESS.Managers.Submissions
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Shared.Contracts.Submissions.EvacuationFile, Resources.Cases.EvacuationFile>()
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Submissions.Address, Resources.Cases.EvacuationAddress>()
                .ReverseMap()
                ;
            CreateMap<Shared.Contracts.Submissions.HouseholdMember, Resources.Cases.HouseholdMember>()
                .ForMember(d => d.LinkedRegistrantId, opts => opts.Ignore())
                .ForMember(d => d.RestrictedAccess, opts => opts.Ignore())
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Submissions.Pet, Resources.Cases.Pet>()
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Submissions.NeedsAssessment, Resources.Cases.NeedsAssessment>()
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Submissions.RegistrantProfile, Resources.Contacts.Contact>()
                .ForMember(d => d.Authenticated, opts => opts.MapFrom(s => s.AuthenticatedUser))
                .ForMember(d => d.Verified, opts => opts.MapFrom(s => s.VerifiedUser))
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Submissions.Address, Resources.Contacts.Address>()
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Submissions.SecurityQuestion, Resources.Contacts.SecurityQuestion>()
                .ForMember(d => d.AnswerIsMasked, opts => opts.MapFrom(s => !s.AnswerChanged))
                .ReverseMap()
                .ForMember(d => d.AnswerChanged, opts => opts.MapFrom(s => false))
                ;
        }
    }
}
