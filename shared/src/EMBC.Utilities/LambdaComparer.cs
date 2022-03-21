using System;
using System.Collections.Generic;

namespace EMBC.Utilities
{
    public class LambdaComparer<T> : EqualityComparer<T>
    {
        private readonly Func<T, T, bool> comparerFunc;
        private readonly Func<T, int> hashFunc;

        public LambdaComparer(Func<T, T, bool> comparerFunc, Func<T, int> hashFunc)
        {
            this.comparerFunc = comparerFunc;
            this.hashFunc = hashFunc;
        }

        public override bool Equals(T x, T y) => comparerFunc(x, y);

        public override int GetHashCode(T obj) => hashFunc(obj);
    }
}
