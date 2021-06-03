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
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Tasks
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<era_task, EssTask>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_name))
                .ForMember(d => d.Description, opts => opts.MapFrom(s => s.era_taskdetails))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => s.statuscode))
                .ForMember(d => d.CommunityCode, opts => opts.MapFrom(s => s.era_JurisdictionID.era_jurisdictionid))
                .ForMember(d => d.StartDate, opts => opts.MapFrom(s => s.era_taskstartdate.HasValue ? s.era_taskstartdate.Value.DateTime : (DateTime?)null))
                .ForMember(d => d.EndDate, opts => opts.MapFrom(s => s.era_taskenddate.HasValue ? s.era_taskenddate.Value.DateTime : (DateTime?)null))
                ;
        }
    }

    public enum EssTaskStatusCode
    {
        Active = 1,
        Expired = 2,
    }
}
