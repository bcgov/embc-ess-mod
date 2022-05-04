using OpenQA.Selenium;

namespace EMBC.Tests.Automation.Responders.PageObjects
{
    public abstract class PageObjectBase
    {
        protected readonly IWebDriver webDriver;

        protected PageObjectBase(IWebDriver webDriver)
        {
            this.webDriver = webDriver;
        }

        public virtual string CurrentLocation => new Uri(webDriver.Url).AbsolutePath;

        public virtual void Wait(int milliseconds = 500) => Thread.Sleep(milliseconds);
    }
}