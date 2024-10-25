using System;
using System.Collections.Generic;

namespace EMBC.ESS.Shared.Contracts.Events
{
    /// <summary>
    /// search suppliers list by task
    /// </summary>
    public class TasksSearchQuery : Query<TasksSearchQueryResult>
    {
        public string TaskId { get; set; }
    }

    public class TasksSearchQueryResult
    {
        public IEnumerable<IncidentTask> Items { get; set; }
    }

    /// <summary>
    /// query the supplier list for a task
    /// </summary>
    public class SuppliersListQuery : Query<SuppliersListQueryResponse>
    {
        public string TaskId { get; set; }
    }

    public class SuppliersListQueryResponse
    {
        public IEnumerable<SupplierDetails> Items { get; set; }
    }

    public class IncidentTask
    {
        public string Id { get; set; } //task number
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string CommunityCode { get; set; }
        public string Description { get; set; }
        public IncidentTaskStatus Status { get; set; }
        public bool RemoteExtensionsEnabled { get; set; }
        public bool SelfServeEnabled { get; set; }
        public IEnumerable<SupportLimits> SupportLimits { get; set; }
    }

    public enum IncidentTaskStatus
    {
        Active,
        Expired
    }

    public record SupportLimits
    {
        public SupportType SupportType { get; set; }
        public DateTime SupportLimitStartDate { get; set; }
        public DateTime SupportLimitEndDate { get; set; }
        public bool ExtensionAvailable { get; set; }
    }

    public enum SupportType
    {
        FoodGroceries = 174360000,
        FoodRestaurant = 174360001,
        ShelterHotel = 174360002,
        ShelterBilleting = 174360003,
        ShelterGroup = 174360004,
        Incidentals = 174360005,
        Clothing = 174360006,
        TransporationTaxi = 174360007,
        TransportationOther = 174360008,
        ShelterAllowance = 174360009
    }
}
