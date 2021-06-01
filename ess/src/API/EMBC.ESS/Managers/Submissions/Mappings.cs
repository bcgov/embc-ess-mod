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
                .ForMember(d => d.CommunityCode, opts => opts.MapFrom(s => s.Community))
                .ForMember(d => d.StateProvinceCode, opts => opts.MapFrom(s => s.StateProvince))
                .ForMember(d => d.CountryCode, opts => opts.MapFrom(s => s.Country))
                .ReverseMap()
                .ForMember(d => d.Community, opts => opts.MapFrom(s => s.CommunityCode))
                .ForMember(d => d.StateProvince, opts => opts.MapFrom(s => s.StateProvinceCode))
                .ForMember(d => d.Country, opts => opts.MapFrom(s => s.CountryCode))
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
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.CompletedOn))
                .ReverseMap()
                .ForMember(d => d.CompletedOn, opts => opts.MapFrom(s => s.CreatedOn))
                ;

            CreateMap<Shared.Contracts.Submissions.Note, Resources.Cases.Note>()
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
