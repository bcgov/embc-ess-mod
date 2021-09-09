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
using System.Net;
using EMBC.ESS.Engines.Search;
using EMBC.ESS.Managers.Admin;
using EMBC.ESS.Managers.Metadata;
using EMBC.ESS.Managers.Submissions;
using EMBC.ESS.Resources.Cases;
using EMBC.ESS.Resources.Contacts;
using EMBC.ESS.Resources.Metadata;
using EMBC.ESS.Resources.Suppliers;
using EMBC.ESS.Resources.Tasks;
using EMBC.ESS.Resources.Team;
using EMBC.ESS.Utilities.Cache;
using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Messaging;
using EMBC.ESS.Utilities.Notifications;
using EMBC.ESS.Utilities.PdfGenerator;
using EMBC.ESS.Utilities.Transformation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;

namespace EMBC.ESS
{
    public class Startup
    {
        private const string HealthCheckReadyTag = "ready";
        private const string HealthCheckAliveTag = "alive";

        private readonly IConfiguration configuration;

        public Startup(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDistributedMemoryCache();

            services.Configure<MessageHandlerRegistryOptions>(opts => { });
            services.AddSingleton<MessageHandlerRegistry>();
            services.AddGrpc(opts =>
            {
                opts.EnableDetailedErrors = true;
            });

            services.AddHealthChecks()
                .AddCheck("ESS API ready hc", () => HealthCheckResult.Healthy("API ready"), new[] { HealthCheckReadyTag })
                .AddCheck("ESS API live hc", () => HealthCheckResult.Healthy("API alive"), new[] { HealthCheckAliveTag });
            services.AddAutoMapper((sp, cfg) => { cfg.ConstructServicesUsing(t => sp.GetRequiredService(t)); }, typeof(Startup));

            services
                .AddAdminManager()
                .AddMetadataManager()
                .AddSubmissionManager();

            services
                .AddSearchEngine();

            services
                .AddTeamRepository()
                .AddMetadataRepository()
                .AddContactRepository()
                .AddCaseRepository()
                .AddTaskRepository()
                .AddSupplierRepository();

            services
                .AddDynamics(configuration)
                .AddCache()
                .AddTransformator()
                .AddPdfGenerator(configuration.GetSection("PdfGenerator"))
                .AddNotificationSenders(configuration);
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseSerilogRequestLogging(opts =>
            {
                opts.GetLevel = ExcludeHealthChecks;
                opts.EnrichDiagnosticContext = (diagCtx, httpCtx) =>
                {
                    diagCtx.Set("User", httpCtx.User.Identity?.Name);
                    diagCtx.Set("Host", httpCtx.Request.Host);
                    diagCtx.Set("UserAgent", httpCtx.Request.Headers["User-Agent"].ToString());
                    diagCtx.Set("RemoteIP", httpCtx.Connection.RemoteIpAddress.ToString());
                    diagCtx.Set("ConnectionId", httpCtx.Connection.Id);
                    diagCtx.Set("Forwarded", httpCtx.Request.Headers["Forwarded"].ToString());
                    diagCtx.Set("ContentLength", httpCtx.Response.ContentLength);
                };
            });

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGrpcService<DispatcherService>();
                endpoints.MapHealthChecks("/hc/ready", new HealthCheckOptions() { Predicate = check => check.Tags.Contains(HealthCheckReadyTag) });
                endpoints.MapHealthChecks("/hc/live", new HealthCheckOptions() { Predicate = check => check.Tags.Contains(HealthCheckAliveTag) });
                endpoints.MapHealthChecks("/hc/startup", new HealthCheckOptions() { Predicate = _ => false });
            });
        }

        //inspired by https://andrewlock.net/using-serilog-aspnetcore-in-asp-net-core-3-excluding-health-check-endpoints-from-serilog-request-logging/
        private static LogEventLevel ExcludeHealthChecks(HttpContext ctx, double _, Exception ex) =>
        ex != null
            ? LogEventLevel.Error
            : ctx.Response.StatusCode >= (int)HttpStatusCode.InternalServerError
                ? LogEventLevel.Error
                : ctx.Request.Path.StartsWithSegments("/hc", StringComparison.InvariantCultureIgnoreCase)
                    ? LogEventLevel.Verbose
                    : LogEventLevel.Information;
    }
}
