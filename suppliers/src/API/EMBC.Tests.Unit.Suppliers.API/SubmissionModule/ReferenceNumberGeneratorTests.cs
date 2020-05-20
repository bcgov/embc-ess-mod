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
            Assert.StartsWith($"SUP-{DateTime.Today:yyyyMMdd}", referenceNumber);
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
    }
}
