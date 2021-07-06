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
using System.Security.Claims;
using System.Threading.Tasks;
using EMBC.Responders.API.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMBC.Responders.API.Controllers
{
    /// <summary>
    /// Handles registration search
    /// </summary>
    public partial class RegistrationsController
    {
        /// <summary>
        /// Search evacuation files and profiles matching the search parameters
        /// </summary>
        /// <param name="searchParameters">search parameters to filter the results</param>
        /// <returns>matching files list and registrants list</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<SearchResults>> Search([FromQuery] SearchParameters searchParameters)
        {
            var userRole = Enum.Parse<MemberRole>(User.FindFirstValue("user_role"));
            var searchResults = await evacuationSearchService.Search(searchParameters.firstName, searchParameters.lastName, searchParameters.dateOfBirth, userRole);

            return Ok(searchResults);
        }
    }

    public class SearchParameters
    {
        [Required]
        public string firstName { get; set; }

        [Required]
        public string lastName { get; set; }

        [Required]
        public string dateOfBirth { get; set; }
    }

    public class SearchResults
    {
        public IEnumerable<RegistrantProfileSearchResult> Registrants { get; set; }
        public IEnumerable<EvacuationFileSearchResult> Files { get; set; }
    }
}
