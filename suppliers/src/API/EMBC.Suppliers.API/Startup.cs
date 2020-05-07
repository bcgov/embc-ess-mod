using System.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NSwag.AspNetCore;

namespace EMBC.Suppliers.API
{
#pragma warning disable CA1822 // Mark members as static

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddOpenApiDocument();
            services.Configure<OpenApiDocumentMiddlewareSettings>(options =>
            {
                options.Path = "/api/swagger/{documentName}/swagger.json";
            });
            services.Configure<SwaggerUi3Settings>(options =>
            {
                options.Path = "/api/swagger";
                options.DocumentPath = "/api/swagger/{documentName}/swagger.json";
            });
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.All;
                var knownNetworks = Configuration.GetValue("KNOWN_NETWORKS", "::ffff:172.51.0.0/16").Split(';');
                foreach (var knownNetwork in knownNetworks)
                {
                    options.KnownNetworks.Add(ParseNetworkFromString(knownNetwork));
                }
            });
        }

        private IPNetwork ParseNetworkFromString(string network)
        {
            var networkParts = network.Trim().Split('/');
            var prefix = IPAddress.Parse(networkParts[0]);
            var length = int.Parse(networkParts[1]);
            return new IPNetwork(prefix, length);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseForwardedHeaders();

            app.UseOpenApi();
            app.UseSwaggerUi3();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }

#pragma warning restore CA1822 // Mark members as static
}
