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
            this.SaveChangesDefaultOptions = SaveChangesOptions.BatchWithSingleChangeset;
            BuildingRequest += (sender, args) =>
            {
                args.Headers.Add("Authorization", $"Bearer {tokenFactory().GetAwaiter().GetResult()}");
                if (args.RequestUri.IsAbsoluteUri)
                {
                    args.RequestUri = new Uri(url, (url.AbsolutePath == "/" ? string.Empty : url.AbsolutePath) + args.RequestUri.AbsolutePath + args.RequestUri.Query);
                }
                else
                {
                    args.RequestUri = new Uri(url, (url.AbsolutePath == "/" ? string.Empty : url.AbsolutePath) + uri.AbsolutePath + args.RequestUri.ToString());
                }
            };
            SendingRequest2 += (sender, args) =>
            {
                logger.LogDebug("{0} SendingRequest2 {1} {2} ", nameof(DynamicsClientContext), args.RequestMessage.Method, args.RequestMessage.Url);
            };
            ReceivingResponse += (sender, args) =>
            {
                logger.LogDebug("{0} ReceivingResponse {1} response", nameof(DynamicsClientContext), args.ResponseMessage?.StatusCode);
            };
            Configurations.RequestPipeline.OnEntryStarting((arg) =>
            {
                // do not send reference properties and null values to Dynamics
                arg.Entry.Properties = arg.Entry.Properties.Where((prop) => !prop.Name.StartsWith('_') && prop.Value != null);
                logger.LogDebug("{0} OnEntryStarting: {1}", nameof(DynamicsClientContext), JsonSerializer.Serialize(arg.Entity));
            });
        }
    }
}
