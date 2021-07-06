// -------------------------------------------------------------------------
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
using System.Diagnostics.CodeAnalysis;

namespace EMBC.ESS.Utilities.Extensions
{
    public class LambdaComparer<T> : EqualityComparer<T>
    {
        private readonly Func<T, T, bool> comparerFunc;

        public LambdaComparer(Func<T, T, bool> comparerFunc)
        {
            this.comparerFunc = comparerFunc;
        }

        public override bool Equals([AllowNull] T x, [AllowNull] T y) => comparerFunc(x, y);

        public override int GetHashCode([DisallowNull] T obj) => obj.GetHashCode();
    }
}
