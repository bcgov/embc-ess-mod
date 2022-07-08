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
    }

    public enum IncidentTaskStatus
    {
        Active,
        Expired
    }
}
