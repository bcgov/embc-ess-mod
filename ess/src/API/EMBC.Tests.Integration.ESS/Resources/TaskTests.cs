using EMBC.ESS.Resources.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace EMBC.Tests.Integration.ESS.Resources;

public class TaskTests : DynamicsWebAppTestBase
{
    private readonly ITaskRepository taskRepository;

    public TaskTests(ITestOutputHelper output, DynamicsWebAppFixture fixture) : base(output, fixture)
    {
        taskRepository = Services.GetRequiredService<ITaskRepository>();
    }

    [Fact]
    public async System.Threading.Tasks.Task CanGetActiveTask()
    {
        var query = new TaskQuery
        {
            ById = TestData.ActiveTaskId
        };
        var task = (await taskRepository.QueryTask(query)).Items.ShouldHaveSingleItem().ShouldBeOfType<EssTask>();
        task.Id.ShouldBe(TestData.ActiveTaskId);
        task.Status.ShouldBe(EMBC.ESS.Resources.Tasks.TaskStatus.Active);
        task.EnabledSupports.ShouldBeEmpty();
    }

    [Fact]
    public async System.Threading.Tasks.Task CanGetExpiredTask()
    {
        var query = new TaskQuery
        {
            ById = TestData.InactiveTaskId
        };
        var task = (await taskRepository.QueryTask(query)).Items.ShouldHaveSingleItem().ShouldBeOfType<EssTask>();
        task.Id.ShouldBe(TestData.InactiveTaskId);
        task.Status.ShouldBe(EMBC.ESS.Resources.Tasks.TaskStatus.Expired);
        task.EnabledSupports.ShouldBeEmpty();
    }

    [Fact]
    public async System.Threading.Tasks.Task CanGetTaskWithSelfServeSupports()
    {
        var query = new TaskQuery
        {
            ById = TestData.SelfServeActiveTaskId
        };
        var task = (await taskRepository.QueryTask(query)).Items.ShouldHaveSingleItem().ShouldBeOfType<EssTask>();
        task.Id.ShouldBe(TestData.SelfServeActiveTaskId);
        task.Status.ShouldBe(EMBC.ESS.Resources.Tasks.TaskStatus.Active);
        task.EnabledSupports.ShouldNotBeEmpty();
    }
}
