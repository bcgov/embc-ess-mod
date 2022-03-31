using AutoMapper;

namespace EMBC.ESS.Managers.Teams
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Shared.Contracts.Team.TeamMember, Resources.Teams.TeamMember>()
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Team.Team, Resources.Teams.Team>()
                .ReverseMap()
                ;

            CreateMap<Shared.Contracts.Team.AssignedCommunity, Resources.Teams.AssignedCommunity>()
                .ReverseMap()
                ;

            CreateMap<Resources.Teams.TeamMember, Shared.Contracts.Profile.UserProfile>()
                .ForMember(d => d.LastLoginDate, opts => opts.MapFrom(s => s.LastSuccessfulLogin))
                .ForMember(d => d.RequiredToSignAgreement, opts => opts.MapFrom(s => !s.AgreementSignDate.HasValue))
                ;

            CreateMap<Resources.Suppliers.Supplier, Shared.Contracts.Suppliers.Supplier>()
                ;

            CreateMap<Shared.Contracts.Suppliers.Supplier, Resources.Suppliers.Supplier>()
                ;

            CreateMap<Resources.Suppliers.SupplierContact, Shared.Contracts.Suppliers.SupplierContact>()
                ;

            CreateMap<Shared.Contracts.Suppliers.SupplierContact, Resources.Suppliers.SupplierContact>()
                ;

            CreateMap<Resources.Suppliers.Team, Shared.Contracts.Suppliers.Team>()
                ;

            CreateMap<Shared.Contracts.Suppliers.Team, Resources.Suppliers.Team>()
                ;

            CreateMap<Resources.Suppliers.Address, Shared.Contracts.Suppliers.Address>()
                ;

            CreateMap<Shared.Contracts.Suppliers.Address, Resources.Suppliers.Address>()
                ;
        }
    }
}
