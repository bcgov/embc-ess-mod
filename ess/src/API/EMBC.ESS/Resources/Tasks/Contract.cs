using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Tasks;

public interface ITaskRepository
{
    Task<TaskQueryResult> QueryTask(TaskQuery query, CancellationToken ct = default);
}

public record TaskQuery
{
    public string ById { get; set; }
    public IEnumerable<TaskStatus> ByStatus { get; set; } = [];
}

public record TaskQueryResult
{
    public IEnumerable<Task> Items { get; set; }
}

public abstract record Task
{
    public string Id { get; set; }
    public TaskStatus Status { get; set; }
}

#pragma warning disable CA1008 // Enums should have zero value

public enum TaskStatus
{
    Active = 1,
    Expired = 2
}

#pragma warning restore CA1008 // Enums should have zero value

public record EssTask : Task
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string CommunityCode { get; set; }
    public string Description { get; set; }
    public bool AutoApprovedEnabled { get; set; }
    public bool RemoteExtensionsEnabled { get; set; }
    public bool SelfServeEnabled { get; set; }
    public IEnumerable<SupportConfiguration> EnabledSupports { get; set; } = [];
    public IEnumerable<SupportConfiguration> SupportLimits { get; set; } = [];
}

public record SupportConfiguration
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

public enum EssTaskStatusCode
{
    Active = 1,
    Expired = 2,
}
