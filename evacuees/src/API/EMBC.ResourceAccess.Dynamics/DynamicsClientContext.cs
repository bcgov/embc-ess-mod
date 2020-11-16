using System;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Client;

namespace EMBC.ResourceAccess.Dynamics
{
    public class DynamicsClientContext : Microsoft.Dynamics.CRM.System

    {
        private readonly ILogger logger;

        public DynamicsClientContext(Uri uri, Func<string> tokenFactory, ILogger logger) : base(uri)
        {
            this.logger = logger;

            BuildingRequest += delegate (object sender, BuildingRequestEventArgs args)
            {
                args.Headers.Add("Authorization", $"Bearer {tokenFactory()}");
            };
            SendingRequest2 += delegate (object sender, SendingRequest2EventArgs args)
            {
                logger.LogDebug("{0} sends {1} {2}", nameof(DynamicsClientContext), args.RequestMessage.Method, args.RequestMessage.Url);
            };
            ReceivingResponse += delegate (object sender, ReceivingResponseEventArgs args)
            {
                logger.LogDebug("{0} received {1} response", nameof(DynamicsClientContext), args.ResponseMessage.StatusCode);
            };
            Configurations.RequestPipeline.OnEntryStarting((arg) =>
            {
                arg.Entry.Properties = arg.Entry.Properties.Where((prop) => prop.Value != null);
            });
        }
    }
}
