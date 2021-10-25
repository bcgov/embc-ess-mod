using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Bogus;
using EMBC.ESS.Resources.Print.Supports;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.ESS.Prints
{
    public class PrintTests
    {
        private readonly SupportsService supportsService;

        public PrintTests()
        {
            supportsService = new SupportsService();
        }

        [Fact]
        public async Task CreateSupportPdfWithoutSummary()
        {
            var requestingUser = new PrintRequestingUser { Id = "123", firstName = "First Name", lastName = "LastName" };
            var request = new SupportsToPrint
            {
                AddSummary = false,
                AddWatermark = false,
                RequestingUser = requestingUser,
                Referrals = GeneratePrintReferral(requestingUser, 1)
            };

            var content = await supportsService.GetReferralHtmlPagesAsync(request);

            content.ShouldNotBeNullOrEmpty();
            await File.WriteAllTextAsync("./newSupportPdfFile.html", content);
        }

        [Fact]
        public async Task CreateMultipleSupportsPdfsWithoutSummary()
        {
            var requestingUser = new PrintRequestingUser { Id = "123", firstName = "First Name", lastName = "LastName" };
            var request = new SupportsToPrint
            {
                AddSummary = false,
                AddWatermark = false,
                RequestingUser = requestingUser,
                Referrals = GeneratePrintReferral(requestingUser, 5)
            };

            var content = await supportsService.GetReferralHtmlPagesAsync(request);

            content.ShouldNotBeNullOrEmpty();
            await File.WriteAllTextAsync("./newSupportPdfsFile.html", content);
        }

        [Fact]
        public async Task CreateSupportPdfWithSummary()
        {
            var requestingUser = new PrintRequestingUser { Id = "123", firstName = "First Name", lastName = "LastName" };
            var request = new SupportsToPrint
            {
                AddSummary = true,
                AddWatermark = true,
                RequestingUser = requestingUser,
                Referrals = GeneratePrintReferral(requestingUser, 1)
            };

            var content = await supportsService.GetReferralHtmlPagesAsync(request);

            content.ShouldNotBeNullOrEmpty();
            await File.WriteAllTextAsync("./newSupportPdfWithSummaryFile.html", content);
        }

        [Fact]
        public async Task CreateMultipleSupportsPdfsWithSummary()
        {
            var requestingUser = new PrintRequestingUser { Id = "123", firstName = "First Name", lastName = "LastName" };
            var request = new SupportsToPrint
            {
                AddSummary = true,
                AddWatermark = true,
                RequestingUser = requestingUser,
                Referrals = GeneratePrintReferral(requestingUser, 10)
            };

            var content = await supportsService.GetReferralHtmlPagesAsync(request);

            content.ShouldNotBeNullOrEmpty();
            await File.WriteAllTextAsync("./newSupportPdfsWithSummaryFile.html", content);
        }

        private IEnumerable<PrintReferral> GeneratePrintReferral(PrintRequestingUser requestingUser, int numberOfReferrals) =>
            Enumerable.Range(0, numberOfReferrals).Select(i =>
                 new Faker<PrintReferral>()
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
                    .Generate()
            );
    }
}
