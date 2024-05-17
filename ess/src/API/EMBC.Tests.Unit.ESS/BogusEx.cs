using System;
using System.Globalization;
using System.Linq;
using Bogus;
using EMBC.ESS.Shared.Contracts.Events;

namespace EMBC.Tests.Unit.ESS;

public static class BogusExtensions
{
    public static Faker<EvacuationFile> WithFileRules(this Faker<EvacuationFile> faker, RegistrantProfile? primaryRegistrant = null, int minNumberOfHoldholdMembers = 0)
    {
        if (primaryRegistrant == null) primaryRegistrant = new Faker<RegistrantProfile>("en_CA").WithRegistrantRules().Generate();
        return faker
            .RuleFor(f => f.Id, f => "F" + f.Random.Number(100000, 999999).ToString())
            .RuleFor(f => f.RelatedTask, f => new IncidentTask { Id = f.Hacker.Noun(), CommunityCode = "1" })
            .RuleFor(f => f.HouseholdMembers, f =>
            {
                var hmFaker = new Faker<HouseholdMember>("en_CA");
                return hmFaker.WithHouseholdMemberRules().GenerateBetween(Math.Min(minNumberOfHoldholdMembers, 19), 19).Prepend(hmFaker.WithHouseholdMemberRules(primaryRegistrant).Generate());
            })
            .RuleFor(f => f.NeedsAssessment, (f, o) => new NeedsAssessment
            {
                HouseholdMembers = o.HouseholdMembers,
                CompletedBy = new Faker<TeamMember>("en_CA").WithTeamMemberRules().Generate(),
                CompletedOn = DateTime.Now,
                Insurance = f.Random.Enum<InsuranceOption>(),
                Pets = new Faker<Pet>("en_CA").GenerateBetween(0, 20),
                Type = NeedsAssessmentType.Assessed,
                Needs = f.Random.EnumValues<IdentifiedNeed>(),
                Notes = o.Notes
            })
            .RuleFor(f => f.Status, _ => EvacuationFileStatus.Active)
            .RuleFor(f => f.EvacuationDate, _ => DateTime.Now)
            .RuleFor(f => f.Notes, new Faker<Note>("en_CA").GenerateBetween(0, 10))
            .RuleFor(f => f.PrimaryRegistrantId, f => primaryRegistrant?.Id ?? "test")
            .RuleFor(f => f.RegistrationLocation, f => $"autotest-{f.Address.FullAddress()}")
            ;
    }

    public static Faker<HouseholdMember> WithHouseholdMemberRules(this Faker<HouseholdMember> faker, RegistrantProfile? primaryRegistrant = null)
    {
        return faker
            .RuleFor(f => f.DateOfBirth, f => primaryRegistrant?.DateOfBirth ?? f.Person.DateOfBirth.ToString("MM/dd/yyyy"))
            .RuleFor(f => f.FirstName, f => primaryRegistrant?.FirstName ?? f.Person.FirstName)
            .RuleFor(f => f.LastName, f => primaryRegistrant?.LastName ?? f.Person.LastName)
            .RuleFor(f => f.Gender, f => primaryRegistrant?.Gender ?? f.Person.Gender.ToString().Substring(0, 1).ToUpper())
            .RuleFor(f => f.IsMinor, (f, o) => DateTime.Parse(o.DateOfBirth, CultureInfo.InvariantCulture).AddYears(19) >= DateTime.Today)
            .RuleFor(f => f.IsPrimaryRegistrant, _ => primaryRegistrant != null)
            ;
    }

    public static Faker<TeamMember> WithTeamMemberRules(this Faker<TeamMember> faker)
    {
        return faker
            .RuleFor(f => f.FirstName, f => f.Person.FirstName)
            .RuleFor(f => f.LastName, f => f.Person.LastName)
            .RuleFor(f => f.TeamName, f => f.Company.CompanyName(0))
            ;
    }

    public static Faker<SupplierDetails> WithSupplierDetailsRules(this Faker<SupplierDetails> faker)
    {
        return faker
            .RuleFor(sd => sd.LegalName, f => f.Company.CompanyName(1))
            .RuleFor(sd => sd.Name, f => f.Company.CompanyName(0))
            .RuleFor(sd => sd.Phone, f => f.Phone.PhoneNumber())
            .RuleFor(sd => sd.Address, f => new Faker<Address>("en_CA").WithAddressRules().Generate())
            ;
    }

