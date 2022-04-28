using System;
using AutoMapper;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Teams
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<era_essteam, Team>()
                .ForMember(d => d.AssignedCommunities, opts => opts.MapFrom(s => s.era_ESSTeam_ESSTeamArea_ESSTeamID))
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_essteamid.ToString()))
                .ForMember(d => d.Name, opts => opts.MapFrom(s => s.era_name))
                ;

            CreateMap<era_essteamarea, AssignedCommunity>()
                .ForMember(d => d.Code, opts => opts.MapFrom(s => s._era_jurisdictionid_value))
                .ForMember(d => d.DateAssigned, opts => opts.MapFrom(s => s.createdon.Value.UtcDateTime))
                ;

            CreateMap<era_essteamuser, TeamMember>()
                .ForMember(d => d.Id, opts => opts.MapFrom(s => s.era_essteamuserid.ToString()))
                .ForMember(d => d.TeamId, opts => opts.MapFrom(s => s.era_ESSTeamId.era_essteamid.Value.ToString()))
                .ForMember(d => d.TeamName, opts => opts.MapFrom(s => s.era_ESSTeamId.era_name))
                .ForMember(d => d.FirstName, opts => opts.MapFrom(s => s.era_firstname))
                .ForMember(d => d.LastName, opts => opts.MapFrom(s => s.era_lastname))
                .ForMember(d => d.UserName, opts => opts.MapFrom(s => s.era_externalsystemusername))
                .ForMember(d => d.ExternalUserId, opts => opts.MapFrom(s => s.era_externalsystemuser))
                .ForMember(d => d.Email, opts => opts.MapFrom(s => s.era_email))
                .ForMember(d => d.Phone, opts => opts.MapFrom(s => s.era_phone))
                .ForMember(d => d.Role, opts => opts.MapFrom(s => Enum.GetName(typeof(TeamUserRoleOptionSet), s.era_role)))
                .ForMember(d => d.Label, opts => opts.MapFrom(s => Enum.GetName(typeof(TeamUserLabelOptionSet), s.era_label)))
                .ForMember(d => d.LastSuccessfulLogin, opts => opts.MapFrom(s => s.era_lastsuccessfullogin.HasValue ? s.era_lastsuccessfullogin.Value.UtcDateTime : (DateTime?)null))
                .ForMember(d => d.AgreementSignDate, opts => opts.MapFrom(s => s.era_electronicaccessagreementaccepteddate.HasValue ?
                    new DateTime(s.era_electronicaccessagreementaccepteddate.Value.Year, s.era_electronicaccessagreementaccepteddate.Value.Month, s.era_electronicaccessagreementaccepteddate.Value.Day, 0, 0, 0, 0, DateTimeKind.Utc)
                    : (DateTime?)null))
                .ForMember(d => d.IsActive, opts => opts.MapFrom(s => s.statuscode == (int)TeamMemberStatus.Active))
                ;

            CreateMap<TeamMember, era_essteamuser>(MemberList.None)
                .ForMember(d => d.era_essteamuserid, opts => opts.MapFrom(s => s.Id))
                .ForMember(d => d.era_firstname, opts => opts.MapFrom(s => s.FirstName))
                .ForMember(d => d.era_lastname, opts => opts.MapFrom(s => s.LastName))
                .ForMember(d => d.era_email, opts => opts.MapFrom(s => s.Email))
                .ForMember(d => d.era_phone, opts => opts.MapFrom(s => s.Phone))
                .ForMember(d => d.era_externalsystemuser, opts => opts.MapFrom(s => s.ExternalUserId))
                .ForMember(d => d.era_externalsystemtype, opts => opts.MapFrom(s => (int)ExternalSystemOptionSet.Bceid))
                .ForMember(d => d.era_externalsystemusername, opts => opts.MapFrom(s => s.UserName))
                .ForMember(d => d.era_electronicaccessagreementaccepteddate, opts => opts.MapFrom(s => s.AgreementSignDate))
                .ForMember(d => d.era_label, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.Label) ? -1 : (int)Enum.Parse<TeamUserLabelOptionSet>(s.Label)))
                .ForMember(d => d.era_role, opts => opts.MapFrom(s => string.IsNullOrEmpty(s.Role) ? (int?)null : (int)Enum.Parse<TeamUserRoleOptionSet>(s.Role)))
                .ForMember(d => d.era_lastsuccessfullogin, opts => opts.MapFrom(s => s.LastSuccessfulLogin))
                ;
        }
    }

#pragma warning disable CA1008 // Enums should have zero value

    public enum TeamUserRoleOptionSet
    {
        Tier1 = 174360000,
        Tier2 = 174360001,
        Tier3 = 174360002,
        Tier4 = 174360003,
    }

    public enum TeamUserLabelOptionSet
    {
        EMBCEmployee = 174360000,
        Volunteer = 174360001,
        ThirdParty = 174360002,
        ConvergentVolunteer = 174360003,
        FirstNation = 174360004,
        LocalGovernmentEmployee = 174360005,
    }

    public enum ExternalSystemOptionSet
    {
        Bceid = 174360000
    }

    public enum TeamMemberStatus
    {
        Active = 1,
        Inactive = 174360001,
        SoftDelete = 174360000
    }

#pragma warning restore CA1008 // Enums should have zero value
}
