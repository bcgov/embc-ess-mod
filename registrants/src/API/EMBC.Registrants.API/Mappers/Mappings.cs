using System;
using EMBC.Registrants.API.Controllers;

namespace EMBC.Registrants.API.Mappers
{
    public class Mappings : AutoMapper.Profile
    {
        public Mappings()
        {
            CreateMap<Controllers.Profile, ESS.Shared.Contracts.Events.RegistrantProfile>()
                .ForMember(d => d.Id, opts => opts.Ignore())
                .ForMember(d => d.AuthenticatedUser, opts => opts.Ignore())
                .ForMember(d => d.VerifiedUser, opts => opts.Ignore())
                .ForMember(d => d.IsMinor, opts => opts.Ignore())
                .ForMember(d => d.UserId, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => s.PersonalDetails.DateOfBirth))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.PersonalDetails.FirstName))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.PersonalDetails.LastName))
                .ForMember(d => d.Gender, opts => opts.MapFrom(s => s.PersonalDetails.Gender))
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.PersonalDetails.Initials))
                .ForMember(d => d.PreferredName, opts => opts.MapFrom(s => s.PersonalDetails.PreferredName))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.ContactDetails.Email))
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.ContactDetails.Phone))
                .ForMember(d => d.SecurityQuestions, opts => opts.MapFrom(s => s.SecurityQuestions))
                .ForMember(d => d.CreatedOn, opts => opts.Ignore())
                .ForMember(d => d.LastModified, opts => opts.Ignore())
                .ForMember(d => d.CreatedByDisplayName, opts => opts.Ignore())
                .ForMember(d => d.CreatedByUserId, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedDisplayName, opts => opts.Ignore())
                .ForMember(d => d.LastModifiedUserId, opts => opts.Ignore())
                .ForMember(d => d.LastLogin, opts => opts.Ignore())
                .ForMember(d => d.HomeAddress, opts => opts.Ignore())
                .ReverseMap()

                .ForMember(d => d.IsMailingAddressSameAsPrimaryAddress, opts => opts.MapFrom(s =>
                    string.Equals(s.MailingAddress.Country, s.PrimaryAddress.Country, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.StateProvince, s.PrimaryAddress.StateProvince, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.Community, s.PrimaryAddress.Community, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.City, s.PrimaryAddress.City, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.PostalCode, s.PrimaryAddress.PostalCode, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.AddressLine1, s.PrimaryAddress.AddressLine1, StringComparison.InvariantCultureIgnoreCase) &&
                    string.Equals(s.MailingAddress.AddressLine2, s.PrimaryAddress.AddressLine2, StringComparison.InvariantCultureIgnoreCase)))
                ;

            CreateMap<SecurityQuestion, ESS.Shared.Contracts.Events.SecurityQuestion>()
                .ReverseMap()
                ;

            CreateMap<Address, ESS.Shared.Contracts.Events.Address>()
                .ReverseMap()
                ;

            CreateMap<NeedsAssessment, ESS.Shared.Contracts.Events.NeedsAssessment>()
                .ForMember(d => d.CompletedOn, opts => opts.MapFrom(s => DateTime.UtcNow))
                .ForMember(d => d.Notes, opts => opts.Ignore())
                .ForMember(d => d.CompletedBy, opts => opts.Ignore())
                .ForMember(d => d.TaskNumber, opts => opts.Ignore())
             ;

            CreateMap<ESS.Shared.Contracts.Events.NeedsAssessment, NeedsAssessment>()
             ;

            CreateMap<HouseholdMember, ESS.Shared.Contracts.Events.HouseholdMember>()
                .ForMember(d => d.DateOfBirth, opts => opts.MapFrom(s => s.Details.DateOfBirth))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.Details.FirstName))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.Details.LastName))
                .ForMember(d => d.Gender, opts => opts.MapFrom(s => s.Details.Gender))
                .ForMember(d => d.Initials, opts => opts.MapFrom(s => s.Details.Initials))
                .ForMember(d => d.IsPrimaryRegistrant, opts => opts.MapFrom(s => s.IsPrimaryRegistrant))
                .ForMember(d => d.LinkedRegistrantId, opts => opts.Ignore())
                .ForMember(d => d.RestrictedAccess, opts => opts.Ignore())
                .ForMember(d => d.Verified, opts => opts.Ignore())
                .ForMember(d => d.Authenticated, opts => opts.Ignore())
                .ForMember(d => d.IsMinor, opts => opts.Ignore())
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.ContactDetails.Email))
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.ContactDetails.Phone))
                ;

            CreateMap<ESS.Shared.Contracts.Events.HouseholdMember, HouseholdMember>()
                .ForPath(d => d.Details.FirstName, opts => opts.MapFrom(s => s.FirstName))
                .ForPath(d => d.Details.LastName, opts => opts.MapFrom(s => s.LastName))
                .ForPath(d => d.Details.Gender, opts => opts.MapFrom(s => s.Gender))
                .ForPath(d => d.Details.Initials, opts => opts.MapFrom(s => s.Initials))
                .ForPath(d => d.Details.DateOfBirth, opts => opts.MapFrom(s => s.DateOfBirth))
                .ForPath(d => d.ContactDetails.Phone, opts => opts.MapFrom(s => s.Phone))
                .ForPath(d => d.ContactDetails.Email, opts => opts.MapFrom(s => s.Email))
                ;

            CreateMap<Pet, ESS.Shared.Contracts.Events.Pet>()
                .ReverseMap()
                ;

            CreateMap<EvacuationFile, ESS.Shared.Contracts.Events.EvacuationFile>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.FileId))
                .ForMember(d => d.RelatedTask, opts => opts.Ignore())
                .ForMember(d => d.CreatedOn, opts => opts.Ignore())
                .ForMember(d => d.EvacuationDate, opts => opts.MapFrom(s => DateTime.UtcNow))
                .ForMember(d => d.RestrictedAccess, opts => opts.Ignore())
                .ForMember(d => d.PrimaryRegistrantId, opts => opts.Ignore())
                .ForMember(d => d.PrimaryRegistrantUserId, opts => opts.Ignore())
                .ForMember(d => d.SecurityPhraseChanged, opts => opts.MapFrom(s => s.SecretPhraseEdited))
                .ForMember(d => d.SecurityPhrase, opts => opts.MapFrom(s => s.SecretPhrase))
                .ForMember(d => d.RegistrationLocation, opts => opts.Ignore())
                .ForMember(d => d.Status, opts => opts.MapFrom(s => EvacuationFileStatus.Pending))
                .ForMember(d => d.HouseholdMembers, opts => opts.Ignore())
                .ForMember(d => d.Notes, opts => opts.Ignore())
                .ForMember(d => d.Supports, opts => opts.Ignore())
                ;

            CreateMap<ESS.Shared.Contracts.Events.EvacuationFile, EvacuationFile>()
                .ForMember(d => d.FileId, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.EvacuationFileDate, opts => opts.MapFrom(s => s.EvacuationDate))
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.SecretPhrase, opts => opts.MapFrom(s => s.SecurityPhrase))
                .ForMember(d => d.SecretPhraseEdited, opts => opts.MapFrom(s => false))
                .ForMember(d => d.LastModified, opts => opts.MapFrom(s => s.NeedsAssessment.CompletedOn))
                .ForMember(d => d.SelfServeEnabled, opts => opts.MapFrom(s => s.RelatedTask != null && s.RelatedTask.SelfServeEnabled))
                ;

            CreateMap<ESS.Shared.Contracts.Events.Support, Support>()
                .IncludeAllDerived()
                .ForMember(d => d.IssuingMemberTeamName, opts => opts.MapFrom(s => s.IssuedBy.TeamName))
                .ForMember(d => d.Method, opts => opts.Ignore())
                .ForMember(d => d.SupplierId, opts => opts.Ignore())
                .ForMember(d => d.SupplierName, opts => opts.Ignore())
                .ForMember(d => d.SupplierLegalName, opts => opts.Ignore())
                .ForMember(d => d.SupplierAddress, opts => opts.Ignore())
                .ForMember(d => d.IssuedToPersonName, opts => opts.Ignore())
                .ForMember(d => d.ManualReferralId, opts => opts.Ignore())
                .ForMember(d => d.NotificationEmail, opts => opts.Ignore())
                .ForMember(d => d.NofificationMobile, opts => opts.Ignore())
                .ForMember(d => d.RecipientFirstName, opts => opts.Ignore())
                .ForMember(d => d.RecipientLastName, opts => opts.Ignore())
                .ForMember(d => d.SecurityQuestion, opts => opts.Ignore())
                .ForMember(d => d.SecurityAnswer, opts => opts.Ignore())
                .AfterMap((s, d, ctx) =>
                {
                    if (s.SupportDelivery is ESS.Shared.Contracts.Events.Referral referral)
                    {
                        d.Method = SupportMethod.Referral;
                        d.SupplierId = referral.SupplierDetails?.Id;
                        d.SupplierName = referral.SupplierDetails?.Name;
                        d.SupplierLegalName = referral.SupplierDetails?.LegalName;
                        d.SupplierAddress = ctx.Mapper.Map<Address>(referral.SupplierDetails?.Address);
                        d.IssuedToPersonName = referral.IssuedToPersonName;
                        d.ManualReferralId = referral.ManualReferralId;
                    }
                    else if (s.SupportDelivery is ESS.Shared.Contracts.Events.Interac eTransfer)
                    {
                        d.Method = SupportMethod.ETransfer;
                        d.NofificationMobile = eTransfer.NotificationMobile;
                        d.NotificationEmail = eTransfer.NotificationEmail;
                        d.RecipientFirstName = eTransfer.RecipientFirstName;
                        d.RecipientLastName = eTransfer.RecipientLastName;
                        d.SecurityQuestion = eTransfer.SecurityQuestion;
                        d.SecurityAnswer = eTransfer.SecurityAnswer;
                    }
                    else
                    {
                        d.Method = SupportMethod.Unknown;
                    }
                })
                ;

            CreateMap<ESS.Shared.Contracts.Events.ClothingSupport, ClothingSupport>()
                ;

            CreateMap<ESS.Shared.Contracts.Events.IncidentalsSupport, IncidentalsSupport>()
                ;

            CreateMap<ESS.Shared.Contracts.Events.FoodGroceriesSupport, FoodGroceriesSupport>()
                ;

            CreateMap<ESS.Shared.Contracts.Events.FoodRestaurantSupport, FoodRestaurantSupport>()
                ;

            CreateMap<ESS.Shared.Contracts.Events.ShelterBilletingSupport, LodgingBilletingSupport>()
                ;

            CreateMap<ESS.Shared.Contracts.Events.ShelterGroupSupport, LodgingGroupSupport>()
                ;

            CreateMap<ESS.Shared.Contracts.Events.ShelterHotelSupport, LodgingHotelSupport>()
                ;

            CreateMap<ESS.Shared.Contracts.Events.ShelterAllowanceSupport, LodgingAllowanceSupport>()
    ;

            CreateMap<ESS.Shared.Contracts.Events.TransportationOtherSupport, TransportationOtherSupport>()
                ;

            CreateMap<ESS.Shared.Contracts.Events.TransportationTaxiSupport, TransportationTaxiSupport>()
                ;

            CreateMap<ESS.Shared.Contracts.Events.SelfServe.DraftSelfServeSupportQueryResponse, DraftSupports>()
                ;

            CreateMap<ESS.Shared.Contracts.Events.SelfServe.SelfServeSupport, SelfServeSupport>()
                .IncludeAllDerived()
                .ReverseMap()
                .IncludeAllDerived();

            CreateMap<ESS.Shared.Contracts.Events.SelfServe.SelfServeClothingSupport, SelfServeClothingSupport>()
                .ReverseMap();

            CreateMap<ESS.Shared.Contracts.Events.SelfServe.SelfServeIncidentalsSupport, SelfServeIncidentalsSupport>()
                .ReverseMap();

            CreateMap<ESS.Shared.Contracts.Events.SelfServe.SelfServeShelterAllowanceSupport, SelfServeShelterAllowanceSupport>()
                .ReverseMap();

            CreateMap<ESS.Shared.Contracts.Events.SelfServe.SelfServeFoodGroceriesSupport, SelfServeFoodGroceriesSupport>()
                .ReverseMap();

            CreateMap<ESS.Shared.Contracts.Events.SelfServe.SelfServeFoodRestaurantSupport, SelfServeFoodRestaurantSupport>()
                .ReverseMap();

            CreateMap<ESS.Shared.Contracts.Events.SelfServe.SupportDayMeals, SupportDayMeals>()
                .ReverseMap();

            CreateMap<ESS.Shared.Contracts.Events.SelfServe.ETransferDetails, ETransferDetails>()
                .ReverseMap();

            CreateMap<ESS.Shared.Contracts.Events.SelfServe.SelfServeSupportSetting, SelfServeSupportSetting>()
                ;
        }
    }
}
