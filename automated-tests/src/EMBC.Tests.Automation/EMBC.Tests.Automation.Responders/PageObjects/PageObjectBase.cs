using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;

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

        protected void YesRadioButton()
        {
            Wait();

            var js = (IJavaScriptExecutor)webDriver;
            var yesradiobutton = webDriver.FindElement(By.Id("yesOption"));

            js.ExecuteScript("arguments[0].scrollIntoView();", yesradiobutton);

            Wait();
            yesradiobutton.Click();
        }

        protected void NoRadioButton()
        {
            var js = (IJavaScriptExecutor)webDriver;

            var noradiobutton = webDriver.FindElement(By.Id("noOption"));
            js.ExecuteScript("arguments[0].scrollIntoView();", noradiobutton);

            Wait();
            noradiobutton.Click();
        }

        protected void RadioButtonElement(By element)
        {
            Wait();

            var js = (IJavaScriptExecutor)webDriver;
            var selectedRadioBttn = webDriver.FindElement(element);

            js.ExecuteScript("arguments[0].scrollIntoView();", selectedRadioBttn);

            Wait();
            selectedRadioBttn.Click();
        }

        protected void ChooseRandomOption(IWebElement parentElement, string parentElementName)
        {
            Random random = new Random();
            var js = (IJavaScriptExecutor)webDriver;

            var childrenElements = parentElement.FindElements(By.TagName("mat-radio-button"));
            int index = random.Next(1, childrenElements.Count + 1);
            var selectedRadioBttnLocator = "mat-radio-group[formcontrolname='" + parentElementName + "'] mat-radio-button:nth-child(" + index + ")";
            var selectedRadioBttn = webDriver.FindElement(By.CssSelector(selectedRadioBttnLocator));

            js.ExecuteScript("arguments[0].scrollIntoView();", selectedRadioBttn);
            Wait();
            selectedRadioBttn.Click();
        }
    }
}