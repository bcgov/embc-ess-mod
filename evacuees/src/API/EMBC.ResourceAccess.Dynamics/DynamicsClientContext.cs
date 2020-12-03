using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.OData.Client;

namespace EMBC.ResourceAccess.Dynamics
{
    public class DynamicsClientContext : Microsoft.Dynamics.CRM.System

    {
        private readonly ILogger logger;

        public DynamicsClientContext(Uri uri, Uri url, Func<Task<string>> tokenFactory, ILogger logger) : base(uri)
        {
            this.logger = logger;

            BuildingRequest += delegate (object sender, BuildingRequestEventArgs args)
            {
                args.Headers.Add("Authorization", $"Bearer {tokenFactory().GetAwaiter().GetResult()}");
                if (args.RequestUri.IsAbsoluteUri)
                {
                    args.RequestUri = new Uri(url, url.AbsolutePath + args.RequestUri.AbsolutePath);
                }
                else
                {
                    args.RequestUri = new Uri(url, url.AbsolutePath + uri.AbsolutePath + args.RequestUri.ToString());
                }     
                logger.LogDebug("{0} BuildingRequest {1}", nameof(DynamicsClientContext), args.RequestUri);
            };
            SendingRequest2 += delegate (object sender, SendingRequest2EventArgs args)
            {
                logger.LogDebug("{0} SendingRequest2 {1} {2} ", nameof(DynamicsClientContext), args.RequestMessage.Method, args.RequestMessage.Url);
            };
            ReceivingResponse += delegate (object sender, ReceivingResponseEventArgs args)
            {
                logger.LogDebug("{0} ReceivingResponse {1} response", nameof(DynamicsClientContext), args.ResponseMessage?.StatusCode);
            };
            Configurations.RequestPipeline.OnEntryStarting((arg) =>
            {
                arg.Entry.Properties = arg.Entry.Properties.Where((prop) => prop.Value != null);
                logger.LogDebug("{0} OnEntryStarting: {1}", nameof(DynamicsClientContext), JsonSerializer.Serialize(arg.Entity));
            });

            Configurations.RequestPipeline.OnEntityReferenceLink((arg) =>
            {
                logger.LogDebug("{0} OnEntityReferenceLink url {1}", nameof(DynamicsClientContext), arg.EntityReferenceLink.Url);
            });
        }
    }
}
