using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;

namespace EMBC.Tests.Automation.Responders.PageObjects
{
    public abstract class PageObjectBase
    {
        protected readonly IWebDriver webDriver;
        protected By personFormFirstNameInput = By.CssSelector("input[formcontrolname='firstName']");
        protected By personFormLastNameInput = By.CssSelector("input[formcontrolname='lastName']");
        protected By personFormGenderSelect = By.CssSelector("mat-select[formcontrolname='gender']");
        protected By personFormDateOfBirthInput = By.CssSelector("input[formcontrolname='dateOfBirth']");

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
    }
}