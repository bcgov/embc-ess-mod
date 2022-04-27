using System;

namespace EMBC.ESS.Utilities.Dynamics
{
    public class DynamicsOptions
    {
        public Uri DynamicsApiEndpoint { get; set; } = null!;
        public Uri DynamicsApiBaseUri { get; set; } = null!;
        public int TimeoutInSeconds { get; set; } = 29;
        public int CircuitBreakerNumberOfErrors { get; set; } = 3;
        public int CircuitBreakerResetInSeconds { get; set; } = 15;
        public AdfsOptions Adfs { get; set; } = new AdfsOptions();
        public int NumberOfRetries { get; set; } = 2;
        public int RetryWaitTimeInSeconds { get; set; } = 1;
        public TimeSpan HttpClientTimeout { get; set; } = TimeSpan.FromSeconds(30);
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
        public int CircuitBreakerNumberOfErrors { get; set; } = 5;
        public int CircuitBreakerResetInSeconds { get; set; } = 15;
    }
}
