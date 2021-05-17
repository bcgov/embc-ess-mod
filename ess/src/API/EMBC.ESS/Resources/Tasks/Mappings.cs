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
            //CreateMap<EssTask, era_task>()
            //    .ForMember(d => d.era_name, opts => opts.MapFrom(s => s.Id))
            //    .ForMember(d => d.era_taskdetails, opts => opts.MapFrom(s => s.Description))
            //    .ForMember(d => d.era_taskstatus, opts => opts.MapFrom(s => s.Status))
            //    //.ForMember(d => d.era_JurisdictionID.era_jurisdictionid, opts => opts.MapFrom(s => s.CommunityCode))
            //    .ForMember(d => d.era_taskstartdate, opts => opts.MapFrom(s => s.From))
            //    .ForMember(d => d.era_taskenddate, opts => opts.MapFrom(s => s.To))
            //    ;

            CreateMap<era_task, EssTask>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_name))
                .ForMember(d => d.Description, opts => opts.MapFrom(s => s.era_taskdetails))
                .ForMember(d => d.Status, opts => opts.MapFrom(s => Enum.GetName(typeof(EssTaskStatusCode), s.statuscode)))
                .ForMember(d => d.CommunityCode, opts => opts.MapFrom(s => s.era_JurisdictionID.era_jurisdictionid))
                .ForMember(d => d.From, opts => opts.MapFrom(s => s.era_taskstartdate.HasValue ? s.era_taskstartdate.Value.DateTime : (DateTime?)null))
                .ForMember(d => d.To, opts => opts.MapFrom(s => s.era_taskenddate.HasValue ? s.era_taskenddate.Value.DateTime : (DateTime?)null))
                ;
        }
    }

    public enum EssTaskStatusCode
    {
        Active = 1,
        Expired = 2,
    }
}
