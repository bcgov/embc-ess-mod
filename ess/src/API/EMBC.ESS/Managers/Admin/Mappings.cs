using AutoMapper;
using EMBC.ESS.Resources.Metadata;

namespace EMBC.ESS.Managers.Admin
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Shared.Contracts.Metadata.Country, Country>().ReverseMap();
            CreateMap<Shared.Contracts.Metadata.StateProvince, StateProvince>().ReverseMap();
            CreateMap<Shared.Contracts.Metadata.Community, Community>()
                .ForMember(c => c.DistrictCode, opts => opts.Ignore())
                .ReverseMap();
            CreateMap<OutageInformation, Shared.Contracts.Metadata.OutageInformation>();
        }
    }
}
