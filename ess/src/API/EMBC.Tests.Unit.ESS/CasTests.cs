using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.ESS
{
    public class CasTests
    {
        [Theory]
        [InlineData("V1V1V1", "V1V1V1")]
        [InlineData("V1V 1V1", "V1V1V1")]
        [InlineData("V1 V1 V1", "V1V1V1")]
        [InlineData("v1v 1v1", "V1V1V1")]
        [InlineData("v1v.1v1", "V1V1V1")]
        [InlineData("v1-v1v1", "V1V1V1")]
        [InlineData("v,1v1v1", "V1V1V1")]
        [InlineData("V1V1V1V1V", "V1V1V1")]
        [InlineData("V1V", "V1V")]
        [InlineData("", "")]
        public void FormatPostalCode(string input, string expected)
        {
            EMBC.ESS.Utilities.Cas.Formatters.ToCasPostalCode(input).ShouldBe(expected);
        }

        [Theory]
        [InlineData("FIRST", "LAST", "LAST, FIRST")]
        [InlineData("first", "last", "LAST, FIRST")]
        [InlineData("first;", "[last]", "LAST, FIRST")]
        [InlineData("first ", " last^", "LAST, FIRST")]
        [InlineData("first.", "\"last\"", "LAST, FIRST")]
        [InlineData("fi-rst", "*las—t", "LAST, FI-RST")] //dash
        public void FormatSupplierName(string firstName, string lastName, string expected)
        {
            EMBC.ESS.Utilities.Cas.Formatters.ToCasSupplierName(firstName, lastName).ShouldBe(expected);
        }
    }
}
