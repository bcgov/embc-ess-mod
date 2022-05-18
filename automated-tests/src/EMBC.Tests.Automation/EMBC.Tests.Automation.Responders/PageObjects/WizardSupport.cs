using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EMBC.Tests.Automation.Responders.PageObjects
{
    internal class WizardSupport : WizardBasePageObject
    {
        //ELEMENTS:
        private By selectSupportFormTypeSelect = By.CssSelector("mat-select[formcontrolname='type']");

        private By supportDetailsFormNbrDaysSelect = By.CssSelector("mat-select[formcontrolname='noOfDays']");
        private By supportDetailsFormAllMembersCheckbox = By.Id("allMembers");
        private By supportDetailsFormtotalAmountInput = By.CssSelector("input[formcontrolname='userTotalAmount']");

        private By supportDetailsFormPaperSupportNbrInput = By.CssSelector("input[formcontrolname='paperSupportNumber']");
        private By supportDetailsFormPaperCompletedOnInput = By.CssSelector("input[formcontrolname='paperCompletedOn']");
        private By supportDetailsFormValidFromDateInput = By.CssSelector("input[formcontrolname='fromDate']");
        private By supportDetailsFormValidFromTimeInput = By.CssSelector("input[formcontrolname='fromTime']");
        private By supportDetailsFormValidToDateInput = By.CssSelector("input[formcontrolname='toDate']");
        private By supportDetailsFormValidToTimeInput = By.CssSelector("input[formcontrolname='toTime']");
        private By supportDetailsFormNbrOfRoomsSelect = By.CssSelector("mat-select[formcontrolname='noOfRooms']");

        private By supportDeliveryReferralCard = By.Id("referralCard");
        private By supportDeliveryResposibleSelect = By.CssSelector("mat-select[formcontrolname='issuedTo']");
        private By supportDeliveryResponsibleNameInput = By.CssSelector("input[formcontrolname='name']");
        private By supportDeliverySupplierInput = By.CssSelector("input[formcontrolname='supplier']");
        private By supportDeliverySupplierSelect = By.XPath("//div[@role='listbox']/mat-option[1]");

        private By processSupportFormCertificateCheckBox = By.Id("processDraftCert");
        private By viewSupportFormSupportStatus = By.XPath("//table[@role='table']/tbody/tr/td[7]");

        public WizardSupport(IWebDriver webDriver) : base(webDriver)
        { }

        public void WizardAddSupport()
        {
            ButtonElement("+ Add Supports");
        }

        public void WizardSelectSupportForm(string supportType)
        {
            Wait();

            webDriver.FindElement(selectSupportFormTypeSelect).SendKeys(supportType);
            ButtonElement("Next - Support Details");
        }

        public void SupportFoodDetailsForm(string nbrOfDays, string mealValue)
        {
            Wait();

            webDriver.FindElement(supportDetailsFormNbrDaysSelect).SendKeys(nbrOfDays);
            RadioButtonElement(supportDetailsFormAllMembersCheckbox);
            webDriver.FindElement(supportDetailsFormtotalAmountInput).SendKeys(mealValue);
            ButtonElement("Next - Support Delivery");
        }

        public void SupportPaperBasedHotelDetailsForm(string interviewer, string interviewerInitials, string completedDate, string validToDate, string validTime, string nbrRooms)
        {
            Random random = new Random();
            var supportNbr = random.Next(0, 1000000).ToString("D8");

            Wait();

            webDriver.FindElement(supportDetailsFormPaperSupportNbrInput).SendKeys(supportNbr);
            webDriver.FindElement(personFormFirstNameInput).SendKeys(interviewer);
            webDriver.FindElement(wizardInterviewerInitialsInput).SendKeys(interviewerInitials);
            webDriver.FindElement(supportDetailsFormPaperCompletedOnInput).SendKeys(completedDate);
            webDriver.FindElement(supportDetailsFormValidFromDateInput).SendKeys(completedDate);
            webDriver.FindElement(supportDetailsFormValidFromTimeInput).SendKeys(validTime);
            webDriver.FindElement(supportDetailsFormValidToDateInput).SendKeys(validToDate);
            webDriver.FindElement(supportDetailsFormValidToTimeInput).SendKeys(validTime);

            RadioButtonElement(supportDetailsFormAllMembersCheckbox);
            webDriver.FindElement(supportDetailsFormNbrOfRoomsSelect).SendKeys(nbrRooms);
            ButtonElement("Next - Support Delivery");
        }

        public void SupportDeliveryForm(string responsibleName)
        {
            var responsible = "Someone else";

            webDriver.FindElement(supportDeliveryReferralCard).Click();
            Wait();

            webDriver.FindElement(supportDeliveryResposibleSelect).SendKeys(responsible);
            Wait();

            webDriver.FindElement(supportDeliveryResponsibleNameInput).SendKeys(responsibleName);
            webDriver.FindElement(supportDeliverySupplierInput).Click();
            webDriver.FindElement(supportDeliverySupplierSelect).Click();

            ButtonElement("Next - Save Support");
        }

        public void SuccessSupportPopUp()
        {
            Wait();
            ButtonElement("Close");
        }

        public void WizardProcessDraftSupports()
        {
            Wait();
            ButtonElement("Process Draft Support/s");
            
        }

        public void WizardOnlineProcessSupportsForm()
        {
            RadioButtonElement(processSupportFormCertificateCheckBox);
            ButtonElement("Process Support/s");
            ButtonElement("Proceed");
        }

        public void WizardPaperBasedProcessSupportsForm()
        {
            ButtonElement("Process Support/s");
            ButtonElement("Proceed");
        }

        // ASSERT FUNCTIONS
        public string GetSupportStatus()
        {
            Wait();
            return webDriver.FindElement(viewSupportFormSupportStatus).Text;
        }
    }
}
