using OpenQA.Selenium;
using Protractor;

namespace EMBC.Tests.Automation.Responders.PageObjects
{
    internal class WizardSupport : WizardPageObjectBase
    {
        //ELEMENTS:
        private By viewSupportsMainTable = By.CssSelector("table[role='table']");

        private By selectSupportFormTypeSelect = By.CssSelector("mat-select[formcontrolname='type']");

        private By selectWinterConditionRadioGroup = By.CssSelector("mat-radio-group[formcontrolname='extremeWinterConditions']");

        private By supportDetailsFormNbrDaysSelect = By.CssSelector("mat-select[formcontrolname='noOfDays']");
        private By supportDetailsFormAllMembersCheckbox = By.Id("allMembers");
        private By supportDetailsIncidetalsTextArea = By.CssSelector("textarea[formcontrolname='approvedItems']");
        private By supportDetailsFormFromAddressInput = By.CssSelector("input[formcontrolname='fromAddress']");
        private By supportDetailsFormToAddressInput = By.CssSelector("input[formcontrolname='toAddress']");
        private By supportDetailsFormOtherTransportModeInput = By.CssSelector("input[formcontrolname='transportMode']");
        private By supportDetailsFormOtherTransportTotalAmountInput = By.CssSelector("input[formcontrolname='totalAmount']");
        private By supportDetailsFormTotalAmountInput = By.CssSelector("input[formcontrolname='userTotalAmount']");

        private By supportDetailsFormPaperSupportNbrInput = By.CssSelector("input[formcontrolname='paperSupportNumber']");
        private By supportDetailsFormPaperCompletedOnInput = By.CssSelector("input[formcontrolname='paperCompletedOn']");
        private By supportDetailsFormValidFromDateInput = By.CssSelector("input[formcontrolname='fromDate']");
        private By supportDetailsFormValidFromTimeInput = By.CssSelector("input[formcontrolname='fromTime']");
        private By supportDetailsFormValidToDateInput = By.CssSelector("input[formcontrolname='toDate']");
        private By supportDetailsFormValidToTimeInput = By.CssSelector("input[formcontrolname='toTime']");
        private By supportDetailsFormNbrOfRoomsSelect = By.CssSelector("mat-select[formcontrolname='noOfRooms']");

        private By supportDeliveryReferralCard = By.Id("referralCard");
        private By supportDeliveryInteracCard = By.Id("interacCard");

        private By supportDeliveryResposibleSelect = By.CssSelector("mat-select[formcontrolname='issuedTo']");
        private By supportDeliveryResponsibleNameInput = By.CssSelector("input[formcontrolname='name']");
        private By supportDeliverySupplierInput = By.CssSelector("input[formcontrolname='supplier']");
        private By supportDeliverySupplierSelect = By.XPath("//div[@role='listbox']/mat-option[1]");

        private By supportDeliveryNotificationSelect = By.CssSelector("mat-select[formcontrolname='notificationPreference']");
        private By supportDeliveryEmailMobileNotOption = By.XPath("//mat-option/span[contains(text(), 'Email & Mobile')]/ancestor::mat-option");
        private By supportDeliveryEmailNotOption = By.XPath("//mat-option[2]/span[contains(text(), 'Email')]/ancestor::mat-option");
        private By supportDeliveryMobileNotOption = By.XPath("//mat-option[3]/span[contains(text(), 'Mobile')]/ancestor::mat-option");
        private By supportDeliveryEmailInput = By.CssSelector("input[formcontrolname='notificationEmail']");
        private By supportDeliveryEmailConfirmInput = By.CssSelector("input[formcontrolname='notificationConfirmEmail']");
        private By supportDeliveryEmailUsePreviousEmailCheckbox = By.Id("setEmailCheckbox");
        private By supportDeliveryMobileInput = By.CssSelector("input[formcontrolname='notificationMobile']");
        private By supportDeliveryMobileConfirmInput = By.CssSelector("input[formcontrolname='notificationConfirmMobile']");
        private By supportDeliveryMobileUsePreviousCheckbox = By.Id("setMobileCheckbox");

