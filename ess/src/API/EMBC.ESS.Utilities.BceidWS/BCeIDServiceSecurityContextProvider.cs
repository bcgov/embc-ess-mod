using System;
using BCeIDService;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace EMBC.ESS.Utilities.BceidWS
{
    public interface IBCeIDServiceSecurityContextProvider
    {
        BCeIDSecurityContext GetSecurityContext();
    }

    public class BCeIDSecurityContext
    {
        public string? OnlineServiceId { get; set; }
        public string? RequesterGuid { get; set; }
        public BCeIDAccountTypeCode RequesterBusinessType { get; set; }
    }

    public class BCeIDWebServiceOptions
    {
        public Uri? Url { get; set; }
        public string? OnlineServiceId { get; set; }
        public string? ServiceAccountUser { get; set; }
        public string? ServiceAccountPassword { get; set; }
    }

    public class BCeIDServiceSecurityContextProvider : IBCeIDServiceSecurityContextProvider
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly BCeIDWebServiceOptions options;

        public BCeIDServiceSecurityContextProvider(IHttpContextAccessor httpContextAccessor, IOptions<BCeIDWebServiceOptions> options)
        {
            this.httpContextAccessor = httpContextAccessor;
            this.options = options.Value;
        }

        public BCeIDSecurityContext GetSecurityContext()
        {
            //TODO: ensure user is set in the http context and the correct claims are mapped here
            var requesterGuid = httpContextAccessor.HttpContext?.User?.FindFirst("user_guid")?.Value;
            var requesterBusinessType = httpContextAccessor.HttpContext?.User?.FindFirst("user_type")?.Value;

            return new BCeIDSecurityContext
            {
                OnlineServiceId = options.OnlineServiceId,
                RequesterGuid = requesterGuid,
                RequesterBusinessType = requesterBusinessType == null ? BCeIDAccountTypeCode.Void : Enum.Parse<BCeIDAccountTypeCode>(requesterBusinessType)
            };
        }
    }
}
