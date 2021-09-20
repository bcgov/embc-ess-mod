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

using System.Linq;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Suppliers
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<era_supplier, Supplier>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_supplierid))
                .ForMember(d => d.Name, opts => opts.MapFrom(s => s.era_suppliername))
                .ForMember(d => d.LegalName, opts => opts.MapFrom(s => s.era_name))
                .ForMember(d => d.GSTNumber, opts => opts.MapFrom(s => s.era_gstnumber))
                .ForMember(d => d.Verified, opts => opts.MapFrom(s => s.statuscode == (int)SupplierVerificationStatus.Verified))
                .ForMember(d => d.Status, opts => opts.Ignore())
                .ForPath(d => d.Address.AddressLine1, opts => opts.MapFrom(s => s.era_addressline1))
                .ForPath(d => d.Address.AddressLine2, opts => opts.MapFrom(s => s.era_addressline2))
                .ForPath(d => d.Address.City, opts => opts.Ignore())
                .ForPath(d => d.Address.Community, opts => opts.MapFrom(s => s.era_RelatedCity != null ? s.era_RelatedCity.era_jurisdictionid.ToString() : null))
                .ForPath(d => d.Address.PostalCode, opts => opts.MapFrom(s => s.era_postalcode))
                .ForPath(d => d.Address.StateProvince, opts => opts.MapFrom(s => s.era_RelatedProvinceState != null ? s.era_RelatedProvinceState.era_code : null))
                .ForPath(d => d.Address.Country, opts => opts.MapFrom(s => s.era_RelatedCountry != null ? s.era_RelatedCountry.era_countrycode : null))
                .ForPath(d => d.Contact.Id, opts => opts.MapFrom(s => s._era_primarycontact_value))
                .ForPath(d => d.Contact.FirstName, opts => opts.MapFrom(s => s.era_PrimaryContact != null ? s.era_PrimaryContact.era_firstname : null))
                .ForPath(d => d.Contact.LastName, opts => opts.MapFrom(s => s.era_PrimaryContact != null ? s.era_PrimaryContact.era_lastname : null))
                .ForPath(d => d.Contact.Phone, opts => opts.MapFrom(s => s.era_PrimaryContact != null ? s.era_PrimaryContact.era_contactnumber : null))
                .ForPath(d => d.Contact.Email, opts => opts.MapFrom(s => s.era_PrimaryContact != null ? s.era_PrimaryContact.emailaddress : null))
                .ForMember(d => d.Team, opts => opts.MapFrom(s => s.era_era_supplier_era_essteamsupplier_SupplierId.SingleOrDefault(ts => ts.era_isprimarysupplier == true)))
                .ForMember(d => d.SharedWithTeams, opts => opts.MapFrom(s => s.era_era_supplier_era_essteamsupplier_SupplierId.Where(ts => ts.era_isprimarysupplier != true)))
                .AfterMap((s, d) =>
                {
                    var responsibleTeam = s.era_era_supplier_era_essteamsupplier_SupplierId.SingleOrDefault(ts => ts.era_isprimarysupplier == true);
                    d.Status = responsibleTeam == null
                        ? SupplierStatus.NotSet
                        : responsibleTeam.era_active == true ? SupplierStatus.Active : SupplierStatus.Inactive;
                });

            CreateMap<Supplier, era_supplier>(MemberList.None)
                .ForMember(d => d.era_supplierid, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.era_suppliername, opts => opts.MapFrom(s => s.Name))
                .ForMember(d => d.era_name, opts => opts.MapFrom(s => s.LegalName))
                .ForMember(d => d.era_gstnumber, opts => opts.MapFrom(s => s.GSTNumber))
                .ForMember(d => d.era_addressline1, opts => opts.MapFrom(s => s.Address.AddressLine1))
                .ForMember(d => d.era_addressline2, opts => opts.MapFrom(s => s.Address.AddressLine2))
                .ForMember(d => d.era_postalcode, opts => opts.MapFrom(s => s.Address.PostalCode))
                .ForMember(d => d._era_primarycontact_value, opts => opts.MapFrom(s => s.Contact.Id))
                .ForMember(d => d.era_era_supplier_era_essteamsupplier_SupplierId, opts => opts.MapFrom(s => s.Team != null ? s.SharedWithTeams.Concat(new[] { s.Team }) : s.SharedWithTeams))
                ;

            CreateMap<era_suppliercontact, SupplierContact>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_suppliercontactid))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.era_firstname))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.era_lastname))
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.era_homephone))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.emailaddress))
                ;

            CreateMap<SupplierContact, era_suppliercontact>(MemberList.None)
                .ForMember(d => d.era_suppliercontactid, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.era_firstname, opts => opts.MapFrom(s => s.FirstName))
                .ForMember(d => d.era_lastname, opts => opts.MapFrom(s => s.LastName))
                .ForMember(d => d.era_homephone, opts => opts.MapFrom(s => s.Phone))
                .ForMember(d => d.emailaddress, opts => opts.MapFrom(s => s.Email))
                ;

            CreateMap<era_essteamsupplier, Team>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_ESSTeamID.era_essteamid))
                .ForMember(d => d.Name, opts => opts.MapFrom(s => s.era_ESSTeamID.era_name))
                ;

            CreateMap<Team, era_essteamsupplier>(MemberList.None)
                .ForMember(d => d._era_essteamid_value, opts => opts.MapFrom(s => s.Id))
                ;
        }
    }
}
