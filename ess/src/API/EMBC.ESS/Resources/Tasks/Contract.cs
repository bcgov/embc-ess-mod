using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMBC.ESS.Resources.Tasks
{
    public interface ITaskRepository
    {
        Task<TaskQueryResult> QueryTask(TaskQuery query);
    }

    public class TaskQuery
    {
        public string ById { get; set; }
        public IEnumerable<TaskStatus> ByStatus { get; set; } = Array.Empty<TaskStatus>();
    }

    public class TaskQueryResult
    {
        public IEnumerable<Task> Items { get; set; }
    }

    public abstract class Task
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

    public class EssTask : Task
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string CommunityCode { get; set; }
        public string Description { get; set; }
        public bool AutoApprovedEnabled { get; set; }
        public bool RemoteExtensionsEnabled { get; set; }
    }
}
