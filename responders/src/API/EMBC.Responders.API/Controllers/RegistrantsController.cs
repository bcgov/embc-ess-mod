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
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class RegistrantsController : ControllerBase
    {
        [HttpGet("search")]
        public async Task<IEnumerable<RegistrantProfile>> Get([FromQuery] RegistrantQuery query)
        {
            var registrant1 = new RegistrantProfile
            {
                FirstName = query.FirstName,
                LastName = query.LastName,
                CreatedOn = new DateTime(2021, 1, 1),
                Status = RegistrantStatus.Verified,
                PrimaryAddress = new Address { AddressLine1 = "1 line1", AddressLine2 = "1 line2", City = "1 city", PostalCode = "V1V 1V1" },
                EvacuationFiles = new[]
                {
                    new EvacuationFile { Id = "1234", TaskId = "t1234", CreatedOn = new DateTime(2021, 1, 1), Status = EvacuationFileStatus.Active, EvacuatedFrom = "city1" },
                    new EvacuationFile { Id = "9999", TaskId = "t9999", CreatedOn = new DateTime(2020, 1, 1), Status = EvacuationFileStatus.Completed, EvacuatedFrom = "city2" }
                }
            };
            var registrant2 = new RegistrantProfile
            {
                FirstName = query.FirstName,
                LastName = query.LastName,
                CreatedOn = new DateTime(2020, 12, 31),
                Status = RegistrantStatus.NotVerified,
                PrimaryAddress = new Address { AddressLine1 = "2 line1", AddressLine2 = "2 line2", City = "2 city", PostalCode = "V2V 2V2" },
                EvacuationFiles = new[]
                {
                    new EvacuationFile { Id = "1111", TaskId = null, CreatedOn = new DateTime(2020, 12, 31), Status = EvacuationFileStatus.InProgress, EvacuatedFrom = "city3" },
                    new EvacuationFile { Id = "2222", TaskId = "t2222", CreatedOn = new DateTime(2020, 12, 30), Status = EvacuationFileStatus.Expired, EvacuatedFrom = "city4" }
                }
            };
            var result = new[] { registrant1, registrant2 };
            return await Task.FromResult(result);
        }
    }

    public class RegistrantQuery
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string DateOfBirth { get; set; }
    }

    public class RegistrantProfile
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public RegistrantStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public Address PrimaryAddress { get; set; }
        public IEnumerable<EvacuationFile> EvacuationFiles { get; set; }
    }

    public class EvacuationFile
    {
        public string Id { get; set; }
        public string TaskId { get; set; }
        public string EvacuatedFrom { get; set; }
        public DateTime CreatedOn { get; set; }
        public EvacuationFileStatus Status { get; set; }
    }

    public enum RegistrantStatus
    {
        Verified,
        NotVerified
    }

    public enum EvacuationFileStatus
    {
        InProgress,
        Active,
        Expired,
        Completed
    }
}
