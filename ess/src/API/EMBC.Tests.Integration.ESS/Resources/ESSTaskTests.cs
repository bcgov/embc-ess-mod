using System;
using System.Linq;
using System.Threading.Tasks;
using EMBC.ESS;
using EMBC.ESS.Resources.Contacts;
using EMBC.ESS.Resources.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;
using Xunit;
using Xunit.Abstractions;

namespace EMBC.Tests.Integration.ESS.Resources
{
    public class ESSTaskTests : WebAppTestBase
    {
        private readonly ITaskRepository taskRepository;

        // Constants
        private const string ActiveTaskId = "UNIT-TEST-ACTIVE-TASK";
        private const string ExpiredTaskId = "UNIT-TEST-EXPIRED-TASK";
        private const string NonExistentTaskId = "XXXXXXX";

        public ESSTaskTests(ITestOutputHelper output, WebApplicationFactory<Startup> webApplicationFactory) : base(output, webApplicationFactory)
        {
            taskRepository = services.GetRequiredService<ITaskRepository>();
        }

        [Fact(Skip = RequiresDynamics)]
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

        [Fact(Skip = RequiresDynamics)]
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
