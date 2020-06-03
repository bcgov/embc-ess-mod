using System;
using System.Linq;
using EMBC.Suppliers.API.SubmissionModule.Models;
using Xunit;

namespace EMBC.Tests.Unit.Suppliers.API.SubmissionModule
{
    public class ReferenceNumberGeneratorTests
    {
        [Fact]
        public void Generate_TemplatedReferenceNumber()
        {
            var referenceNumber = ReferenceNumberGenerator.CreateNew();
            Assert.Matches(@"^SUP-\d{8}?-\w{6}?", referenceNumber);
        }

        [Fact]
        public void Generate_MultipleTimes_UniqueReferenceNumber()
        {
            var numberOfIterations = 1000;
            var referenceNumbers = new string[numberOfIterations];
            for (int i = 0; i < numberOfIterations; i++)
            {
                referenceNumbers[i] = ReferenceNumberGenerator.CreateNew();
            }
            Assert.Equal(numberOfIterations, referenceNumbers.Distinct().Count());
        }

        [Fact]
        public void Generate_NextDay_DateIsInPST()
        {
            var utcNow = DateTime.Parse("2020-01-02T00:00:00Z");
            ReferenceNumberGenerator.OverrideNow(utcNow);
            var referenceNumber = ReferenceNumberGenerator.CreateNew();
            Assert.Contains("-20200101-", referenceNumber);
        }

        [Fact]
        public void Generate_On6AmUtc_PTDayIsPrevious()
        {
            var utcNow = DateTime.Parse("2020-01-02T06:00:00Z");
            ReferenceNumberGenerator.OverrideNow(utcNow);
            var referenceNumber = ReferenceNumberGenerator.CreateNew();
            Assert.Contains("-20200101-", referenceNumber);
        }

        [Fact]
        public void Generate_On8AmUtc_PTDayIsSame()
        {
            var utcNow = DateTime.Parse("2020-01-02T08:00:00Z");
            ReferenceNumberGenerator.OverrideNow(utcNow);
            var referenceNumber = ReferenceNumberGenerator.CreateNew();
            Assert.Contains("-20200102-", referenceNumber);
        }

        ~ReferenceNumberGeneratorTests()
        {
            ReferenceNumberGenerator.ResetNow();
        }
    }
}
