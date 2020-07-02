using System;
using System.Linq;
using EMBC.Suppliers.API.SubmissionModule.Models;
using Xunit;

namespace EMBC.Tests.Unit.Suppliers.API.SubmissionModule
{
    public class ReferenceNumberGeneratorTests
    {
        private readonly ReferenceNumberGenerator referenceNumberGenerator;

        public ReferenceNumberGeneratorTests()
        {
            referenceNumberGenerator = new ReferenceNumberGenerator();
        }

        [Fact]
        public void Generate_TemplatedReferenceNumber()
        {
            var referenceNumber = referenceNumberGenerator.CreateNew();
            Assert.Matches(@"^SUP-\d{8}?-\w{6}?", referenceNumber);
        }

        [Fact]
        public void Generate_MultipleTimes_UniqueReferenceNumber()
        {
            var numberOfIterations = 1000;
            var referenceNumbers = new string[numberOfIterations];
            for (int i = 0; i < numberOfIterations; i++)
            {
                referenceNumbers[i] = referenceNumberGenerator.CreateNew();
            }
            Assert.Equal(numberOfIterations, referenceNumbers.Distinct().Count());
        }

        [Fact]
        public void Generate_NextDay_DateIsInPST()
        {
            var utcNow = DateTime.Parse("2020-01-02T00:00:00Z").ToUniversalTime();
            referenceNumberGenerator.OverrideNow(utcNow);
            var referenceNumber = referenceNumberGenerator.CreateNew();
            Assert.StartsWith("SUP-20200101-", referenceNumber);
        }

        [Fact]
        public void Generate_On6AmUtc_PTDayIsPrevious()
        {
            var utcNow = DateTime.Parse("2020-01-02T06:00:00Z");
            referenceNumberGenerator.OverrideNow(utcNow);
            var referenceNumber = referenceNumberGenerator.CreateNew();
            Assert.StartsWith("SUP-20200101-", referenceNumber);
        }

        [Fact]
        public void Generate_On8AmUtc_PTDayIsSame()
        {
            var utcNow = DateTime.Parse("2020-01-02T08:00:00Z");
            referenceNumberGenerator.OverrideNow(utcNow);
            var referenceNumber = referenceNumberGenerator.CreateNew();
            Assert.StartsWith("SUP-20200102-", referenceNumber);
        }
    }
}
