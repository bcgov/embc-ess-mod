using System.Linq;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Print
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<era_referralprint, ReferralPrintRequest>()
             .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_referralprintid))
             .ForMember(d => d.Title, opts => opts.MapFrom(s => s.era_name))
             .ForMember(d => d.FileId, opts => opts.MapFrom(s => s.era_ESSFileId.era_name))
             .ForMember(d => d.CreatedOn, opts => opts.MapFrom(s => s.createdon.Value.UtcDateTime))
             .ForMember(d => d.Type, opts => opts.MapFrom(s => s.era_type))
             .ForMember(d => d.IncludeSummary, opts => opts.MapFrom(s => s.era_includedsummary))
             .ForMember(d => d.Comments, opts => opts.MapFrom(s => s.era_reprintreason))
             .ForMember(d => d.RequestingUserId, opts => opts.MapFrom(s => s._era_requestinguserid_value))
             .ForMember(d => d.SupportIds, opts => opts.MapFrom(s => s.era_era_referralprint_era_evacueesupport.Select(sp => sp.era_name)))
             .ReverseMap()
             .ForMember(d => d.createdon, opts => opts.Ignore())
             ;
        }
    }
}
