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
using System.Linq.Expressions;
using System.Reflection;

namespace EMBC.ESS.Resources.Print.Utils
{
    internal static class PredicateBuilder
    {
        public static Expression<Func<T, bool>> Make<T>()
        {
            return null;
        }

        public static Expression<Func<T, bool>> Make<T>(this Expression<Func<T, bool>> predicate)
        {
            return predicate;
        }

        public static Expression<Func<T, bool>> Or<T>(this Expression<Func<T, bool>> expr, Expression<Func<T, bool>> or)
        {
            if (expr == null) return or;
            Replace(or, or.Parameters[0], expr.Parameters[0]);
            return Expression.Lambda<Func<T, bool>>(Expression.Or(expr.Body, or.Body), expr.Parameters);
        }

        public static Expression<Func<T, bool>> And<T>(this Expression<Func<T, bool>> expr, Expression<Func<T, bool>> and)
        {
            if (expr == null) return and;
            Replace(and, and.Parameters[0], expr.Parameters[0]);
            return Expression.Lambda<Func<T, bool>>(Expression.And(expr.Body, and.Body), expr.Parameters);
        }

        private static void Replace(object instance, object old, object replacement)
        {
            for (Type t = instance.GetType(); t != null; t = t.BaseType)
            {
                foreach (FieldInfo fi in t.GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance))
                {
                    object val = fi.GetValue(instance);
                    if (val != null && val.GetType().Assembly == typeof(Expression).Assembly)
                    {
                        if (ReferenceEquals(val, old))
                            fi.SetValue(instance, replacement);
                        else
                            Replace(val, old, replacement);
                    }
                }
            }
        }
    }
}