        private By supportDeliveryBilletingHostFullNameInput = By.CssSelector("input[formcontrolname='hostName']");
        private By supportDeliveryBilletingHostAddressInput = By.CssSelector("input[formcontrolname = 'hostAddress']");
        private By supportDeliveryBilletingHostCityInput = By.CssSelector("input[formcontrolname='hostCity']");
        private By supportDeliveryBilletingHostTelephoneInput = By.CssSelector("input[formcontrolname='hostPhone']");
        private By supportDeliveryBilletingHostEmailInput = By.CssSelector("input[formcontrolname='emailAddress']");

        private By processSupportFormCertificateCheckBox = By.Id("processDraftCert");
        private By viewSupportFormSupportStatus = By.XPath("//table[@role='table']/tbody/tr/td[7]");

        public WizardSupport(IWebDriver webDriver) : base(webDriver)
        { }

        public void WizardAddSupport()
        {
            if (webDriver.FindElements(viewSupportsMainTable).Count > 0)
            {
                ButtonElement("Add Supports");
            }
            else
            {
                ButtonElement("+ Add Supports");
            }
        }

        public void WizardSelectSupportForm(string supportType)
        {
            Wait();

            webDriver.FindElement(selectSupportFormTypeSelect).SendKeys(supportType);
            ButtonElement("Next - Support Details");
        }

        public void SupportClothingDetailsForm(string totalAmount)
        {
            Wait();
            
            //Support Details
            FocusAndClick(supportDetailsFormAllMembersCheckbox);
            var winterClothingElement = webDriver.FindElement(selectWinterConditionRadioGroup);
            ChooseRandomOption(winterClothingElement, "extremeWinterConditions");
            webDriver.FindElement(supportDetailsFormTotalAmountInput).SendKeys(totalAmount);
            ButtonElement("Next - Support Delivery");
        }

        public void SupportIncidentalsDetailsForm(string listItems, string totalAmount)
        {
            Wait();

            //Support Details
            FocusAndClick(supportDetailsFormAllMembersCheckbox);

            webDriver.FindElement(supportDetailsIncidetalsTextArea).SendKeys(listItems);
            webDriver.FindElement(supportDetailsFormTotalAmountInput).SendKeys(totalAmount);

            ButtonElement("Next - Support Delivery");
        }

        public void SupportHotelDetailsForm(string nbrRooms)
        {
            Wait();

            FocusAndClick(supportDetailsFormAllMembersCheckbox);
            webDriver.FindElement(supportDetailsFormNbrOfRoomsSelect).SendKeys(nbrRooms);
            ButtonElement("Next - Support Delivery");
        }

        public void SupportBilletingDetailsForm()
        {
            Wait();

            FocusAndClick(supportDetailsFormAllMembersCheckbox);
            ButtonElement("Next - Support Delivery");
        }

        public void SupportGroupLodgingDetailsForm()
        {
            Wait();

            FocusAndClick(supportDetailsFormAllMembersCheckbox);
            ButtonElement("Next - Support Delivery");
        }

        public void SupportGroceriesDetailsForm(string nbrOfDays, string mealValue)
        {
            Wait();

            webDriver.FindElement(supportDetailsFormNbrDaysSelect).SendKeys(nbrOfDays);
            FocusAndClick(supportDetailsFormAllMembersCheckbox);
            webDriver.FindElement(supportDetailsFormTotalAmountInput).SendKeys(mealValue);
            ButtonElement("Next - Support Delivery");
        }

        public void SupportRestaurantDetailsForm()
        {
            Wait();

            FocusAndClick(supportDetailsFormAllMembersCheckbox);
            ButtonElement("Next - Support Delivery");
        }

        public void SupportTaxiDetailsForm(string from, string to)
        {
            Wait();
            
            FocusAndClick(supportDetailsFormAllMembersCheckbox);
            webDriver.FindElement(supportDetailsFormFromAddressInput).SendKeys(from);
            webDriver.FindElement(supportDetailsFormToAddressInput).SendKeys(to);
            ButtonElement("Next - Support Delivery");
        }

