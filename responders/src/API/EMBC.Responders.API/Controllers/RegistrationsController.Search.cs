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
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Submissions;
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

    public class RegistrantProfileSearchResult
    {
        public string Id { get; set; }
        public bool IsRestricted { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public RegistrantStatus Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public Address PrimaryAddress { get; set; }
        public IEnumerable<EvacuationFileSearchResult> EvacuationFiles { get; set; }
    }

    public class EvacuationFileSearchResult
    {
        public string Id { get; set; }
        public bool IsRestricted { get; set; }
        public string TaskId { get; set; }
        public Address EvacuatedFrom { get; set; }
        public DateTime CreatedOn { get; set; }
        public EvacuationFileStatus Status { get; set; }
        public IEnumerable<EvacuationFileHouseholdMember> HouseholdMembers { get; set; }
    }

    public class EvacuationSearchMapping : Profile
    {
        public EvacuationSearchMapping()
        {
            CreateMap<EvacuationFile, EvacuationFileSearchResult>()
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.Status))
                .ForMember(d => d.HouseholdMembers, opts => opts.MapFrom(s => s.NeedsAssessments.First().HouseholdMembers))
                .ForMember(d => d.EvacuatedFrom, opts => opts.MapFrom(s => s.EvacuatedFromAddress))
                ;

            Func<string, bool> isGuid = s => Guid.TryParse(s, out var _);
            CreateMap<ESS.Shared.Contracts.Submissions.Address, Controllers.Address>()
                .ForMember(d => d.City, opts => opts.MapFrom(s => isGuid(s.Community) ? null : s.Community))
                .ForMember(d => d.CommunityCode, opts => opts.MapFrom(s => !isGuid(s.Community) ? null : s.Community))
                .ForMember(d => d.StateProvinceCode, opts => opts.MapFrom(s => s.StateProvince))
                .ForMember(d => d.CountryCode, opts => opts.MapFrom(s => s.Country))
                ;

            CreateMap<RegistrantWithFiles, RegistrantProfileSearchResult>()
                .IncludeMembers(s => s.RegistrantProfile)
                .ForMember(d => d.EvacuationFiles, opts => opts.MapFrom(s => s.Files))
                ;

            CreateMap<ESS.Shared.Contracts.Submissions.RegistrantProfile, RegistrantProfileSearchResult>()
                .ForMember(d => d.IsRestricted, opts => opts.MapFrom(s => s.RestrictedAccess))
                .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => DateTime.Now))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => RegistrantStatus.NotVerified))
                .ForMember(d => d.EvacuationFiles, opts => opts.Ignore())
                ;

            CreateMap<HouseholdMember, EvacuationFileHouseholdMember>()
                .ForMember(d => d.Type, opts => opts.MapFrom(s => s.IsPrimaryRegistrant ? HouseholdMemberType.MainApplicant : HouseholdMemberType.HouseholdMember))
                .ForMember(d => d.IsMatch, opts => opts.Ignore())
                ;
        }
    }
}
