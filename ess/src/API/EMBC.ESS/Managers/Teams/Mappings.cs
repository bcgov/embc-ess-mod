using AutoMapper;

namespace EMBC.ESS.Managers.Teams
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Shared.Contracts.Teams.TeamMember, Resources.Teams.TeamMember>()
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Teams.Team, Resources.Teams.Team>()
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Teams.AssignedCommunity, Resources.Teams.AssignedCommunity>()
                .ReverseMap()
                ;

            CreateMap<Resources.Teams.TeamMember, Shared.Contracts.Teams.UserProfile>()
                .ForMember(d => d.LastLoginDate, opts => opts.MapFrom(s => s.LastSuccessfulLogin))
                .ForMember(d => d.RequiredToSignAgreement, opts => opts.MapFrom(s => !s.AgreementSignDate.HasValue))
                ;

            CreateMap<Resources.Suppliers.Supplier, Shared.Contracts.Teams.Supplier>()
                ;

            CreateMap<Shared.Contracts.Teams.Supplier, Resources.Suppliers.Supplier>()
                ;

            CreateMap<Resources.Suppliers.SupplierContact, Shared.Contracts.Teams.SupplierContact>()
                ;

            CreateMap<Shared.Contracts.Teams.SupplierContact, Resources.Suppliers.SupplierContact>()
                ;

            CreateMap<Resources.Suppliers.Team, Shared.Contracts.Teams.SupplierTeam>()
                ;

            CreateMap<Shared.Contracts.Teams.SupplierTeam, Resources.Suppliers.Team>()
                ;

            CreateMap<Resources.Suppliers.Address, Shared.Contracts.Teams.Address>()
                ;

            CreateMap<Shared.Contracts.Teams.Address, Resources.Suppliers.Address>()
                ;

            CreateMap<Shared.Contracts.Teams.MutualAid, Resources.Suppliers.MutualAid>()
                 ;

            CreateMap<Resources.Suppliers.MutualAid, Shared.Contracts.Teams.MutualAid>()
                 ;
        }
    }
}
