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
using EMBC.ESS.Shared.Contracts.Submissions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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
        /// /// <param name="name">name</param>
        /// <returns>list of suppliers</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<SupplierSearchResult>>> SearchSupppliers(string name)
        {
            var suppliers = (await messagingClient.Send(new TeamSuppliersSearchQuery
            {
                TeamId = teamId,
                Name = name
            })).Items;

            return Ok(mapper.Map<IEnumerable<SupplierSearchResult>>(suppliers));
        }

        /// <summary>
        /// Get supplier by id
        /// </summary>
        /// <param name="suppplierId">suppplierId</param>
        /// <returns>supplier</returns>
        [HttpGet("{suppplierId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Supplier>> GetSupplierById(string suppplierId)
        {
            Supplier ret = new Supplier
            {
                Id = suppplierId,
                LegalName = "Test Supplier",
                Name = "Test Supplier",
                GSTNumber = "gst123",
                Address = new Address
                {
                    AddressLine1 = "123 Fake St.",
                    AddressLine2 = string.Empty,
                    City = "Vancouver",
                    StateProvinceCode = "BC",
                    CountryCode = "CAN"
                },
                PrimaryContact = new SupplierContact
                {
                    FirstName = "Mat",
                    LastName = "Cauthon",
                    PhoneNumber = "6043211231",
                    HomeAddress = "321 Test St",
                    Email = "matcauthon@wot.com"
                },
                MutualAid = true,
                Status = SupplierStatus.Active,
            };

            return await Task.FromResult(ret);
        }

        /// <summary>
        /// Update Supplier Status
        /// </summary>
        /// <param name="suppplierId">SuppplierId</param>
        /// <param name="status">Status</param>
        /// <returns>updated supplier id</returns>
        [HttpPost("{suppplierId}/status/{status}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SupplierResult>> SetSupplierStatus(string suppplierId, bool status)
        {
            SupplierResult ret = new SupplierResult
            {
                Id = "123"
            };

            return await Task.FromResult(ret);
        }
    }

    public class SupplierSearchResult
    {
        public string Id { get; set; }
        public string LegalName { get; set; }
        public string Name { get; set; }
        public string SupplierAddress { get; set; }
        public bool MutualAid { get; set; }
        public SupplierStatus Status { get; set; }
    }

    public class Supplier
    {
        public string Id { get; set; }
        public string LegalName { get; set; }
        public string Name { get; set; }
        public string GSTNumber { get; set; }
        public Address Address { get; set; }
        public SupplierContact PrimaryContact { get; set; }
        public bool MutualAid { get; set; }
        public SupplierStatus Status { get; set; }
    }

    public class SupplierContact
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string HomeAddress { get; set; }
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
            CreateMap<TeamSupplier, SupplierSearchResult>()
                .ForMember(d => d.Name, opts => opts.MapFrom(s => s.Supplier.Name))
                .ForMember(d => d.LegalName, opts => opts.MapFrom(s => s.Supplier.LegalName))
                .ForMember(d => d.SupplierAddress, opts => opts.MapFrom(s => s.Supplier.Address.AddressLine1))
                .ForMember(d => d.MutualAid, opts => opts.MapFrom(s => !s.IsPrimarySupplier))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.Active ? SupplierStatus.Active : SupplierStatus.Deactivated))
                ;
        }
    }
}
