using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using EMBC.Utilities.Extensions;

namespace EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            //referral printing mappings
            CreateMap<Shared.Contracts.Events.Support, PrintReferral>()
                .IncludeAllDerived()
                .ForMember(d => d.Id, m => m.MapFrom(s => s.Id))
                .ForMember(d => d.PurchaserName, opts => opts.MapFrom(s => s.SupportDelivery is Shared.Contracts.Events.Referral
                    ? ((Shared.Contracts.Events.Referral)s.SupportDelivery).IssuedToPersonName
                    : null))
                .ForMember(d => d.FromDate, m => m.MapFrom(s => s.From.ToPST().ToString("dd-MMM-yyyy")))
                .ForMember(d => d.FromTime, m => m.MapFrom(s => s.From.ToPST().ToString("hh:mm tt")))
                .ForMember(d => d.ToDate, m => m.MapFrom(s => s.To.ToPST().ToString("dd-MMM-yyyy")))
                .ForMember(d => d.ToTime, m => m.MapFrom(s => s.To.ToPST().ToString("hh:mm tt")))
                .ForMember(d => d.Type, m => m.MapFrom(s => MapSupportType(s)))
                .ForMember(d => d.PrintDate, m => m.MapFrom(s => DateTime.Now.ToPST().ToString("dd-MMM-yyyy")))
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
                .ForMember(d => d.PrintableEvacuees, opts => opts.Ignore())
                .AfterMap((s, d, ctx) =>
                {
                    var file = (Shared.Contracts.Events.EvacuationFile)ctx.Items["evacuationFile"];
                    if (file == null) return;
                    d.IncidentTaskNumber = file.RelatedTask.Id;
                    d.EssNumber = file.Id;
                    d.HostCommunity = file.RelatedTask.CommunityCode;
                    d.Evacuees = ctx.Mapper.Map<IEnumerable<PrintEvacuee>>(file.HouseholdMembers.Where(m => s.IncludedHouseholdMembers.Contains(m.Id)));
                })
                ;

            CreateMap<Shared.Contracts.Events.Support, PrintSummary>()
                .IncludeAllDerived()
                .ForMember(d => d.Id, m => m.MapFrom(s => s.Id))
                .ForMember(d => d.Type, m => m.MapFrom(s => MapSupportType(s)))
                .ForMember(d => d.PurchaserName, opts => opts.MapFrom(s => s.SupportDelivery is Shared.Contracts.Events.Referral
                    ? ((Shared.Contracts.Events.Referral)s.SupportDelivery).IssuedToPersonName
                    : null))
                .ForMember(d => d.FromDate, m => m.MapFrom(s => s.From.ToPST().ToString("dd-MMM-yyyy")))
                .ForMember(d => d.FromTime, m => m.MapFrom(s => s.From.ToPST().ToString("hh:mm tt")))
                .ForMember(d => d.ToDate, m => m.MapFrom(s => s.To.ToPST().ToString("dd-MMM-yyyy")))
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
                .ForMember(d => d.IsEtransfer, opts => opts.MapFrom(s => s.SupportDelivery is Shared.Contracts.Events.ETransfer))
                .ForMember(d => d.NotificationInformation, opts => opts.MapFrom(s => s.SupportDelivery is Shared.Contracts.Events.ETransfer
                    ? ((Shared.Contracts.Events.Interac)s.SupportDelivery)
                    : null))
                .ForMember(d => d.EssNumber, opts => opts.Ignore())
                .AfterMap((s, d, ctx) =>
                {
                    var file = (Shared.Contracts.Events.EvacuationFile)ctx.Items["evacuationFile"];
                    if (file == null) return;
                    d.EssNumber = file.Id;
                })
                ;

            CreateMap<Shared.Contracts.Events.Interac, NotificationInformation>()
                .ForMember(d => d.RecipientId, opts => opts.MapFrom(s => s.ReceivingRegistrantId))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.NotificationEmail))
                .ForMember(d => d.Mobile, opts => opts.MapFrom(s => s.NotificationMobile))
                ;

            CreateMap<Shared.Contracts.Events.FoodRestaurantSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.NumBreakfasts, opts => opts.MapFrom(s => s.NumberOfBreakfastsPerPerson))
                .ForMember(d => d.NumLunches, opts => opts.MapFrom(s => s.NumberOfLunchesPerPerson))
                .ForMember(d => d.NumDinners, opts => opts.MapFrom(s => s.NumberOfDinnersPerPerson))
                ;

            CreateMap<Shared.Contracts.Events.ClothingSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                ;

            CreateMap<Shared.Contracts.Events.IncidentalsSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.ApprovedItems, opts => opts.MapFrom(s => s.ApprovedItems))
                ;

            CreateMap<Shared.Contracts.Events.FoodGroceriesSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.NumDaysMeals, opts => opts.MapFrom(s => s.NumberOfDays))
                ;

            CreateMap<Shared.Contracts.Events.LodgingHotelSupport, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.NumRooms, opts => opts.MapFrom(s => s.NumberOfRooms))
                ;

            CreateMap<Shared.Contracts.Events.LodgingBilletingSupport, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(s => new PrintSupplier
                {
                    Address = s.HostAddress,
                    City = s.HostCity,
                    Telephone = s.HostPhone,
                    Name = s.HostName
                }))
                ;

            CreateMap<Shared.Contracts.Events.LodgingGroupSupport, PrintReferral>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(supplier => new PrintSupplier
                {
                    Address = supplier.FacilityAddress,
                    City = supplier.FacilityCity,
                    Telephone = supplier.FacilityContactPhone,
                    Name = supplier.FacilityName
                }))
                ;

            CreateMap<Shared.Contracts.Events.TransportationOtherSupport, PrintReferral>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.OtherTransportModeDetails, opts => opts.MapFrom(s => s.TransportMode))
                ;

            CreateMap<Shared.Contracts.Events.TransportationTaxiSupport, PrintReferral>()
                .ForMember(d => d.FromAddress, opts => opts.MapFrom(s => s.FromAddress))
                .ForMember(d => d.ToAddress, opts => opts.MapFrom(s => s.ToAddress))
                ;

            CreateMap<Shared.Contracts.Events.FoodRestaurantSupport, PrintSummary>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.NumBreakfasts, opts => opts.MapFrom(s => s.NumberOfBreakfastsPerPerson))
                .ForMember(d => d.NumLunches, opts => opts.MapFrom(s => s.NumberOfLunchesPerPerson))
                .ForMember(d => d.NumDinners, opts => opts.MapFrom(s => s.NumberOfDinnersPerPerson))
                ;

            CreateMap<Shared.Contracts.Events.ClothingSupport, PrintSummary>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                ;

            CreateMap<Shared.Contracts.Events.IncidentalsSupport, PrintSummary>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                ;

            CreateMap<Shared.Contracts.Events.FoodGroceriesSupport, PrintSummary>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.NumDaysMeals, opts => opts.MapFrom(s => s.NumberOfDays))
                ;

            CreateMap<Shared.Contracts.Events.LodgingHotelSupport, PrintSummary>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.NumRooms, opts => opts.MapFrom(s => s.NumberOfRooms))
                ;

            CreateMap<Shared.Contracts.Events.LodgingBilletingSupport, PrintSummary>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(s => new PrintSupplier
                {
                    Address = s.HostAddress,
                    City = s.HostCity,
                    Telephone = s.HostPhone,
                    Name = s.HostName
                }))
                ;

            CreateMap<Shared.Contracts.Events.LodgingGroupSupport, PrintSummary>()
                .ForMember(d => d.NumNights, opts => opts.MapFrom(s => s.NumberOfNights))
                .ForMember(d => d.Supplier, opts => opts.MapFrom(supplier => new PrintSupplier
                {
                    Address = supplier.FacilityAddress,
                    City = supplier.FacilityCity,
                    Telephone = supplier.FacilityContactPhone,
                    Name = supplier.FacilityName
                }))
                ;

            CreateMap<Shared.Contracts.Events.TransportationOtherSupport, PrintSummary>()
                .ForMember(d => d.TotalAmountPrinted, opts => opts.MapFrom(s => s.TotalAmount.ToString("0.00")))
                .ForMember(d => d.OtherTransportModeDetails, opts => opts.MapFrom(s => s.TransportMode))
                ;

            CreateMap<Shared.Contracts.Events.TransportationTaxiSupport, PrintSummary>()
                .ForMember(d => d.FromAddress, opts => opts.MapFrom(s => s.FromAddress))
                .ForMember(d => d.ToAddress, opts => opts.MapFrom(s => s.ToAddress))
                ;

            CreateMap<Shared.Contracts.Events.SupplierDetails, PrintSupplier>()
                .ForMember(d => d.Address, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.Address.AddressLine2) ? s.Address.AddressLine1 : s.Address.AddressLine1 + "," + s.Address.AddressLine2))
                .ForMember(d => d.City, opts => opts.MapFrom(s => s.Address.City))
                .ForMember(d => d.Community, opts => opts.MapFrom(s => s.Address.Community))
                .ForMember(d => d.Province, opts => opts.MapFrom(s => s.Address.StateProvince))
                .ForMember(d => d.PostalCode, opts => opts.MapFrom(s => s.Address.PostalCode))
                .ForMember(d => d.Telephone, opts => opts.MapFrom(s => s.Phone))
                ;

            Func<Shared.Contracts.Events.HouseholdMember, string> mapEvacueeTType = m =>
                m.IsPrimaryRegistrant
                    ? "F" //family representative
                    : m.IsMinor
                        ? "C" //child
                        : "A"; //adult

            CreateMap<Shared.Contracts.Events.HouseholdMember, PrintEvacuee>()
                .ForMember(d => d.EvacueeTypeCode, opts => opts.MapFrom(s => mapEvacueeTType(s)))
                ;
        }

        private static Shared.Contracts.Events.Referral GetReferralOrNull(Shared.Contracts.Events.Support support) => support.SupportDelivery as Shared.Contracts.Events.Referral;

        private static PrintReferralType MapSupportType(Shared.Contracts.Events.Support support) =>
            support switch
            {
                Shared.Contracts.Events.ClothingSupport _ => PrintReferralType.Clothing,
                Shared.Contracts.Events.FoodGroceriesSupport _ => PrintReferralType.Groceries,
                Shared.Contracts.Events.FoodRestaurantSupport _ => PrintReferralType.Meals,
                Shared.Contracts.Events.IncidentalsSupport _ => PrintReferralType.Incidentals,
                Shared.Contracts.Events.LodgingBilletingSupport _ => PrintReferralType.Billeting,
                Shared.Contracts.Events.LodgingGroupSupport _ => PrintReferralType.GroupLodging,
                Shared.Contracts.Events.LodgingHotelSupport _ => PrintReferralType.Hotel,
                Shared.Contracts.Events.TransportationOtherSupport _ => PrintReferralType.Transportation,
                Shared.Contracts.Events.TransportationTaxiSupport _ => PrintReferralType.Taxi,
                _ => throw new NotImplementedException()
            };
    }
}
