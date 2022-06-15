using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.StepDefinitions
{
    [Binding]
    public sealed class TaskSteps
    {
        private readonly AssignTask assignTask;

        public TaskSteps(BrowserDriver driver)
        {
            this.assignTask = new AssignTask(driver.Current);
        }

        [StepDefinition(@"I sign into a task (.*)")]
        public void SignInTask(string taskNbr)
        {
            //click on Sign in to the Task #
            assignTask.CurrentLocation.Should().Be("/responder-access/responder-dashboard");
            assignTask.SignInTaskButton();

            //insert a task number
            assignTask.CurrentLocation.Should().Be("/responder-access/search/task");
            assignTask.EnterTaskNumber(taskNbr);

            //assign a task number
            assignTask.CurrentLocation.Should().Be("/responder-access/search/task-details");
            assignTask.SignInTask();
        }
    }
}
