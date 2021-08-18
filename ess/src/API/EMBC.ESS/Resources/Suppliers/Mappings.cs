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
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Suppliers
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<era_essteamsupplier, Supplier>()
                .ForMember(d => d.TeamSupplierId, opts => opts.MapFrom(s => s.era_essteamsupplierid))
                .ForPath(d => d.SupplierId, opts => opts.MapFrom(s => s.era_SupplierId.era_supplierid))
                .ForPath(d => d.Name, opts => opts.MapFrom(s => s.era_SupplierId.era_suppliername))
                .ForPath(d => d.LegalName, opts => opts.MapFrom(s => s.era_SupplierId.era_supplierlegalname))
                .ForPath(d => d.GSTNumber, opts => opts.MapFrom(s => s.era_SupplierId.era_gstnumber))
                .ForPath(d => d.Address.AddressLine1, opts => opts.MapFrom(s => s.era_SupplierId.era_addressline1))
                .ForPath(d => d.Address.AddressLine2, opts => opts.MapFrom(s => s.era_SupplierId.era_addressline2))
                .ForPath(d => d.Address.City, opts => opts.Ignore())
                .ForPath(d => d.Address.Community, opts => opts.MapFrom(s => s.era_SupplierId.era_RelatedCity != null ? s.era_SupplierId.era_RelatedCity.era_jurisdictionid.ToString() : null))
                .ForPath(d => d.Address.PostalCode, opts => opts.MapFrom(s => s.era_SupplierId.era_postalcode))
                .ForPath(d => d.Address.StateProvince, opts => opts.MapFrom(s => s.era_SupplierId.era_RelatedProvinceState != null ? s.era_SupplierId.era_RelatedProvinceState.era_code : null))
                .ForPath(d => d.Address.Country, opts => opts.MapFrom(s => s.era_SupplierId.era_RelatedCountry != null ? s.era_SupplierId.era_RelatedCountry.era_countrycode : null))
                .ForPath(d => d.Contact.Id, opts => opts.MapFrom(s => s.era_SupplierId._era_primarycontact_value))
                .ForPath(d => d.Contact.FirstName, opts => opts.MapFrom(s => s.era_SupplierId.era_PrimaryContact != null ? s.era_SupplierId.era_PrimaryContact.era_firstname : null))
                .ForPath(d => d.Contact.LastName, opts => opts.MapFrom(s => s.era_SupplierId.era_PrimaryContact != null ? s.era_SupplierId.era_PrimaryContact.era_lastname : null))
                .ForPath(d => d.Contact.Phone, opts => opts.MapFrom(s => s.era_SupplierId.era_PrimaryContact != null ? s.era_SupplierId.era_PrimaryContact.era_homephone : null))
                .ForPath(d => d.Contact.Email, opts => opts.MapFrom(s => s.era_SupplierId.era_PrimaryContact != null ? s.era_SupplierId.era_PrimaryContact.emailaddress : null))
                .ForPath(d => d.Team.Id, opts => opts.MapFrom(s => s.era_ESSTeamID.era_essteamid))
                .ForPath(d => d.Team.Name, opts => opts.MapFrom(s => s.era_ESSTeamID.era_name))
                .ForMember(d => d.GivenTeams, opts => opts.MapFrom(s => Array.Empty<Team>()))
                .ForMember(d => d.IsPrimarySupplier, opts => opts.MapFrom(s => s.era_isprimarysupplier))
                .ForMember(d => d.Active, opts => opts.MapFrom(s => s.era_active))
                ;

            CreateMap<era_essteam, Team>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_essteamid))
                .ForMember(d => d.Name, opts => opts.MapFrom(s => s.era_name))
                ;

            CreateMap<era_suppliercontact, SupplierContact>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_suppliercontactid))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.era_firstname))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.era_lastname))
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.era_homephone))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.emailaddress))
                ;
        }
    }
}
