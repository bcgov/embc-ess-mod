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
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Security.Claims;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Suppliers;
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

            if (supplier == null) return NotFound();

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
            if (supplier.Team == null)
            {
                supplier.Team = new SupplierTeamDetails();
            }
            supplier.Team.Id = teamId;
            var id = await messagingClient.Send(new SaveSupplierCommand
            {
                Supplier = mapper.Map<ESS.Shared.Contracts.Suppliers.Supplier>(supplier),
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
                Supplier = mapper.Map<ESS.Shared.Contracts.Suppliers.Supplier>(supplier),
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
                TeamId = sharedTeamId
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
                TeamId = sharedTeamId
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
        public SupplierTeamDetails Team { get; set; }
        public SupplierStatus Status { get; set; }
        public bool IsPrimarySupplier { get; set; }
        public bool ProvidesMutualAid { get; set; }
    }

    public class Supplier
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string LegalName { get; set; }
        public string GSTNumber { get; set; }
        public Address Address { get; set; } = null!;
        public SupplierContact Contact { get; set; } = null!;
        public SupplierTeamDetails? Team { get; set; }
        public IEnumerable<SupplierTeamDetails> SharedWithTeams { get; set; } = Array.Empty<SupplierTeamDetails>();
        public SupplierStatus Status { get; set; }
    }

    public class SupplierTeamDetails
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public DateTime SharedWithDate { get; set; }
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

    public class SuppliersMapping : Profile
    {
        public SuppliersMapping()
        {
            CreateMap<ESS.Shared.Contracts.Suppliers.Supplier, SupplierListItem>()
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.Status == ESS.Shared.Contracts.Suppliers.SupplierStatus.Active ? SupplierStatus.Active : SupplierStatus.Deactivated))
                .ForMember(d => d.IsPrimarySupplier, opts => opts.MapFrom((s, dst, arg, context) => context.Options.Items.ContainsKey("UserTeamId") && s.Team != null ? context.Options.Items["UserTeamId"].Equals(s.Team.Id) : false))
                .ForMember(d => d.ProvidesMutualAid, opts => opts.MapFrom((s, dst, arg, context) => context.Options.Items.ContainsKey("UserTeamId") && s.Team != null ? context.Options.Items["UserTeamId"].Equals(s.Team.Id) && s.SharedWithTeams.Count() > 0 : false))
                ;

            CreateMap<ESS.Shared.Contracts.Suppliers.Supplier, Supplier>()
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.Status == ESS.Shared.Contracts.Suppliers.SupplierStatus.Active ? SupplierStatus.Active : SupplierStatus.Deactivated))
                ;

            CreateMap<Supplier, ESS.Shared.Contracts.Suppliers.Supplier>()
                .ForMember(d => d.Verified, opts => opts.Ignore())
                ;

            CreateMap<ESS.Shared.Contracts.Suppliers.Team, SupplierTeamDetails>()
                .ForMember(d => d.IsActive, opts => opts.Ignore())
                ;

            CreateMap<SupplierTeamDetails, ESS.Shared.Contracts.Suppliers.Team>()
                ;

            CreateMap<ESS.Shared.Contracts.Suppliers.Address, Address>()
                .ForMember(d => d.CommunityCode, opts => opts.MapFrom(s => s.Community))
                .ForMember(d => d.StateProvinceCode, opts => opts.MapFrom(s => s.StateProvince))
                .ForMember(d => d.CountryCode, opts => opts.MapFrom(s => s.Country))
                ;

            CreateMap<Address, ESS.Shared.Contracts.Suppliers.Address>()
                .ForMember(d => d.Community, opts => opts.MapFrom(s => s.CommunityCode))
                .ForMember(d => d.StateProvince, opts => opts.MapFrom(s => s.StateProvinceCode))
                .ForMember(d => d.Country, opts => opts.MapFrom(s => s.CountryCode))
                ;

            CreateMap<ESS.Shared.Contracts.Suppliers.SupplierContact, SupplierContact>()
                ;

            CreateMap<SupplierContact, ESS.Shared.Contracts.Suppliers.SupplierContact>()
                .ForMember(d => d.Id, opts => opts.Ignore())
                ;
        }
    }
}
