using Bogus;

namespace EMBC.Tests.Unit.Responders.API
{
    public static class BogusEx
    {
        public static bool? NullableBool(this Randomizer randomizer) => randomizer.ArrayElement(new[] { (bool?)null, true, false });
    }
}
