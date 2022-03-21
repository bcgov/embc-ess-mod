using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

namespace EMBC.Utilities.Extensions
{
    public static class EnumDescriptionHelper
    {
        public static IEnumerable<(string Value, string Description)> GetEnumDescriptions(Type enumType) =>
           Enum.GetNames(enumType).Select(e => (e, GetEnumDescription(enumType, e)));

        public static IEnumerable<(TEnum Value, string Description)> GetEnumDescriptions<TEnum>()
            where TEnum : struct =>
           Enum.GetNames(typeof(TEnum)).Select(e => (Enum.Parse<TEnum>(e), GetEnumDescription(typeof(TEnum), e)));

        public static string GetEnumDescription<TEnum>(TEnum value)
            where TEnum : Enum =>
            GetEnumDescription(typeof(TEnum), value.ToString());

        private static string GetEnumDescription(Type enumType, string value) =>
            (enumType.GetField(value)?.GetCustomAttributes(typeof(DescriptionAttribute), false) as DescriptionAttribute[])?.FirstOrDefault()?.Description ?? string.Empty;
    }
}
