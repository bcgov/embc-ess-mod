using System;

namespace EMBC.Suppliers.API.Utilities
{
#pragma warning disable CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
    public class VersionInformation
    {
        public string name { get; set; } = null!;
        public Version? version { get; set; }
    }
#pragma warning restore CS8632 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context.
}
