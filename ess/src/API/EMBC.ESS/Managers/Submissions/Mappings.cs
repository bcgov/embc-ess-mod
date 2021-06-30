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
using AutoMapper;

namespace EMBC.ESS.Managers.Submissions
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Shared.Contracts.Submissions.EvacuationFile, Resources.Cases.EvacuationFile>()
                .ForMember(d => d.NeedsAssessment, opts => opts.MapFrom(s => s.NeedsAssessment))
                .ForPath(d => d.NeedsAssessment.EvacuatedFrom, opts => opts.MapFrom(s => s.EvacuatedFromAddress))
                .ForMember(d => d.HouseholdMembers, opts => opts.Ignore())
                .ForMember(d => d.EvacuationDate, opts => opts.MapFrom(s => !s.EvacuationDate.HasValue ? DateTime.UtcNow : s.EvacuationDate))
                .ForMember(d => d.CreatedOn, opts => opts.Ignore())
                .ForMember(d => d.LastModified, opts => opts.Ignore())
                .ForMember(d => d.IsSecurityPhraseMasked, opts => opts.Ignore())
                ;

            CreateMap<Resources.Cases.EvacuationFile, Shared.Contracts.Submissions.EvacuationFile>()
                .ForMember(d => d.EvacuatedFromAddress, opts => opts.MapFrom(s => s.EvacuatedFrom))
                ;

            CreateMap<Shared.Contracts.Submissions.Address, Resources.Cases.EvacuationAddress>()
                .ForMember(d => d.CommunityCode, opts => opts.MapFrom(s => s.Community))
                .ReverseMap()
                .ForMember(d => d.Community, opts => opts.MapFrom(s => s.CommunityCode))
                ;

            CreateMap<Shared.Contracts.Submissions.HouseholdMember, Resources.Cases.HouseholdMember>()
                .ForMember(d => d.HasAccessRestriction, opts => opts.Ignore())
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Submissions.Pet, Resources.Cases.Pet>()
                .ForMember(d => d.Id, opts => opts.Ignore())
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Submissions.NeedsAssessment, Resources.Cases.NeedsAssessment>()
                .ForMember(d => d.EvacuatedFrom, opts => opts.Ignore())
                .ForMember(d => d.CreatedOn, opts => opts.Ignore())
                .ForMember(d => d.CompletedOn, opts => opts.MapFrom(s => s.CompletedOn == default ? DateTime.UtcNow : s.CompletedOn))
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Submissions.Note, Resources.Cases.Note>()
                .ReverseMap()
                .ForMember(d => d.MemberName, opts => opts.Ignore())
                .ForMember(d => d.TeamName, opts => opts.Ignore())
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

            CreateMap<Resources.Tasks.EssTask, Shared.Contracts.Submissions.IncidentTask>();
        }
    }
}
