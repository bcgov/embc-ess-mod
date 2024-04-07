using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Extensions;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            //referral printing mappings
            CreateMap<Support, PrintReferral>()
                .IncludeAllDerived()
                .ForMember(d => d.Id, m => m.MapFrom(s => s.Id))
                .ForMember(d => d.PurchaserName, opts => opts.MapFrom(s => s.SupportDelivery is Referral
                    ? ((Referral)s.SupportDelivery).IssuedToPersonName
                    : null))
                .ForMember(d => d.FromDate, m => m.MapFrom(s => s.From.ToPST().ToString("MMM-dd-yyyy", CultureInfo.InvariantCulture)))
                .ForMember(d => d.FromTime, m => m.MapFrom(s => s.From.ToPST().ToString("hh:mm tt")))
                .ForMember(d => d.ToDate, m => m.MapFrom(s => s.To.ToPST().ToString("MMM-dd-yyyy", CultureInfo.InvariantCulture)))
                .ForMember(d => d.ToTime, m => m.MapFrom(s => s.To.ToPST().ToString("hh:mm tt")))
                .ForMember(d => d.Type, m => m.MapFrom(s => MapSupportType(s)))
                .ForMember(d => d.PrintDate, m => m.MapFrom(s => DateTime.Now.ToPST().ToString("MMM-dd-yyyy", CultureInfo.InvariantCulture)))
                .ForMember(d => d.Comments, opts => opts.MapFrom(s => GetReferralOrNull(s) == null ? null : GetReferralOrNull(s).SupplierNotes))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(s => GetReferralOrNull(s) == null ? null : GetReferralOrNull(s).SupplierDetails))
                .ForMember(d => d.IncidentTaskNumber, opts => opts.Ignore())
                .ForMember(d => d.EssNumber, opts => opts.Ignore())
                .ForMember(d => d.HostCommunity, opts => opts.Ignore())
                .ForMember(d => d.Evacuees, opts => opts.Ignore())
                .ForMember(d => d.TotalAmountPrinted, opts => opts.Ignore())
                .ForMember(d => d.ApprovedItems, opts => opts.Ignore())
                .ForMember(d => d.VolunteerFirstName, opts => opts.Ignore())
                .ForMember(d => d.VolunteerLastName, opts => opts.Ignore())
                .ForMember(d => d.EssTeamName, opts => opts.Ignore())
                .ForMember(d => d.DisplayWatermark, opts => opts.Ignore())
                .ForMember(d => d.NumBreakfasts, opts => opts.Ignore())
                .ForMember(d => d.NumLunches, opts => opts.Ignore())
                .ForMember(d => d.NumDinners, opts => opts.Ignore())
                .ForMember(d => d.NumDaysMeals, opts => opts.Ignore())
                .ForMember(d => d.NumNights, opts => opts.Ignore())
                .ForMember(d => d.NumRooms, opts => opts.Ignore())
                .ForMember(d => d.FromAddress, opts => opts.Ignore())
                .ForMember(d => d.ToAddress, opts => opts.Ignore())
                .ForMember(d => d.OtherTransportModeDetails, opts => opts.Ignore())
                .ForMember(d => d.ContactEmail, opts => opts.Ignore())
                .ForMember(d => d.ContactName, opts => opts.Ignore())
                .ForMember(d => d.ContactPhone, opts => opts.Ignore())
                .ForMember(d => d.PrintableEvacuees, opts => opts.Ignore())
                .AfterMap((s, d, ctx) =>
                {
                    var file = (EvacuationFile)ctx.Items["evacuationFile"];
                    if (file == null) return;
                    d.IncidentTaskNumber = file.RelatedTask.Id;
                    d.EssNumber = file.Id;
                    d.HostCommunity = file.RelatedTask.CommunityCode;
                    d.Evacuees = ctx.Mapper.Map<IEnumerable<PrintEvacuee>>(file.HouseholdMembers.Where(m => s.IncludedHouseholdMembers.Contains(m.Id)));
                })
                ;

            CreateMap<Support, PrintSummary>()
                .IncludeAllDerived()
                .ForMember(d => d.Id, m => m.MapFrom(s => s.Id))
                .ForMember(d => d.Type, m => m.MapFrom(s => MapSupportType(s)))
                .ForMember(d => d.PurchaserName, opts => opts.MapFrom(s => s.SupportDelivery is Referral
                    ? ((Referral)s.SupportDelivery).IssuedToPersonName
                    : null))
                .ForMember(d => d.FromDate, m => m.MapFrom(s => s.From.ToPST().ToString("MMM-dd-yyyy", CultureInfo.InvariantCulture)))
                .ForMember(d => d.FromTime, m => m.MapFrom(s => s.From.ToPST().ToString("hh:mm tt")))
                .ForMember(d => d.ToDate, m => m.MapFrom(s => s.To.ToPST().ToString("MMM-dd-yyyy", CultureInfo.InvariantCulture)))
                .ForMember(d => d.ToTime, m => m.MapFrom(s => s.To.ToPST().ToString("hh:mm tt")))
                .ForMember(d => d.TotalAmountPrinted, opts => opts.Ignore())
                .ForMember(d => d.NumBreakfasts, opts => opts.Ignore())
                .ForMember(d => d.NumLunches, opts => opts.Ignore())
                .ForMember(d => d.NumDinners, opts => opts.Ignore())
                .ForMember(d => d.NumDaysMeals, opts => opts.Ignore())
                .ForMember(d => d.NumNights, opts => opts.Ignore())
                .ForMember(d => d.NumRooms, opts => opts.Ignore())
                .ForMember(d => d.FromAddress, opts => opts.Ignore())
                .ForMember(d => d.ToAddress, opts => opts.Ignore())
                .ForMember(d => d.OtherTransportModeDetails, opts => opts.Ignore())
                .ForMember(d => d.Supplier, opts => opts.MapFrom(s => GetReferralOrNull(s) == null ? null : GetReferralOrNull(s).SupplierDetails))
                .ForMember(d => d.IsEtransfer, opts => opts.MapFrom(s => s.SupportDelivery is ETransfer))
                .ForMember(d => d.NotificationInformation, opts => opts.MapFrom(s => s.SupportDelivery is ETransfer
                    ? ((Interac)s.SupportDelivery)
                    : null))
                .ForMember(d => d.EssNumber, opts => opts.Ignore())
                .AfterMap((s, d, ctx) =>
                {
                    var file = (EvacuationFile)ctx.Items["evacuationFile"];
                    if (file == null) return;
                    d.EssNumber = file.Id;
                })
                ;

            CreateMap<Interac, NotificationInformation>()
                .ForMember(d => d.RecipientId, opts => opts.MapFrom(s => s.ReceivingRegistrantId))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.NotificationEmail))
                .ForMember(d => d.Mobile, opts => opts.MapFrom(s => s.NotificationMobile))
                ;

            CreateMap<FoodRestaurantSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.NumBreakfasts, opts => opts.MapFrom(s => s.NumberOfBreakfastsPerPerson))
                .ForMember(d => d.NumLunches, opts => opts.MapFrom(s => s.NumberOfLunchesPerPerson))
                .ForMember(d => d.NumDinners, opts => opts.MapFrom(s => s.NumberOfDinnersPerPerson))
                ;

            CreateMap<ClothingSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                ;

            CreateMap<IncidentalsSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.ApprovedItems, opts => opts.MapFrom(s => s.ApprovedItems))
                ;

            CreateMap<FoodGroceriesSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.NumDaysMeals, opts => opts.MapFrom(s => s.NumberOfDays))
                ;

            CreateMap<ShelterHotelSupport, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.NumRooms, opts => opts.MapFrom(s => s.NumberOfRooms))
                ;

            CreateMap<ShelterBilletingSupport, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(s => new PrintSupplier
                {
                    Address = s.HostAddress,
                    City = s.HostCity,
                    Telephone = s.HostPhone,
                    Name = s.HostName
                }))
                ;

            CreateMap<ShelterGroupSupport, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(supplier => new PrintSupplier
                {
                    Address = supplier.FacilityAddress,
                    City = supplier.FacilityCity,
                    Telephone = supplier.FacilityContactPhone,
                    Name = supplier.FacilityName
                }))
                ;

            CreateMap<ShelterAllowanceSupport, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.ContactPhone, opts => opts.MapFrom(s => s.ContactPhone))
                .ForMember(d => d.ContactEmail, opts => opts.MapFrom(s => s.ContactEmail))
                .AfterMap((s, d) =>
                {
                    if (s.SupportDelivery is Referral r) d.ContactName = r.IssuedToPersonName;
                    if (s.SupportDelivery is Interac i) d.ContactName = $"{i.RecipientFirstName} {i.RecipientLastName}";
                })
                ;

            CreateMap<TransportationOtherSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.OtherTransportModeDetails, opts => opts.MapFrom(s => s.TransportMode))
                ;

            CreateMap<TransportationTaxiSupport, PrintReferral>()
                .ForMember(d => d.FromAddress, opts => opts.MapFrom(s => s.FromAddress))
                .ForMember(d => d.ToAddress, opts => opts.MapFrom(s => s.ToAddress))
                ;

            CreateMap<FoodRestaurantSupport, PrintSummary>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.NumBreakfasts, opts => opts.MapFrom(s => s.NumberOfBreakfastsPerPerson))
                .ForMember(d => d.NumLunches, opts => opts.MapFrom(s => s.NumberOfLunchesPerPerson))
                .ForMember(d => d.NumDinners, opts => opts.MapFrom(s => s.NumberOfDinnersPerPerson))
                ;

            CreateMap<ClothingSupport, PrintSummary>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                ;

            CreateMap<IncidentalsSupport, PrintSummary>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                ;

            CreateMap<FoodGroceriesSupport, PrintSummary>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.NumDaysMeals, opts => opts.MapFrom(s => s.NumberOfDays))
                ;

            CreateMap<ShelterHotelSupport, PrintSummary>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.NumRooms, opts => opts.MapFrom(s => s.NumberOfRooms))
                ;

            CreateMap<ShelterBilletingSupport, PrintSummary>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(s => new PrintSupplier
                {
                    Address = s.HostAddress,
                    City = s.HostCity,
                    Telephone = s.HostPhone,
                    Name = s.HostName
                }))
                ;

            CreateMap<ShelterGroupSupport, PrintSummary>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(supplier => new PrintSupplier
                {
                    Address = supplier.FacilityAddress,
                    City = supplier.FacilityCity,
                    Telephone = supplier.FacilityContactPhone,
                    Name = supplier.FacilityName
                }))
                ;

            CreateMap<TransportationOtherSupport, PrintSummary>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.OtherTransportModeDetails, opts => opts.MapFrom(s => s.TransportMode))
                ;

            CreateMap<TransportationTaxiSupport, PrintSummary>()
                .ForMember(d => d.FromAddress, opts => opts.MapFrom(s => s.FromAddress))
                .ForMember(d => d.ToAddress, opts => opts.MapFrom(s => s.ToAddress))
                ;

            CreateMap<SupplierDetails, PrintSupplier>()
                .ForMember(d => d.Address, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.Address.AddressLine2) ? s.Address.AddressLine1 : s.Address.AddressLine1 + "," + s.Address.AddressLine2))
                .ForMember(d => d.City, opts => opts.MapFrom(s => s.Address.City))
                .ForMember(d => d.Community, opts => opts.MapFrom(s => s.Address.Community))
                .ForMember(d => d.Province, opts => opts.MapFrom(s => s.Address.StateProvince))
                .ForMember(d => d.PostalCode, opts => opts.MapFrom(s => s.Address.PostalCode))
                .ForMember(d => d.Telephone, opts => opts.MapFrom(s => s.Phone))
                ;

            Func<HouseholdMember, string> mapEvacueeTType = m =>
                m.IsPrimaryRegistrant
                    ? "F" //family representative
                    : m.IsMinor
                        ? "C" //child
                        : "A"; //adult

            CreateMap<HouseholdMember, PrintEvacuee>()
                .ForMember(d => d.EvacueeTypeCode, opts => opts.MapFrom(s => mapEvacueeTType(s)))
                ;
        }

        private static Referral GetReferralOrNull(Support support) => support.SupportDelivery as Referral;

        private static PrintReferralType MapSupportType(Support support) =>
            support switch
            {
                ClothingSupport _ => PrintReferralType.Clothing,
                FoodGroceriesSupport _ => PrintReferralType.Groceries,
                FoodRestaurantSupport _ => PrintReferralType.Meals,
                IncidentalsSupport _ => PrintReferralType.Incidentals,
                ShelterBilletingSupport _ => PrintReferralType.Billeting,
                ShelterGroupSupport _ => PrintReferralType.GroupLodging,
                ShelterHotelSupport _ => PrintReferralType.Hotel,
                ShelterAllowanceSupport _ => PrintReferralType.ShelterAllowance,
                TransportationOtherSupport _ => PrintReferralType.Transportation,
                TransportationTaxiSupport _ => PrintReferralType.Taxi,
                _ => throw new NotImplementedException()
            };
    }
}
