using EMBC.ESS.Utilities.Dynamics;
using EMBC.ESS.Utilities.Dynamics.Microsoft.Dynamics.CRM;

namespace EMBC.ESS.Resources.Metadata
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<era_jurisdiction, Community>()
                .ForMember(j => j.Code, opts => opts.MapFrom(o => o.era_jurisdictionid))
                .ForMember(j => j.Name, opts => opts.MapFrom(o => o.era_jurisdictionname))
                .ForMember(j => j.CountryCode, opts => opts.MapFrom(o => o.era_RelatedProvinceState == null
                    ? null
                    : o.era_RelatedProvinceState.era_RelatedCountry == null
                        ? null
                        : o.era_RelatedProvinceState.era_RelatedCountry.era_countrycode))
                .ForMember(j => j.StateProvinceCode, opts => opts.MapFrom(o => o.era_RelatedProvinceState == null
                        ? null
                        : o.era_RelatedProvinceState.era_code))
                .ForMember(j => j.Type, opts => opts.MapFrom(o => o.era_type.HasValue ? (CommunityType)o.era_type : CommunityType.Undefined))
                .ForMember(j => j.DistrictCode, opts => opts.MapFrom(o => o.era_RegionalDistrict.era_regionaldistrictid.ToString()))
                .ForMember(j => j.DistrictName, opts => opts.MapFrom(o => o.era_RegionalDistrict.era_districtname))
                .ForMember(j => j.IsActive, opts => opts.MapFrom(o => o.statecode == (int)EntityState.Active))
                .ReverseMap()
                ;

            CreateMap<era_provinceterritories, StateProvince>()
                .ForMember(j => j.Code, opts => opts.MapFrom(o => o.era_code))
                .ForMember(j => j.Name, opts => opts.MapFrom(o => o.era_name))
                .ForMember(j => j.CountryCode, opts => opts.MapFrom(o => o.era_RelatedCountry == null
                    ? null
                    : o.era_RelatedCountry.era_countrycode))
                .ForMember(j => j.IsActive, opts => opts.MapFrom(o => o.statecode == (int)EntityState.Active))
                .ReverseMap()
                ;

            CreateMap<era_country, Country>()
                .ForMember(j => j.Code, opts => opts.MapFrom(o => o.era_countrycode))
                .ForMember(j => j.Name, opts => opts.MapFrom(o => o.era_name))
                .ForMember(j => j.IsActive, opts => opts.MapFrom(o => o.statecode == (int)EntityState.Active))
                .ReverseMap()
                ;

            CreateMap<era_portalbanner, OutageInformation>()
                .ForMember(d => d.OutageStartDate, opts => opts.MapFrom(s => s.era_outagestartdate.Value.UtcDateTime))
                .ForMember(d => d.OutageEndDate, opts => opts.MapFrom(s => s.era_enddisplaydate.Value.UtcDateTime))
                .ForMember(d => d.Content, opts => opts.MapFrom(s => s.era_content))
                ;
        }
    }
}
