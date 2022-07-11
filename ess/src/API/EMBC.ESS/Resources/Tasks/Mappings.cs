using System;
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
                .ForMember(d => d.StartDate, opts => opts.MapFrom(s => s.era_taskstartdate.HasValue ? s.era_taskstartdate.Value.UtcDateTime : (DateTime?)null))
                .ForMember(d => d.EndDate, opts => opts.MapFrom(s => s.era_taskenddate.HasValue ? s.era_taskenddate.Value.UtcDateTime : (DateTime?)null))
                .ForMember(d => d.AutoApprovedEnabled, opts => opts.MapFrom(s => false))
                .ForMember(d => d.RemoteExtensionsEnabled, opts => opts.MapFrom(s => s.era_remoteextensiontoggle))
                ;
        }
    }

#pragma warning disable CA1008 // Enums should have zero value

    public enum EssTaskStatusCode
    {
        Active = 1,
        Expired = 2,
    }

#pragma warning restore CA1008 // Enums should have zero value
}
