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

namespace EMBC.ESS.Utilities.Dynamics
{
    public class DynamicsOptions
    {
        public Uri DynamicsApiEndpoint { get; set; } = null!;
        public Uri DynamicsApiBaseUri { get; set; } = null!;
        public int TimeoutInSeconds { get; set; } = 29;
        public int CircuitBreakerNumberOfErrors { get; set; } = 5;
        public int CircuitBreakerResetInSeconds { get; set; } = 5;
        public AdfsOptions Adfs { get; set; } = new AdfsOptions();
        public int NumberOfRetries { get; set; } = 3;
        public int RetryWaitTimeInSeconds { get; set; } = 5;
    }

    public class AdfsOptions
    {
        public Uri OAuth2TokenEndpoint { get; set; } = null!;
        public string ClientId { get; set; } = string.Empty;
        public string ClientSecret { get; set; } = string.Empty;
        public string ServiceAccountDomain { get; set; } = string.Empty;
        public string ServiceAccountName { get; set; } = string.Empty;
        public string ServiceAccountPassword { get; set; } = string.Empty;
        public string ResourceName { get; set; } = string.Empty;
        public int TimeoutInSeconds { get; set; } = 5;
        public int CircuitBreakerNumberOfErrors { get; set; } = 2;
        public int CircuitBreakerResetInSeconds { get; set; } = 5;
    }
}
