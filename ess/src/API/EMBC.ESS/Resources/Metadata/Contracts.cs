using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Metadata
{
    public interface IMetadataRepository
    {
        Task<IEnumerable<Country>> GetCountries();

        Task<IEnumerable<StateProvince>> GetStateProvinces();

        Task<IEnumerable<Community>> GetCommunities();

        Task<string[]> GetSecurityQuestions();

        Task<IEnumerable<OutageInformation>> GetPlannedOutages(OutageQuery query);
    }

    public class Country
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }

    public class StateProvince
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string CountryCode { get; set; }
        public bool IsActive { get; set; }
    }

    public class Community
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public CommunityType Type { get; set; }
        public string StateProvinceCode { get; set; }
        public string CountryCode { get; set; }
        public string DistrictCode { get; set; }
        public string DistrictName { get; set; }
        public bool IsActive { get; set; }
    }

#pragma warning disable CA1008 // Enums should have zero value

    public enum CommunityType
#pragma warning restore CA1008 // Enums should have zero value
    {
        Undefined = -1,
        City = 1,
        Village = 2,
        Town = 4,
        ResortMunicipality = 5,
        UrbanCommunity = 10,
        FirstNationsCommunity = 12,
        IndianReserve = 13,
        Community = 16,
        DistrictMunicipality = 100000014,
        IndianGovernmentDistrict = 100000015,
    }

    public class OutageQuery
    {
        public DateTime DisplayDate { get; set; }
        public PortalType PortalType { get; set; }
    }

#pragma warning disable CA1008 // Enums should have zero value

    public enum PortalType
    {
        Registrants = 174360000,
        Responders = 174360001,
        Suppliers = 174360002
    }

#pragma warning restore CA1008 // Enums should have zero value

    public class OutageInformation
    {
        public string Content { get; set; }
        public DateTime OutageStartDate { get; set; }
        public DateTime OutageEndDate { get; set; }
    }
}
