using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Utilities.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace EMBC.Responders.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class SupportsController : ControllerBase
{
    private readonly IMessagingClient messagingClient;
    private readonly IMapper mapper;

    public SupportsController(IMessagingClient messagingClient, IMapper mapper)
    {
        this.messagingClient = messagingClient ?? throw new ArgumentNullException(nameof(messagingClient));
        this.mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    /// <summary>
    /// Checks if a support being issued is a potential duplicate
    /// </summary>
    /// <param name="request">Details about the support being checked for duplicates</param>
    /// <returns>Potential duplicate supports</returns>
    [HttpGet("get-duplicate-supports")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetDuplicateSupports([FromQuery] CheckDuplicateSupportsRequest request)
    {
        var response = await messagingClient.Send(new DuplicateSupportsQuery
        {
            Category = request.Category,
            FromDate = request.FromDate,
            ToDate = request.ToDate,
            Members = request.Members
        });

        return Ok(response.DuplicateSupports);
    }
}

public record CheckDuplicateSupportsRequest
{
    public string Category { get; set; }
    public string FromDate { get; set; }
    public string ToDate { get; set; }
    public string[] Members { get; set; }
}
