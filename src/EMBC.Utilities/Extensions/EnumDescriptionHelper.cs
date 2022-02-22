﻿// -------------------------------------------------------------------------
//  Copyright © 2021 Province of British Columbia
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  https://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// -------------------------------------------------------------------------

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