        public void SupportTransportOtherDetailsForm(string transportMode, string totalAmount)
        {
            Wait();

            //Support Details
            FocusAndClick(supportDetailsFormAllMembersCheckbox);
            webDriver.FindElement(supportDetailsFormOtherTransportModeInput).SendKeys(transportMode);
            webDriver.FindElement(supportDetailsFormOtherTransportTotalAmountInput).SendKeys(totalAmount);
            ButtonElement("Next - Support Delivery");
        }

        public void SupportReferralDeliveryForm(string responsibleName)
        {
            var responsible = "Someone else";

            webDriver.FindElement(supportDeliveryReferralCard).Click();
            Wait();

            webDriver.FindElement(supportDeliveryResposibleSelect).SendKeys(responsible);
            Wait();

            webDriver.FindElement(supportDeliveryResponsibleNameInput).SendKeys(responsibleName);
            webDriver.FindElement(supportDeliverySupplierInput).Click();
            FocusAndClick(supportDeliverySupplierSelect);

            ButtonElement("Next - Save Support");
        }

        public void SupportReferralBilletingDeliveryForm(string responsibleName, string hostName, string hostAddress, string hostCity, string hostPhone, string hostEmail)
        {
            var responsible = "Someone else";

            webDriver.FindElement(supportDeliveryReferralCard).Click();
            Wait();

            webDriver.FindElement(supportDeliveryResposibleSelect).SendKeys(responsible);
            Wait();

            webDriver.FindElement(supportDeliveryResponsibleNameInput).SendKeys(responsibleName);

            webDriver.FindElement(supportDeliveryBilletingHostFullNameInput).SendKeys(hostName);
            webDriver.FindElement(supportDeliveryBilletingHostAddressInput).SendKeys(hostAddress);
            webDriver.FindElement(supportDeliveryBilletingHostCityInput).SendKeys(hostCity);
            webDriver.FindElement(supportDeliveryBilletingHostTelephoneInput).SendKeys(hostPhone);
            webDriver.FindElement(supportDeliveryBilletingHostEmailInput).SendKeys(hostEmail);

            ButtonElement("Next - Save Support");
        }

        public void SupportReferralGroupDeliveryForm(string responsibleName, string hostName, string hostAddress, string hostCity, string hostPhone)
        {
            var responsible = "Someone else";

            webDriver.FindElement(supportDeliveryReferralCard).Click();
            Wait();

            webDriver.FindElement(supportDeliveryResposibleSelect).SendKeys(responsible);
            Wait();

            webDriver.FindElement(supportDeliveryResponsibleNameInput).SendKeys(responsibleName);

            webDriver.FindElement(supportDeliveryBilletingHostFullNameInput).SendKeys(hostName);
            webDriver.FindElement(supportDeliveryBilletingHostAddressInput).SendKeys(hostAddress);
            webDriver.FindElement(supportDeliveryBilletingHostCityInput).SendKeys(hostCity);
            webDriver.FindElement(By.Id(hostCity)).Click();
            webDriver.FindElement(supportDeliveryBilletingHostTelephoneInput).SendKeys(hostPhone);

            ButtonElement("Next - Save Support");
        }

        public void WizardSupportDetailsPaperBased(string interviewer, string interviewerInitials, string completedDate, string validToDate, string validTime)
        {
            var supportNbr = Randomizer("D8");

            webDriver.FindElement(supportDetailsFormPaperSupportNbrInput).SendKeys(supportNbr);
            webDriver.FindElement(personFormFirstNameInput).SendKeys(interviewer);
            webDriver.FindElement(wizardInterviewerInitialsInput).SendKeys(interviewerInitials);
            webDriver.FindElement(supportDetailsFormPaperCompletedOnInput).SendKeys(completedDate);
            webDriver.FindElement(supportDetailsFormValidFromDateInput).SendKeys(completedDate);
            webDriver.FindElement(supportDetailsFormValidFromTimeInput).SendKeys(validTime);
            webDriver.FindElement(supportDetailsFormValidToDateInput).SendKeys(validToDate);
            webDriver.FindElement(supportDetailsFormValidToTimeInput).SendKeys(validTime);
        }

