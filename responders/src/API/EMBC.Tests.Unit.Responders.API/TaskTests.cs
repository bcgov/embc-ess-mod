using System;
using AutoMapper;
using EMBC.ESS.Shared.Contracts.Events;
using EMBC.Responders.API.Controllers;
using Shouldly;
using Xunit;

namespace EMBC.Tests.Unit.Responders.API
{
    public class TaskTests
    {
        private readonly MapperConfiguration mapperConfig;
        private IMapper mapper => mapperConfig.CreateMapper();

        public TaskTests()
        {
            mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(TasksController));
            });
        }

        [Fact]
        public void Map_ActiveTask_PaperAndDigitalWorkflowsEnabled()
        {
            var task = new IncidentTask
            {
                StartDate = DateTime.Now,
                EndDate = DateTime.Now.AddDays(3),
                Description = "test",
                Id = "1234",
                Status = IncidentTaskStatus.Active
            };

            var mappedTask = mapper.Map<ESSTask>(task);

            mappedTask.Workflows.ShouldContain(t => t.Name == "digital-processing" && t.Enabled == true);
            mappedTask.Workflows.ShouldContain(t => t.Name == "paper-data-entry" && t.Enabled == true);
            mappedTask.Workflows.ShouldContain(t => t.Name == "remote-extensions" && t.Enabled == false);
        }

        [Fact]
        public void Map_ExpiredTask_DigitalWorkflowDisabledAndPaperWorkflowEnabled()
        {
            var task = new IncidentTask
            {
                StartDate = DateTime.Now.AddDays(-5),
                EndDate = DateTime.Now.AddDays(-2),
                Description = "test",
                Id = "1234",
                Status = IncidentTaskStatus.Expired
            };

            var mappedTask = mapper.Map<ESSTask>(task);

            mappedTask.Workflows.ShouldContain(t => t.Name == "digital-processing" && t.Enabled == false);
            mappedTask.Workflows.ShouldContain(t => t.Name == "paper-data-entry" && t.Enabled == true);
            mappedTask.Workflows.ShouldContain(t => t.Name == "remote-extensions" && t.Enabled == false);
        }
    }
}