    public static Faker<Address> WithAddressRules(this Faker<Address> faker)
    {
        return faker
            .RuleFor(sd => sd.AddressLine1, f => f.Address.StreetAddress())
            .RuleFor(sd => sd.AddressLine2, f => f.Address.SecondaryAddress().OrNull(f, 0.8f))
            .RuleFor(sd => sd.City, f => f.Address.City())
            .RuleFor(sd => sd.PostalCode, f => f.Address.ZipCode())
            .RuleFor(sd => sd.StateProvince, f => f.Address.State().OrDefault(f, 0.9f, "BC"))
            .RuleFor(sd => sd.Country, _ => "13539953-4195-ea11-b818-00505683fbf4")
            ;
    }

    public static Faker<TSupport> WithSupportDeliveryRules<TSupport, TSupportDelivery>(this Faker<TSupport> faker)
    where TSupport : Support
    where TSupportDelivery : SupportDelivery
    {
#pragma warning disable S2589 // Boolean expressions should not be gratuitous
        return typeof(TSupportDelivery) switch
        {
            Type t when t == typeof(Referral) => faker.RuleFor(s => s.SupportDelivery, f => new Faker<Referral>("en_CA").WithReferralRules().Generate()),
            Type t when t == typeof(Interac) => faker.RuleFor(s => s.SupportDelivery, f => new Faker<Interac>("en_CA").WithInteracRules().Generate()),

            _ => throw new NotImplementedException()
        };
#pragma warning restore S2589 // Boolean expressions should not be gratuitous
    }

    public static Faker<Referral> WithReferralRules(this Faker<Referral> faker)
    {
        return faker
            .RuleFor(sd => sd.IssuedToPersonName, f => f.Person.FullName)
            .RuleFor(sd => sd.ManualReferralId, f => string.Empty)
            .RuleFor(sd => sd.SupplierNotes, f => f.Lorem.Lines(3))
            .RuleFor(sd => sd.SupplierDetails, f => new Faker<SupplierDetails>("en_CA").WithSupplierDetailsRules().Generate())
            ;
    }

    public static Faker<Interac> WithInteracRules(this Faker<Interac> faker)
    {
        return faker
            .RuleFor(sd => sd.NotificationEmail, f => $"{f.Person.Email}-autotest")
            .RuleFor(sd => sd.NotificationMobile, f => f.Person.Phone)
            .RuleFor(sd => sd.RecipientFirstName, f => f.Person.FirstName)
            .RuleFor(sd => sd.RecipientLastName, f => f.Person.LastName)
            ;
    }

    public static Faker<T> WithDefaultSupportRules<T>(this Faker<T> faker, EvacuationFile sourceFile, TeamMember issuer) where T : Support
    {
        return faker
           .RuleFor(s => s.FileId, _ => sourceFile.Id)
           .RuleFor(s => s.Id, f => "S" + f.Random.Number(100000, 999999).ToString())
           .RuleFor(s => s.Status, f => SupportStatus.Active)
           .RuleFor(s => s.From, f => f.Date.Recent())
           .RuleFor(s => s.To, (f, o) => o.From.AddDays(3))
           .RuleFor(s => s.IncludedHouseholdMembers, f => f.PickRandom(sourceFile.HouseholdMembers.Select(hm => hm.Id), f.Random.Int(1, sourceFile.HouseholdMembers.Count())))
           .RuleFor(s => s.IssuedOn, (f, o) => o.From)
           .RuleFor(s => s.IssuedBy, _ => issuer)
           .RuleFor(s => s.CreatedBy, _ => issuer)
           .RuleFor(s => s.CreatedOn, (f, o) => o.IssuedOn)
           ;
    }

