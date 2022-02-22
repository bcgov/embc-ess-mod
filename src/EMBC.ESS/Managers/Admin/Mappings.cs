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

using AutoMapper;
using EMBC.ESS.Resources.Metadata;

namespace EMBC.ESS.Managers.Admin
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Shared.Contracts.Team.TeamMember, Resources.Teams.TeamMember>()
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Team.Team, Resources.Teams.Team>()
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Team.AssignedCommunity, Resources.Teams.AssignedCommunity>()
                .ReverseMap()
                ;

            CreateMap<Resources.Teams.TeamMember, Shared.Contracts.Profile.UserProfile>()
                .ForMember(d => d.LastLoginDate, opts => opts.MapFrom(s => s.LastSuccessfulLogin))
                .ForMember(d => d.RequiredToSignAgreement, opts => opts.MapFrom(s => !s.AgreementSignDate.HasValue))
                ;

            CreateMap<Resources.Suppliers.Supplier, Shared.Contracts.Suppliers.Supplier>()
                ;

            CreateMap<Shared.Contracts.Suppliers.Supplier, Resources.Suppliers.Supplier>()
                ;

            CreateMap<Resources.Suppliers.SupplierContact, Shared.Contracts.Suppliers.SupplierContact>()
                ;

            CreateMap<Shared.Contracts.Suppliers.SupplierContact, Resources.Suppliers.SupplierContact>()
                ;

            CreateMap<Resources.Suppliers.Team, Shared.Contracts.Suppliers.Team>()
                ;

            CreateMap<Shared.Contracts.Suppliers.Team, Resources.Suppliers.Team>()
                ;

            CreateMap<Resources.Suppliers.Address, Shared.Contracts.Suppliers.Address>()
                ;

            CreateMap<Shared.Contracts.Suppliers.Address, Resources.Suppliers.Address>()
                ;

            CreateMap<Shared.Contracts.Metadata.Country, Country>().ReverseMap();
            CreateMap<Shared.Contracts.Metadata.StateProvince, StateProvince>().ReverseMap();
            CreateMap<Shared.Contracts.Metadata.Community, Community>()
                .ForMember(c => c.DistrictCode, opts => opts.Ignore())
                .ReverseMap();
            CreateMap<OutageInformation, Shared.Contracts.Metadata.OutageInformation>();
        }
    }
}
