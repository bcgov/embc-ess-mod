using System.Collections.Generic;
using System.Linq;
using EMBC.Utilities;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.ESS
{
    public class LambdaComparerTests
    {
        [Fact]
        public void CanCompare_DifferentPropertyValue_False()
        {
            var comparer = TestComparisonClass.Comparer;

            var o1 = new TestComparisonClass { Property1 = "obj1", Property2 = 1 };
            var o2 = new TestComparisonClass { Property1 = "obj2", Property2 = 2 };
            comparer.Equals(o1, o2).ShouldBeFalse();
        }

        [Fact]
        public void CanCompare_SamePropertyValue_True()
        {
            var comparer = TestComparisonClass.Comparer;

            var o1 = new TestComparisonClass { Property1 = "obj1", Property2 = 1 };
            var o2 = new TestComparisonClass { Property1 = "obj2", Property2 = 1 };
            comparer.Equals(o1, o2).ShouldBeTrue();
        }

        [Fact]
        public void CanCompare_Array_Distinct()
        {
            var objects = Enumerable.Range(0, 50).Select(i => new TestComparisonClass { Property2 = 0 }).ToArray();

            var distinctObjects = objects.Distinct(TestComparisonClass.Comparer);
            distinctObjects.Count().ShouldBe(1);
        }
    }

    public class TestComparisonClass
    {
        public static IEqualityComparer<TestComparisonClass> Comparer => new LambdaComparer<TestComparisonClass>((o1, o2) => o1.Property2.Equals(o2.Property2), o => o.Property2.GetHashCode());

        public string? Property1 { get; set; }
        public int Property2 { get; set; }
    }
}