    public static Faker<FoodGroceriesSupport> WithSupportRules(this Faker<FoodGroceriesSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
    {
        return faker.WithDefaultSupportRules(sourceFile, issuer)
            .RuleFor(s => s.NumberOfDays, _ => 3)
            .RuleFor(s => s.TotalAmount, f => f.Random.Decimal(min: 10m, max: 1000m))
            ;
    }

    public static Faker<FoodRestaurantSupport> WithSupportRules(this Faker<FoodRestaurantSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
    {
        return faker.WithDefaultSupportRules(sourceFile, issuer)
            .RuleFor(s => s.NumberOfBreakfastsPerPerson, f => f.Random.Int(0, 4))
            .RuleFor(s => s.NumberOfDinnersPerPerson, f => f.Random.Int(0, 4))
            .RuleFor(s => s.NumberOfLunchesPerPerson, f => f.Random.Int(0, 4))
            .RuleFor(s => s.TotalAmount, f => f.Random.Decimal(min: 10m, max: 1000m))
            ;
    }

    public static Faker<ShelterAllowanceSupport> WithSupportRules(this Faker<ShelterAllowanceSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
    {
        return faker.WithDefaultSupportRules(sourceFile, issuer)
            .RuleFor(s => s.NumberOfNights, _ => 3)
            .RuleFor(s => s.ContactEmail, f => $"{f.Person.Email}-autotest".OrNull(f))
            .RuleFor(s => s.ContactPhone, f => f.Person.Phone)
            .RuleFor(s => s.TotalAmount, f => f.Random.Decimal(min: 10m, max: 1000m))
            ;
    }

    public static Faker<ShelterGroupSupport> WithSupportRules(this Faker<ShelterGroupSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
    {
        return faker.WithDefaultSupportRules(sourceFile, issuer)
            .RuleFor(s => s.NumberOfNights, _ => 3)
            .RuleFor(s => s.FacilityAddress, f => f.Address.StreetAddress())
            .RuleFor(s => s.FacilityCity, f => f.Address.City())
            .RuleFor(s => s.FacilityContactPhone, f => f.Phone.PhoneNumber())
            .RuleFor(s => s.FacilityName, f => f.Company.CompanyName())
            ;
    }

    public static Faker<ShelterHotelSupport> WithSupportRules(this Faker<ShelterHotelSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
    {
        return faker.WithDefaultSupportRules(sourceFile, issuer)
            .RuleFor(s => s.NumberOfNights, _ => 3)
            .RuleFor(s => s.NumberOfRooms, _ => 1)
            ;
    }

    public static Faker<ShelterBilletingSupport> WithSupportRules(this Faker<ShelterBilletingSupport> faker, EvacuationFile sourceFile, TeamMember issuer)
    {
        return faker.WithDefaultSupportRules(sourceFile, issuer)
            .RuleFor(s => s.NumberOfNights, _ => 3)
            .RuleFor(s => s.HostAddress, f => f.Address.StreetAddress())
            .RuleFor(s => s.HostCity, f => f.Address.City())
            .RuleFor(s => s.HostPhone, f => f.Phone.PhoneNumber())
            .RuleFor(s => s.HostEmail, f => $"{f.Person.Email}-autotest".OrNull(f))
            ;
    }

    public static Faker<RegistrantProfile> WithRegistrantRules(this Faker<RegistrantProfile> faker)
    {
        return faker
            .RuleFor(f => f.DateOfBirth, f => f.Person.DateOfBirth.ToString("MM/dd/yyyy"))
            .RuleFor(f => f.FirstName, f => $"autotest-{f.Person.FirstName}")
            .RuleFor(f => f.LastName, f => $"autotest-{f.Person.LastName}")
            .RuleFor(f => f.Gender, f => f.Person.Gender.ToString().Substring(0, 1).ToUpper())
            .RuleFor(f => f.IsMinor, (f, o) => DateTime.Parse(o.DateOfBirth, CultureInfo.InvariantCulture).AddYears(19) >= DateTime.Today)
            .RuleFor(f => f.Email, f => $"{f.Person.Email}-autotest".OrNull(f))
            .RuleFor(f => f.Phone, f => f.Phone.PhoneNumber().OrNull(f))
            .RuleFor(f => f.PrimaryAddress, f => new Faker<Address>("en_CA").WithAddressRules().Generate())
            .RuleFor(f => f.MailingAddress, (_, o) => o.PrimaryAddress)
            .RuleFor(f => f.HomeAddress, (_, o) => o.PrimaryAddress)
            ;
    }
}
