using System;
using System.Collections.Generic;

namespace EMBC.ESS.Shared.Contracts.Metadata;

public record CountriesQuery : Query<CountriesQueryResponse>
{
}

public record CountriesQueryResponse
{
    public IEnumerable<Country> Items { get; set; }
}

public record Country
{
    public string Code { get; set; }
    public string Name { get; set; }
    public bool IsActive { get; set; }
}

public record StateProvincesQuery : Query<StateProvincesQueryResponse>
{
    public string CountryCode { get; set; }
}

public record StateProvincesQueryResponse
{
    public IEnumerable<StateProvince> Items { get; set; }
}

public record StateProvince
{
    public string Code { get; set; }
    public string Name { get; set; }
    public string CountryCode { get; set; }
    public bool IsActive { get; set; }
}

public record CommunitiesQuery : Query<CommunitiesQueryResponse>
{
    public string CountryCode { get; set; }
    public string StateProvinceCode { get; set; }
    public IEnumerable<CommunityType> Types { get; set; }
}

public record CommunitiesQueryResponse
{
    public IEnumerable<Community> Items { get; set; }
}

public record Community
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

public record SecurityQuestionsQuery : Query<SecurityQuestionsQueryResponse> { }

public record SecurityQuestionsQueryResponse
{
    public IEnumerable<string> Items { get; set; }
}

public record AuditAccessReasonsQuery : Query<AuditAccessReasonsQueryResponse> { }

public record AuditAccessReasonsQueryResponse
{
    public IReadOnlyDictionary<int, string> Items { get; set; }
}

public record SecurityQuestions
{
    public string Question { get; set; }
}

public record OutageQuery : Query<OutageQueryResponse>
{
    public PortalType PortalType { get; set; }
}

public enum PortalType
{
    Registrants,
    Responders,
    Suppliers
}

public record OutageQueryResponse
{
    public OutageInformation OutageInfo { get; set; }
}

public record OutageInformation
{
    public string Content { get; set; }
    public DateTime? OutageStartDate { get; set; }
    public DateTime? OutageEndDate { get; set; }
}
