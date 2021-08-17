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

namespace EMBC.ESS.Managers.Admin
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Shared.Contracts.Team.TeamMember, Resources.Team.TeamMember>()
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Team.Team, Resources.Team.Team>()
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Team.AssignedCommunity, Resources.Team.AssignedCommunity>()
                .ReverseMap()
                ;

            CreateMap<Resources.Team.TeamMember, Shared.Contracts.Profile.UserProfile>()
                .ForMember(d => d.LastLoginDate, opts => opts.MapFrom(s => s.LastSuccessfulLogin))
                .ForMember(d => d.RequiredToSignAgreement, opts => opts.MapFrom(s => !s.AgreementSignDate.HasValue))
                ;

            CreateMap<Resources.Suppliers.TeamSupplier, Shared.Contracts.Suppliers.Supplier>()
                .ForMember(d => d.SupplierId, opts => opts.MapFrom(s => s.Supplier.Id))
                .ForMember(d => d.Name, opts => opts.MapFrom(s => s.Supplier.Name))
                .ForMember(d => d.LegalName, opts => opts.MapFrom(s => s.Supplier.LegalName))
                .ForMember(d => d.GSTNumber, opts => opts.MapFrom(s => s.Supplier.GSTNumber))
                .ForMember(d => d.Contact, opts => opts.MapFrom(s => s.Supplier.Contact))
                .ForMember(d => d.Address, opts => opts.MapFrom(s => s.Supplier.Address))
                ;

            CreateMap<Shared.Contracts.Suppliers.Supplier, Resources.Suppliers.TeamSupplier>()
                .ForPath(d => d.Supplier.Id, opts => opts.MapFrom(s => s.SupplierId))
                .ForPath(d => d.Supplier.Name, opts => opts.MapFrom(s => s.Name))
                .ForPath(d => d.Supplier.LegalName, opts => opts.MapFrom(s => s.LegalName))
                .ForPath(d => d.Supplier.GSTNumber, opts => opts.MapFrom(s => s.GSTNumber))
                .ForPath(d => d.Supplier.Contact, opts => opts.MapFrom(s => s.Contact))
                .ForPath(d => d.Supplier.Address, opts => opts.MapFrom(s => s.Address))
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
        }
    }
}