        public void SupportInteracDeliveryEmailAndMobileForm(string email, string phone)
        {
            var js = (IJavaScriptExecutor)webDriver;

            FocusAndClick(supportDeliveryInteracCard);
            Wait();

            var selectNotificationElement = webDriver.FindElement(supportDeliveryNotificationSelect);
            js.ExecuteScript("arguments[0].scrollIntoView();", selectNotificationElement);

            Wait();
            selectNotificationElement.Click();

            webDriver.FindElement(supportDeliveryEmailMobileNotOption).Click();
            Wait();

            webDriver.FindElement(supportDeliveryEmailInput).SendKeys(email);
            webDriver.FindElement(supportDeliveryEmailConfirmInput).SendKeys(email);
            webDriver.FindElement(supportDeliveryMobileInput).SendKeys(phone);
            webDriver.FindElement(supportDeliveryMobileConfirmInput).SendKeys(phone);

            ButtonElement("Next - Save Support");
        }

        public void SupportInteracDeliveryEmailForm()
        {
            var js = (IJavaScriptExecutor)webDriver;

            FocusAndClick(supportDeliveryInteracCard);
            Wait();

            var selectNotificationElement = webDriver.FindElement(supportDeliveryNotificationSelect);
            js.ExecuteScript("arguments[0].scrollIntoView();", selectNotificationElement);

            Wait();
            selectNotificationElement.Click();

            webDriver.FindElement(supportDeliveryEmailNotOption).Click();
            Wait();

            FocusAndClick(supportDeliveryEmailUsePreviousEmailCheckbox);

            ButtonElement("Next - Save Support");
        }

        public void SupportInteracDeliveryMobileForm()
        {
            var js = (IJavaScriptExecutor)webDriver;

            FocusAndClick(supportDeliveryInteracCard);
            Wait();

            var selectNotificationElement = webDriver.FindElement(supportDeliveryNotificationSelect);
            js.ExecuteScript("arguments[0].scrollIntoView();", selectNotificationElement);

            Wait();
            selectNotificationElement.Click();

            webDriver.FindElement(supportDeliveryMobileNotOption).Click();
            Wait();

            FocusAndClick(supportDeliveryMobileUsePreviousCheckbox);

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
            ScrollToBottom();
            FocusAndClick(processSupportFormCertificateCheckBox);
            ButtonElement("Process Support/s");
            ButtonElement("Proceed");
        }

        public void WizardPaperBasedProcessSupportsForm()
        {
            ButtonElement("Process Support/s");
            ButtonElement("Proceed");
        }

        public void CancelPrintOut()
        {
            var currentWindowHandle = webDriver.WindowHandles.Last();
            string? popupWindowHandle = null;
            var numberOfTries = 6;
            var waitTimeBetweenTries = (int)TimeSpan.FromSeconds(10).TotalMilliseconds;
            while (numberOfTries > 0)
            {
                Wait(waitTimeBetweenTries);
                if (webDriver.WindowHandles.Last() != currentWindowHandle)
                {
                    popupWindowHandle = webDriver.WindowHandles.Last();
                    break;
                }
                numberOfTries--;
            }
            if (popupWindowHandle != null)
            {
                var driver = webDriver is NgWebDriver ngDriver
                   ? ngDriver.WrappedDriver
                   : webDriver;

                driver.SwitchTo().Window(popupWindowHandle);

                var element = driver.FindElement(By.TagName("print-preview-app"));
                element.SendKeys(Keys.Tab);
                element.SendKeys(Keys.Enter);

                driver.SwitchTo().Window(currentWindowHandle);
            }
        }

        // ASSERT FUNCTIONS
        public string GetSupportStatus()
        {
            Wait();
            return webDriver.FindElement(viewSupportFormSupportStatus).Text;
        }

        
    }
}
