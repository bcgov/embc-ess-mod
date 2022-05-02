using System;
using System.Diagnostics;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Utilities.Hosting
{
    internal static class ErrorHandling
    {
        //borrowed from https://andrewlock.net/creating-a-custom-error-handler-middleware-function/
        public static Task WriteDevelopmentResponse(HttpContext httpContext, Func<Task> next) => WriteResponse(httpContext, includeDetails: true, next);

        public static Task WriteProductionResponse(HttpContext httpContext, Func<Task> next) => WriteResponse(httpContext, includeDetails: false, next);

        private static async Task WriteResponse(HttpContext httpContext, bool includeDetails, Func<Task> next)
        {
            // Try and retrieve the error from the ExceptionHandler middleware
            var exceptionDetails = httpContext.Features.Get<IExceptionHandlerFeature>();
            var ex = exceptionDetails?.Error;

            // Should always exist, but best to be safe!
            if (ex != null)
            {
                // ProblemDetails has it's own content type
                httpContext.Response.ContentType = "application/problem+json";

                // Get the details to display, depending on whether we want to expose the raw exception
                var title = includeDetails ? "An error occured: " + ex.Message : "An error occured";
                var details = includeDetails ? ex.ToString() : null;

                var problem = new ProblemDetails
                {
                    Status = 500,
                    Title = title,
                    Detail = details
                };

                // This is often very handy information for tracing the specific request
                var traceId = Activity.Current?.Id ?? httpContext?.TraceIdentifier;
                if (traceId != null)
                {
                    problem.Extensions["traceId"] = traceId;
                }

                //Serialize the problem details object to the Response as JSON (using System.Text.Json)
                var stream = (httpContext ?? null!).Response.Body;
                await JsonSerializer.SerializeAsync(stream, problem);
            }
            await next();
        }
    }
}
