using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Bogus;
using EMBC.ESS.Engines.Supporting.SupportGeneration.ReferralPrinting;
using EMBC.Utilities.Extensions;
using Org.BouncyCastle.Asn1.Ocsp;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.ESS.Prints
{
    public class PrintReferralTests
    {
        [Fact]
        public async Task CreateSupportPdfWithoutSummary()
        {
            var requestingUser = new PrintRequestingUser { Id = "123", FirstName = "First Name", LastName = "LastName" };
            var referrals = GeneratePrintReferral(requestingUser, 1, false);
            var title = $"supportstest-{DateTime.UtcNow.ToPST().ToString("yyyyMMddhhmmss")}";
            var printingEvacuee = new PrintEvacuee { FirstName = "First Name", LastName = "LastName" };

            var content = await ReferralHtmlGenerator.CreateSingleHtmlDocument(requestingUser, referrals, Enumerable.Empty<PrintSummary>(), false, false, title, printingEvacuee);

            content.ShouldNotBeNullOrEmpty();
            await File.WriteAllTextAsync("./newSupportPdfFile.html", content);
        }

        [Fact]
        public async Task CreateMultipleSupportsPdfsWithoutSummary()
        {
            var requestingUser = new PrintRequestingUser { Id = "123", FirstName = "First Name", LastName = "LastName" };
            var referrals = GeneratePrintReferral(requestingUser, 5, false);
            var title = $"supportstest-{DateTime.UtcNow.ToPST().ToString("yyyyMMddhhmmss")}";
            var printingEvacuee = new PrintEvacuee { FirstName = "First Name", LastName = "LastName" };

            var content = await ReferralHtmlGenerator.CreateSingleHtmlDocument(requestingUser, referrals, Enumerable.Empty<PrintSummary>(), false, false, title, printingEvacuee);

            content.ShouldNotBeNullOrEmpty();
            await File.WriteAllTextAsync("./newSupportPdfsFile.html", content);
        }

        [Fact]
        public async Task CreateSupportPdfWithSummary()
        {
            var requestingUser = new PrintRequestingUser { Id = "123", FirstName = "First Name", LastName = "LastName" };
            var referrals = GeneratePrintReferral(requestingUser, 1, true);
            var summaryItems = GetSummaryFromReferrals(referrals);
            var title = $"supportstest-{DateTime.UtcNow.ToPST().ToString("yyyyMMddhhmmss")}";
            var printingEvacuee = new PrintEvacuee { FirstName = "First Name", LastName = "LastName" };

            var content = await ReferralHtmlGenerator.CreateSingleHtmlDocument(requestingUser, referrals, summaryItems, true, true, title, printingEvacuee);

            content.ShouldNotBeNullOrEmpty();
            await File.WriteAllTextAsync("./newSupportPdfWithSummaryFile.html", content);
        }

        [Fact]
        public async Task CreateMultipleSupportsPdfsWithSummary()
        {
            var requestingUser = new PrintRequestingUser { Id = "123", FirstName = "First Name", LastName = "LastName" };
            var referrals = GeneratePrintReferral(requestingUser, 10, true);
            var summaryItems = GetSummaryFromReferrals(referrals);
            var title = $"supportstest-{DateTime.UtcNow.ToPST().ToString("yyyyMMddhhmmss")}";
            var printingEvacuee = new PrintEvacuee { FirstName = "First Name", LastName = "LastName" };

            var content = await ReferralHtmlGenerator.CreateSingleHtmlDocument(requestingUser, referrals, summaryItems, true, true, title, printingEvacuee);

            content.ShouldNotBeNullOrEmpty();
            await File.WriteAllTextAsync("./newSupportPdfsWithSummaryFile.html", content);
        }

        [Fact]
        public async Task MultipleHtmlGenerationLoadTest()
        {
            await Parallel.ForEachAsync(Enumerable.Range(0, 10), new ParallelOptions { MaxDegreeOfParallelism = 10 }, async (i, ct) =>
               {
                   var requestingUser = GeneratePrintRequestingUser();
                   var referrals = GeneratePrintReferral(requestingUser, Random.Shared.Next(1, 10), true);
                   var summaryItems = GetSummaryFromReferrals(referrals);
                   var title = $"supportstest-{i}";
                   var printEvacuee = GeneratePrintEvacuee();
                   (await ReferralHtmlGenerator.CreateSingleHtmlDocument(requestingUser, referrals, summaryItems, true, true, title, printEvacuee)).ShouldNotBeEmpty();
               });
        }

        private PrintRequestingUser GeneratePrintRequestingUser() =>
            new Faker<PrintRequestingUser>()
                .RuleFor(o => o.FirstName, f => f.Person.FirstName)
                .RuleFor(o => o.LastName, f => f.Person.LastName)
                .RuleFor(o => o.Id, f => f.Random.Number(1000, 9999).ToString())
            ;

        private PrintEvacuee GeneratePrintEvacuee() =>
            new Faker<PrintEvacuee>()
                .RuleFor(o => o.FirstName, f => f.Person.FirstName)
                .RuleFor(o => o.LastName, f => f.Person.LastName)
            ;

        private IEnumerable<PrintReferral> GeneratePrintReferral(PrintRequestingUser requestingUser, int numberOfReferrals, bool displayWatermark) =>
            Enumerable.Range(0, numberOfReferrals).Select(i =>
                 new Faker<PrintReferral>()
                    .RuleFor(o => o.VolunteerFirstName, f => requestingUser.FirstName)
                    .RuleFor(o => o.VolunteerLastName, f => requestingUser.FirstName)
                    .RuleFor(o => o.DisplayWatermark, f => displayWatermark)
                    .RuleFor(o => o.Type, f => f.Random.Enum<PrintReferralType>())
                    .RuleFor(o => o.Id, f => string.Join("", f.Random.Digits(6)))
                    .RuleFor(o => o.FromDate, f => f.Date.Soon().Date.ToShortDateString())
                    .RuleFor(o => o.FromTime, f => f.Date.Recent().ToLongTimeString())
                    .RuleFor(o => o.ToDate, (f, o) => DateTime.Parse(o.FromDate).AddDays(3).ToShortDateString())
                    .RuleFor(o => o.ToTime, (f, o) => o.FromTime)
                    .RuleFor(o => o.Comments, f => f.Random.Words(20))
                    .RuleFor(o => o.PrintDate, f => DateTime.Now.ToString())
                    .RuleFor(o => o.PurchaserName, f => f.Name.FullName())
                    .RuleFor(o => o.ApprovedItems, (f, o) => o.Type == PrintReferralType.Incidentals ? string.Join(Environment.NewLine, f.Random.WordsArray(10)) : null)
                    .RuleFor(o => o.TotalAmountPrinted, (f, o) => o.Type == PrintReferralType.Incidentals ? f.Random.Decimal(max: 1000m).ToString() : null)
                    .RuleFor(o => o.TotalAmountPrinted, (f, o) => o.Type == PrintReferralType.Clothing ? f.Random.Decimal(max: 1000m).ToString() : null)
                    .RuleFor(o => o.TotalAmountPrinted, (f, o) => o.Type == PrintReferralType.Meals ? f.Random.Decimal(max: 1000m).ToString() : null)
                    .RuleFor(o => o.NumBreakfasts, (f, o) => o.Type == PrintReferralType.Meals ? f.Random.Int(0, 3) : 0)
                    .RuleFor(o => o.NumLunches, (f, o) => o.Type == PrintReferralType.Meals ? f.Random.Int(0, 3) : 0)
                    .RuleFor(o => o.NumDinners, (f, o) => o.Type == PrintReferralType.Meals ? f.Random.Int(0, 3) : 0)
                    .RuleFor(o => o.TotalAmountPrinted, (f, o) => o.Type == PrintReferralType.Groceries ? f.Random.Decimal(max: 1000m).ToString() : null)
                    .RuleFor(o => o.NumDaysMeals, (f, o) => o.Type == PrintReferralType.Groceries ? f.Random.Int(0, 3) : 0)
                    .RuleFor(o => o.NumNights, (f, o) => o.Type == PrintReferralType.Hotel ? f.Random.Int(0, 3) : 0)
                    .RuleFor(o => o.NumNights, (f, o) => o.Type == PrintReferralType.GroupLodging ? f.Random.Int(0, 3) : 0)
                    .RuleFor(o => o.FromAddress, (f, o) => o.Type == PrintReferralType.Taxi ? f.Address.FullAddress() : null)
                    .RuleFor(o => o.ToAddress, (f, o) => o.Type == PrintReferralType.Taxi ? f.Address.FullAddress() : null)
                    .RuleFor(o => o.TotalAmountPrinted, (f, o) => o.Type == PrintReferralType.Transportation ? f.Random.Decimal(max: 1000m).ToString() : null)
                    .RuleFor(o => o.OtherTransportModeDetails, (f, o) => o.Type == PrintReferralType.Transportation ? f.Vehicle.Type() : null)
                    .RuleFor(o => o.Supplier, f => new Faker<PrintSupplier>()
                        .RuleFor(o => o.Address, f => f.Address.StreetAddress() + "," + f.Address.StreetName())
                        .RuleFor(o => o.City, f => f.Address.City())
                        .RuleFor(o => o.Name, f => f.Company.CompanyName())
                        .RuleFor(o => o.PostalCode, f => f.Address.ZipCode())
                        .RuleFor(o => o.Telephone, f => f.Phone.PhoneNumber())
                        .RuleFor(o => o.Province, f => f.Address.State())
                        .Generate())
                    .RuleFor(o => o.Evacuees, f => f.Make(f.Random.Number(20), () => new Faker<PrintEvacuee>()
                        .RuleFor(o => o.EvacueeTypeCode, f => f.PickRandom(new[] { "F", "A", "C" }))
                        .RuleFor(o => o.FirstName, f => f.Person.FirstName)
                        .RuleFor(o => o.LastName, f => f.Person.LastName)
                        .Generate()))
                    .Generate()
            );

        private IEnumerable<PrintSummary> GetSummaryFromReferrals(IEnumerable<PrintReferral> referrals)
        {
            var summaries = new List<PrintSummary>();
            foreach (var referral in referrals)
            {
                summaries.Add(new PrintSummary
                {
                    Id = referral.Id,
                    Type = referral.Type,
                    PurchaserName = referral.PurchaserName,
                    EssNumber = referral.EssNumber,
                    FromDate = referral.FromDate,
                    FromTime = referral.FromTime,
                    ToDate = referral.ToDate,
                    ToTime = referral.ToTime,
                    Supplier = referral.Supplier,
                    IsEtransfer = false,
                    NotificationInformation = new NotificationInformation()
                });
            }

            return summaries;
        }
    }
}
