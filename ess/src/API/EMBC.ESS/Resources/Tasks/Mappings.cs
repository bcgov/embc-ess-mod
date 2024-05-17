using System;
using System.Linq;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Tasks;

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
            .ForMember(d => d.RemoteExtensionsEnabled, opts => opts.MapFrom(s => s.era_remoteextensiontoggle))
            .ForMember(d => d.SelfServeEnabled, opts => opts.MapFrom(s => s.era_selfservetoggle))
            .ForMember(d => d.AutoApprovedEnabled, opts => opts.Ignore())
            .ForMember(d => d.EnabledSupports, opts => opts.MapFrom(s => s.era_era_task_era_selfservesupportlimits_Task.Where(sl => sl.statuscode == 1)))
            ;

        CreateMap<era_selfservesupportlimits, SupportConfiguration>()
            .ForMember(d => d.SupportType, opts => opts.MapFrom(s => s.era_supporttypeoption))
            ;
    }
}
