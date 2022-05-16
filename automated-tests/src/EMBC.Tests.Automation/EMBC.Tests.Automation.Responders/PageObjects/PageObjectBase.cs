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

        protected void ButtonElement(string btnContent)
        {
            Wait();

            var js = (IJavaScriptExecutor)webDriver;

            var buttons = webDriver.FindElements(By.TagName("button"));
            var selectedBtn = buttons.Should().ContainSingle(b => b.Text.Contains(btnContent)).Subject;
            js.ExecuteScript("arguments[0].click()", selectedBtn);
        }
    }
}