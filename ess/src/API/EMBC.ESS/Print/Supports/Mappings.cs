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
using System.Linq;
using AutoMapper;
using EMBC.ESS.Resources.Cases;
using EMBC.ESS.Resources.Suppliers;

namespace EMBC.ESS.Print.Supports
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<Support, PrintReferral>()
               .IncludeAllDerived()
               .ForMember(d => d.FromDate, m => m.MapFrom(s => s.From.ToString("dd-MMM-yyyy")))
               .ForMember(d => d.FromTime, m => m.MapFrom(s => s.From.ToString("hh:mm tt")))
               .ForMember(d => d.ToDate, m => m.MapFrom(s => s.To.ToString("dd-MMM-yyyy")))
               .ForMember(d => d.ToTime, m => m.MapFrom(s => s.To.ToString("hh:mm tt")))
               .ForMember(d => d.SupportType, m => m.MapFrom(s => s.SupportType.ToString()))
               .ForMember(d => d.IncidentTaskNumber, m => m.MapFrom(s => s.taskId))
               .ForMember(d => d.EssNumber, m => m.MapFrom(s => s.fileId))
               .ForMember(d => d.PrintDate, m => m.MapFrom(s => DateTime.UtcNow.ToString("dd-MMM-yyyy")))
               .ForMember(d => d.HostCommunity, m => m.MapFrom(s => s.HostCommunity))
               .ForMember(d => d.PrintEvacuees, m => m.MapFrom(s => s.HouseholdMembers.Select(e => new PrintEvacuee
               {
                   Id = e.Id.ToString(),
                   FirstName = e.FirstName,
                   LastName = e.LastName,
                   EvacueeTypeCode = MapPrintEvacueeTypeCode(e.IsPrimaryRegistrant, e.IsUnder19)
               })))
               .ForAllOtherMembers(opt => opt.Ignore())
               ;

            CreateMap<Referral, PrintReferral>()
               .IncludeAllDerived()
               .ForMember(d => d.PurchaserName, opts => opts.MapFrom(s => s.IssuedToPersonName))
               ;

            CreateMap<FoodRestaurantReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.NumBreakfasts, opts => opts.MapFrom(s => s.NumberOfBreakfastsPerPerson))
                .ForMember(d => d.NumLunches, opts => opts.MapFrom(s => s.NumberOfLunchesPerPerson))
                .ForMember(d => d.NumDinners, opts => opts.MapFrom(s => s.NumberOfDinnersPerPerson))
                .ForMember(d => d.Comments, opts => opts.MapFrom(s => s.SupplierNotes))
                ;

            CreateMap<ClothingReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.Comments, opts => opts.MapFrom(s => s.SupplierNotes))
                ;

            CreateMap<IncidentalsReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.ApprovedItems, opts => opts.MapFrom(s => s.ApprovedItems))
                .ForMember(d => d.Comments, opts => opts.MapFrom(s => s.SupplierNotes))
                ;

            CreateMap<FoodGroceriesReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.NumDaysMeals, opts => opts.MapFrom(s => s.NumberOfDays))
                .ForMember(d => d.Comments, opts => opts.MapFrom(s => s.SupplierNotes))
                ;

            CreateMap<LodgingHotelReferral, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.NumRooms, opts => opts.MapFrom(s => s.NumberOfRooms))
                .ForMember(d => d.Comments, opts => opts.MapFrom(s => s.SupplierNotes))
                ;

            CreateMap<LodgingBilletingReferral, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Comments, opts => opts.MapFrom(s => s.SupplierNotes))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(supplier =>
                new PrintSupplier
                {
                    Address = supplier.HostAddress,
                    City = supplier.HostCity,
                    Telephone = supplier.HostPhone,
                    Name = supplier.HostName
                }))
                ;

            CreateMap<LodgingGroupReferral, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Comments, opts => opts.MapFrom(s => s.SupplierNotes))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(supplier =>
                new PrintSupplier
                {
                    Address = supplier.FacilityAddress,
                    City = supplier.FacilityCity,
                    Telephone = supplier.FacilityContactPhone,
                    Name = supplier.FacilityName
                }))
                ;

            CreateMap<TransportationOtherReferral, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount))
                .ForMember(d => d.OtherTransportModeDetails, opts => opts.MapFrom(s => s.TransportMode))
                .ForMember(d => d.Comments, opts => opts.MapFrom(s => s.SupplierNotes))
                ;

            CreateMap<TransportationTaxiReferral, PrintReferral>()
                .ForMember(d => d.FromAddress, opts => opts.MapFrom(s => s.FromAddress))
                .ForMember(d => d.ToAddress, opts => opts.MapFrom(s => s.ToAddress))
                .ForMember(d => d.Comments, opts => opts.MapFrom(s => s.SupplierNotes))
                ;

            CreateMap<Supplier, PrintSupplier>()
                .ForMember(d => d.Address, opts => opts.MapFrom(s => s.Address.AddressLine1 + s.Address.AddressLine2))
                .ForMember(d => d.City, opts => opts.MapFrom(s => s.Address.City))
                .ForMember(d => d.Name, opts => opts.MapFrom(s => !string.IsNullOrEmpty(s.Name) ? s.Name : s.LegalName))
                .ForMember(d => d.Province, opts => opts.MapFrom(s => s.Address.StateProvince))
                .ForMember(d => d.PostalCode, opts => opts.MapFrom(s => s.Address.PostalCode))
                .ForMember(d => d.Telephone, opts => opts.MapFrom(s => s.Contact.Phone))
                .ForMember(d => d.Fax, opts => opts.Ignore())
                .ForMember(d => d.Active, opts => opts.Ignore())
                ;
        }

        private string MapPrintEvacueeTypeCode(bool isPrimaryRegistrant, bool isUnder19)
        {
            if (isPrimaryRegistrant)
            {
                return "F";
            }
            if (isUnder19)
            {
                return "C";
            }
            return "A";
        }
    }
}
