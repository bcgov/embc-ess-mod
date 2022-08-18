using System.Linq;
using EMBC.ESS.Resources.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class TaskTests : DynamicsWebAppTestBase
    {
        private readonly ITaskRepository taskRepository;

        // Constants
        private string ActiveTaskId => TestData.ActiveTaskId;

        private string ExpiredTaskId => TestData.InactiveTaskId;
        private const string NonExistentTaskId = "XXXXXXX";

        public TaskTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
        {
            taskRepository = Services.GetRequiredService<ITaskRepository>();
        }

        [Fact]
        public async System.Threading.Tasks.Task CanGetActiveTask()
        {
            // Active Task
            var activeTaskQuery = new TaskQuery
            {
                ById = ActiveTaskId
            };
            var queryResult = await taskRepository.QueryTask(activeTaskQuery);
            queryResult.Items.ShouldNotBeEmpty();
            var esstask = (EssTask)queryResult.Items.First();
            esstask.ShouldNotBeNull();
            esstask.Id.ShouldNotBeNull();
        }

        [Fact]
        public async System.Threading.Tasks.Task CanGetExpiredTask()
        {
            // Expired Task
            var expiredTaskQuery = new TaskQuery
            {
                ById = ExpiredTaskId
            };
            var queryResult2 = await taskRepository.QueryTask(expiredTaskQuery);
            queryResult2.Items.ShouldNotBeEmpty();
            var esstask2 = (EssTask)queryResult2.Items.First();
            esstask2.ShouldNotBeNull();
            esstask2.Id.ShouldNotBeNull();

            // Non Existent Task
            var nonExistentTaskQuery = new TaskQuery
            {
                ById = NonExistentTaskId
            };
            var queryResult3 = await taskRepository.QueryTask(nonExistentTaskQuery);
            queryResult3.Items.ShouldBeEmpty();
        }
    }
}
