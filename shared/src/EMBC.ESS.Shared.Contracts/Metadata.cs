using System;
using System.Collections.Generic;

namespace EMBC.ESS.Shared.Contracts.Metadata
{
    public class CountriesQuery : Query<CountriesQueryResponse>
    {
    }

    public class CountriesQueryResponse
    {
        public IEnumerable<Country> Items { get; set; }
    }

    public class Country
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }

    public class StateProvincesQuery : Query<StateProvincesQueryResponse>
    {
        public string CountryCode { get; set; }
    }

    public class StateProvincesQueryResponse
    {
        public IEnumerable<StateProvince> Items { get; set; }
    }

    public class StateProvince
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string CountryCode { get; set; }
        public bool IsActive { get; set; }
    }

    public class CommunitiesQuery : Query<CommunitiesQueryResponse>
    {
        public string CountryCode { get; set; }
        public string StateProvinceCode { get; set; }
        public IEnumerable<CommunityType> Types { get; set; }
    }

    public class CommunitiesQueryResponse
    {
        public IEnumerable<Community> Items { get; set; }
    }

    public class Community
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string DistrictCode { get; set; }
        public string DistrictName { get; set; }
        public CommunityType Type { get; set; }
        public string StateProvinceCode { get; set; }
        public string CountryCode { get; set; }
        public bool IsActive { get; set; }
    }

    public enum CommunityType
    {
        Undefined,
        City,
        Village,
        Town,
        ResortMunicipality,
        UrbanCommunity,
        FirstNationsCommunity,
        IndianReserve,
        Community,
        DistrictMunicipality,
        IndianGovernmentDistrict,
    }

    public class SecurityQuestionsQuery : Query<SecurityQuestionsQueryResponse>
    {
    }

    public class SecurityQuestionsQueryResponse
    {
        public IEnumerable<string> Items { get; set; }
    }

    public class SecurityQuestions
    {
        public string Question { get; set; }
    }

    public class OutageQuery : Query<OutageQueryResponse>
    {
        public PortalType PortalType { get; set; }
    }

    public enum PortalType
    {
        Registrants,
        Responders,
        Suppliers
    }

    public class OutageQueryResponse
    {
        public OutageInformation OutageInfo { get; set; }
    }

    public class OutageInformation
    {
        public string Content { get; set; }
        public DateTime? OutageStartDate { get; set; }
        public DateTime? OutageEndDate { get; set; }
    }
}
