using System;
using System.Net;
using System.Reflection;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Teams;
using EMBC.Utilities.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Helpers
{
    public class ErrorParser
    {
        public ActionResult Parse(Exception ex)
        {
            return ex switch
            {
                ServerException e => ParseServerException(e),
                ClientException e => ParseClientException(e),
                _ => throw ex
            };
        }

        public ActionResult ParseServerException(ServerException e)
        {
            return e.Type switch
            {
                string t when t == typeof(NotFoundException).AssemblyQualifiedName => new NotFoundObjectResult(new ProblemDetails { Type = t, Title = "Not Found", Detail = e.Message }),
                string t when t == typeof(CommunitiesAlreadyAssignedException).AssemblyQualifiedName => new BadRequestObjectResult(new ProblemDetails { Type = t, Title = "Communities already assigned", Detail = string.Join(',', e.Message) }),
                string t when t == typeof(UsernameAlreadyExistsException).AssemblyQualifiedName => new BadRequestObjectResult(new ProblemDetails { Type = t, Title = "User name already exists", Detail = e.Message }),
                string t when t == typeof(BusinessLogicException).AssemblyQualifiedName => new BadRequestObjectResult(new ProblemDetails { Type = t, Title = "Business logic error", Detail = e.Message }),
                string t when t == typeof(BusinessValidationException).AssemblyQualifiedName => new BadRequestObjectResult(new ProblemDetails { Type = t, Title = "Business validation error", Detail = e.Message }),
                _ => new BadRequestObjectResult(new ProblemDetails { Type = e.Type, Title = "Unexpected error", Detail = e.Message })
            };
        }

        public ActionResult ParseClientException(ClientException e)
        {
            return e.Type switch
            {
                string t when t == typeof(ESS.Shared.Contracts.TimeoutException).AssemblyQualifiedName => new StatusCodeResult((int)HttpStatusCode.RequestTimeout),
                _ => new BadRequestObjectResult(new ProblemDetails { Type = e.Type, Title = "Unexpected error", Detail = e.Message })
            };
        }
    }
}
