// -------------------------------------------------------------------------
//  Copyright © 2020 Province of British Columbia
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
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace EMBC.Suppliers.API.Utilities
{
    /// <summary>
    /// Secure random generator
    /// https://stackoverflow.com/questions/42426420/how-to-generate-a-cryptographically-secure-random-integer-within-a-range
    /// </summary>
    public class RandomGenerator : IDisposable
    {
        private readonly RNGCryptoServiceProvider csp;

        /// <summary>
        /// Initializes a new instance of the <see cref="RandomGenerator"/> class.
        /// </summary>
        public RandomGenerator()
        {
            csp = new RNGCryptoServiceProvider();
        }

        /// <summary>
        /// Get random value within range
        /// </summary>
        /// <param name="minValue">Minimum allowed value, inclusive</param>
        /// <param name="maxExclusiveValue">Maximum allowed value, inclusive</param>
        /// <returns>Random integer within specified range</returns>
        public int Next(int minValue, int maxExclusiveValue)
        {
            if (minValue == maxExclusiveValue) return minValue;

            if (minValue > maxExclusiveValue)
            {
                throw new ArgumentOutOfRangeException($"{minValue} must be lower than {maxExclusiveValue}");
            }

            var diff = (long)maxExclusiveValue - minValue;
            var upperBound = uint.MaxValue / diff * diff;

            uint ui;
            do
            {
                ui = GetRandomUInt();
            }
            while (ui >= upperBound);

            return (int)(minValue + (ui % diff));
        }

        private uint GetRandomUInt()
        {
            var randomBytes = GenerateRandomBytes(sizeof(uint));
            return BitConverter.ToUInt32(randomBytes, 0);
        }

        private byte[] GenerateRandomBytes(int bytesNumber)
        {
            var buffer = new byte[bytesNumber];
            csp.GetBytes(buffer);
            return buffer;
        }

        private bool disposed;

        /// <summary>
        /// Public implementation of Dispose pattern callable by consumers.
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// Protected implementation of Dispose pattern.
        /// </summary>
        /// <param name="disposing">Boolean, whether to dispose managed state/objects</param>
        protected virtual void Dispose(bool disposing)
        {
            if (disposed)
            {
                return;
            }

            if (disposing)
            {
                // Dispose managed state (managed objects).
                csp?.Dispose();
            }

            disposed = true;
        }
    }
}
