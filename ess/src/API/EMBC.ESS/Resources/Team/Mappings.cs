using AutoMapper;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Team
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<era_essteam, Team>()
                .ForMember(d => d.AssignedCommunitiesIds, opts => opts.Ignore())
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_essteamid.ToString()))
                .ForMember(d => d.Name, opts => opts.MapFrom(s => s.era_name))
                ;

            CreateMap<era_essteamuser, TeamMember>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_essteamuserid.ToString()))
                .ForMember(d => d.TeamId, opts => opts.MapFrom(s => s._era_essteamid_value.ToString()))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.era_firstname))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.era_lastname))
                //TODO: change to username
                .ForMember(d => d.UserName, opts => opts.MapFrom(s => s.era_bceidaccountguid))
                .ForMember(d => d.ExternalUserId, opts => opts.MapFrom(s => s.era_bceidaccountguid))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.era_email))
                .ForMember(d => d.Phone, opts => opts.Ignore())
                .ForMember(d => d.Role, opts => opts.Ignore())
                .ForMember(d => d.Label, opts => opts.Ignore())
                .ForMember(d => d.LastSuccessfulLogin, opts => opts.Ignore())
                .ForMember(d => d.AgreementSignDate, opts => opts.MapFrom(s => s.era_electronicaccessagreementaccepteddate))
                .ForMember(d => d.IsActive, opts => opts.MapFrom(s => s.era_active ?? false))
                ;
        }
    }
}
