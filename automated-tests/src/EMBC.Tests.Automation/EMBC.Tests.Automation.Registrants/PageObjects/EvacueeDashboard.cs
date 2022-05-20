using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Registrants.PageObjects
{
    public class EvacueeDashboard : PageObjectBase
    {

        public EvacueeDashboard(IWebDriver webDriver) : base(webDriver)
        { }

        public void CreateNewEvent()
        {
            ButtonElement("Add Another Event");
            ButtonElement("Yes, Continue");
        }
    }
}
