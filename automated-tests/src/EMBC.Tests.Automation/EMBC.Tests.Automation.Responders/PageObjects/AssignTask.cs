using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.PageObjects
{
    public class AssignTask : PageObjectBase
    {
        public AssignTask(IWebDriver webDriver) : base(webDriver)
        { }

        public void SignInTaskButton()
        {
            this.ButtonElement("Sign in to the Task #");
        }

        public void EnterTaskNumber(string taskName)
        {
            Wait();

            var taskNumberField = webDriver.FindElement(By.CssSelector("input[formcontrolname='taskNumber']"));
            taskNumberField.SendKeys(taskName);

            this.ButtonElement("Submit");
        }

        public void SignInTask()
        {
            this.ButtonElement("Sign in to Task");
        }
    }
}
