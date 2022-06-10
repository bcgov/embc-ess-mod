using System;
using System.Reflection;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Teams;
using EMBC.Utilities.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Helpers
{
    public class ErrorParser : ControllerBase
    {
        public ActionResult Parse(ServerException e)
        {
            var responseType = Type.GetType(e.Type, an => Assembly.Load(an.Name ?? null!), null, true, true)?.Name ?? null!;
            switch (responseType)
            {
                case nameof(NotFoundException):
                    {
                        return NotFound(e.Message);
                    }
                case nameof(CommunitiesAlreadyAssignedException):
                    {
                        return BadRequest(new ProblemDetails { Type = responseType, Title = "Communities already assigned", Detail = string.Join(',', e.Message) });
                    }
                case nameof(UsernameAlreadyExistsException):
                    {
                        return BadRequest(new ProblemDetails { Type = responseType, Title = "User name already exists", Detail = e.Message });
                    }
                case nameof(BusinessLogicException):
                case nameof(BusinessValidationException):
                default: return BadRequest(e);
            }
        }
    }
}
