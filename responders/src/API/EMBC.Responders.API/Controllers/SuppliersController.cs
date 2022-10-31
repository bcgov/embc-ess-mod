using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Teams;
using EMBC.Utilities.Messaging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SuppliersController : ControllerBase
    {
        private readonly IMessagingClient messagingClient;
        private readonly IMapper mapper;

        private string teamId => User.FindFirstValue("user_team");

        public SuppliersController(IMessagingClient messagingClient, IMapper mapper)
        {
            this.messagingClient = messagingClient;
            this.mapper = mapper;
        }

        /// <summary>
        /// Search Suppliers
        /// </summary>
        /// <param name="legalName">legalName</param>
        /// <param name="gstNumber">gstNumber</param>
        /// <returns>list of suppliers for the user's team</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SupplierListItem>>> GetSuppliers(string? legalName, string? gstNumber)
        {
            var query = new SuppliersQuery();
            if (!string.IsNullOrEmpty(legalName) && !string.IsNullOrEmpty(gstNumber))
            {
                query.LegalName = legalName;
                query.GSTNumber = gstNumber;
            }
            else
            {
                query.TeamId = teamId;
            }
            var suppliers = (await messagingClient.Send(query)).Items;

            return Ok(mapper.Map<IEnumerable<SupplierListItem>>(suppliers, opt => opt.Items["UserTeamId"] = teamId));
        }

        /// <summary>
        /// Get Supplier by id
        /// </summary>
        /// <param name="supplierId">SupplierId</param>
        /// <returns>updated supplier id</returns>
        [HttpGet("{supplierId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Supplier>> GetSupplierById(string supplierId)
        {
            var supplier = (await messagingClient.Send(new SuppliersQuery
            {
                SupplierId = supplierId,
            })).Items.FirstOrDefault();

            if (supplier == null) return NotFound(supplierId);

            return Ok(mapper.Map<Supplier>(supplier));
        }

        /// <summary>
        /// Create Supplier
        /// </summary>
        /// <param name="supplier">supplier</param>
        /// <returns>supplier id if success or bad request</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SupplierResult>> CreateSupplier([FromBody] Supplier supplier)
        {
            supplier.PrimaryTeams = new[] { new SupplierTeamDetails { Id = teamId } };
            var id = await messagingClient.Send(new SaveSupplierCommand
            {
                Supplier = mapper.Map<ESS.Shared.Contracts.Teams.Supplier>(supplier),
            });
            return Ok(new SupplierResult { Id = id });
        }

        /// <summary>
        /// Update supplier
        /// </summary>
        /// <param name="supplier">supplier</param>
        /// <param name="supplierId">supplier id</param>
        /// <returns>supplier id if success or bad request</returns>
        [HttpPost("{supplierId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SupplierResult>> UpdateSupplier([FromBody] Supplier supplier, string supplierId)
        {
            supplier.Id = supplierId;
            var id = await messagingClient.Send(new SaveSupplierCommand
            {
                Supplier = mapper.Map<ESS.Shared.Contracts.Teams.Supplier>(supplier),
            });
            return Ok(new SupplierResult { Id = id });
        }

        /// <summary>
        /// Remove supplier
        /// </summary>
        /// <param name="supplierId">supplier id</param>
        /// <returns>supplier id if success or bad request</returns>
        [HttpPost("{supplierId}/remove")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SupplierResult>> RemoveSupplier(string supplierId)
        {
            if (string.IsNullOrEmpty(supplierId)) return BadRequest(nameof(supplierId));

            var id = await messagingClient.Send(new RemoveSupplierCommand
            {
                SupplierId = supplierId
            });
            return Ok(new SupplierResult { Id = id });
        }

        /// <summary>
        /// Activate a supplier
        /// </summary>
        /// <param name="supplierId">supplier id</param>
        /// <returns>supplier id if success or bad request</returns>
        [HttpPost("{supplierId}/active")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SupplierResult>> ActivateSupplier(string supplierId)
        {
            if (string.IsNullOrEmpty(supplierId)) return BadRequest(nameof(supplierId));

            var reply = await messagingClient.Send(new ActivateSupplierCommand
            {
                SupplierId = supplierId,
                TeamId = teamId
            });
            return Ok(new SupplierResult { Id = reply });
        }

        /// <summary>
        /// Activate a supplier
        /// </summary>
        /// <param name="supplierId">supplier id</param>
        /// <returns>supplier id if success or bad request</returns>
        [HttpPost("{supplierId}/inactive")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SupplierResult>> DeactivateSupplier(string supplierId)
        {
            if (string.IsNullOrEmpty(supplierId)) return BadRequest(nameof(supplierId));

            var reply = await messagingClient.Send(new DeactivateSupplierCommand
            {
                SupplierId = supplierId,
                TeamId = teamId
            });
            return Ok(new SupplierResult { Id = reply });
        }

        /// <summary>
        /// Claim a supplier
        /// </summary>
        /// <param name="supplierId">supplier id</param>
        /// <returns>supplier id if success or bad request</returns>
        [HttpPost("{supplierId}/claim")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SupplierResult>> ClaimSupplier(string supplierId)
        {
            if (string.IsNullOrEmpty(supplierId)) return BadRequest(nameof(supplierId));

            var reply = await messagingClient.Send(new ClaimSupplierCommand
            {
                SupplierId = supplierId,
                TeamId = teamId
            });
            return Ok(new SupplierResult { Id = reply });
        }

        /// <summary>
        /// Add a Team the Supplier is shared with
        /// </summary>
        /// <param name="supplierId">supplier id</param>
        /// <param name="sharedTeamId">shared team id</param>
        /// <returns>supplier id if success or bad request</returns>
        [HttpPost("{supplierId}/add-team/{sharedTeamId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SupplierResult>> AddSupplierSharedWithTeam(string supplierId, string sharedTeamId)
        {
            if (string.IsNullOrEmpty(supplierId)) return BadRequest(nameof(supplierId));

            var reply = await messagingClient.Send(new ShareSupplierWithTeamCommand
            {
                SupplierId = supplierId,
                TeamId = sharedTeamId,
                SharingTeamId = teamId
            });
            return Ok(new SupplierResult { Id = reply });
        }

        /// <summary>
        /// Remove a Team the Supplier is shared with
        /// </summary>
        /// <param name="supplierId">supplier id</param>
        /// <param name="sharedTeamId">shared team id</param>
        /// <returns>supplier id if success or bad request</returns>
        [HttpPost("{supplierId}/remove-team/{sharedTeamId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SupplierResult>> RemoveSupplierSharedWithTeam(string supplierId, string sharedTeamId)
        {
            if (string.IsNullOrEmpty(supplierId)) return BadRequest(nameof(supplierId));

            var reply = await messagingClient.Send(new UnshareSupplierWithTeamCommand
            {
                SupplierId = supplierId,
                TeamId = sharedTeamId,
                SharingTeamId = teamId
            });
            return Ok(new SupplierResult { Id = reply });
        }
    }

    public class SupplierListItem
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string LegalName { get; set; }
        public string GSTNumber { get; set; }
        public Address Address { get; set; }
        public IEnumerable<SupplierTeamDetails> PrimaryTeams { get; set; } = Array.Empty<SupplierTeamDetails>();
        public SupplierStatus Status { get; set; }
        public bool IsPrimarySupplier { get; set; }
        public bool ProvidesMutualAid { get; set; }
        public MutualAid MutualAid { get; set; }
    }

    public class Supplier
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string LegalName { get; set; }
        public string GSTNumber { get; set; }
        public Address Address { get; set; } = null!;
        public SupplierContact Contact { get; set; } = null!;
        public IEnumerable<SupplierTeamDetails> PrimaryTeams { get; set; } = Array.Empty<SupplierTeamDetails>();
        public IEnumerable<MutualAid> MutualAids { get; set; } = Array.Empty<MutualAid>();
        public SupplierStatus Status { get; set; }
    }

    public class SupplierTeamDetails
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class SupplierContact
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
    }

    public class SupplierResult
    {
        public string Id { get; set; }
    }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SupplierStatus
    {
        [Description("Active")]
        Active,

        [Description("Deactivated")]
        Deactivated
    }

    public class MutualAid
    {
        public string GivenByTeamId { get; set; }
        public DateTime GivenOn { get; set; }
        public SupplierTeam GivenToTeam { get; set; }
    }

    public class SuppliersMapping : Profile
    {
        public SuppliersMapping()
        {
            CreateMap<ESS.Shared.Contracts.Teams.Supplier, SupplierListItem>()
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.Status == ESS.Shared.Contracts.Teams.SupplierStatus.Active ? SupplierStatus.Active : SupplierStatus.Deactivated))
                .ForMember(d => d.IsPrimarySupplier, opts => opts.MapFrom((s, dst, arg, context) => context.Items.ContainsKey("UserTeamId") && s.PrimaryTeams.Any(t => t.Id.Equals(context.Items["UserTeamId"]))))
                .ForMember(d => d.ProvidesMutualAid, opts => opts.MapFrom((s, dst, arg, context) => context.Items.ContainsKey("UserTeamId") && s.PrimaryTeams.Any(t => t.Id.Equals(context.Items["UserTeamId"])) && s.MutualAids.Any()))
                .ForMember(d => d.MutualAid, opts => opts.MapFrom((s, dst, arg, context) => s.MutualAids.SingleOrDefault(ma => context.Items.ContainsKey("UserTeamId") && ma.GivenToTeam.Equals(context.Items["UserTeamId"]))))
                ;

            CreateMap<ESS.Shared.Contracts.Teams.Supplier, Supplier>()
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.Status == ESS.Shared.Contracts.Teams.SupplierStatus.Active ? SupplierStatus.Active : SupplierStatus.Deactivated))
                ;

            CreateMap<Supplier, ESS.Shared.Contracts.Teams.Supplier>()
                .ForMember(d => d.Verified, opts => opts.Ignore())
                ;

            CreateMap<ESS.Shared.Contracts.Teams.SupplierTeam, SupplierTeamDetails>()
                .ForMember(d => d.IsActive, opts => opts.Ignore())
                ;

            CreateMap<SupplierTeamDetails, ESS.Shared.Contracts.Teams.SupplierTeam>()
                ;

            CreateMap<ESS.Shared.Contracts.Teams.Address, Address>()
                .ForMember(d => d.CommunityCode, opts => opts.MapFrom(s => s.Community))
                .ForMember(d => d.StateProvinceCode, opts => opts.MapFrom(s => s.StateProvince))
                .ForMember(d => d.CountryCode, opts => opts.MapFrom(s => s.Country))
                ;

            CreateMap<Address, ESS.Shared.Contracts.Teams.Address>()
                .ForMember(d => d.Community, opts => opts.MapFrom(s => s.CommunityCode))
                .ForMember(d => d.StateProvince, opts => opts.MapFrom(s => s.StateProvinceCode))
                .ForMember(d => d.Country, opts => opts.MapFrom(s => s.CountryCode))
                ;

            CreateMap<ESS.Shared.Contracts.Teams.SupplierContact, SupplierContact>()
                ;

            CreateMap<SupplierContact, ESS.Shared.Contracts.Teams.SupplierContact>()
                .ForMember(d => d.Id, opts => opts.Ignore())
                ;

            CreateMap<MutualAid, ESS.Shared.Contracts.Teams.MutualAid>();
            CreateMap<ESS.Shared.Contracts.Teams.MutualAid, MutualAid>();
        }
    }
}
