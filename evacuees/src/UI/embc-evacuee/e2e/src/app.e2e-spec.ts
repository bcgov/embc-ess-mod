import { AppPage } from './app.po';
import { browser, element, logging, ExpectedConditions, by, Key, ElementFinder} from 'protractor';


by.addLocator('formControlName', function (value, opt_parentElement) {
  var using = opt_parentElement || document;

  return using.querySelectorAll('[formcontrolname="' + value + '"]');
});


describe('Evacuee Test Cases', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  //Verifying Title:
  it('should have a title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('EmbcEvacuee');
  });

  //Verifying Main Path:
  it('Main Path', () => {

    var until = ExpectedConditions;

    page.navigateTo();
    
    //Collection Notice & Authorization Page
    element(by.id('mat-checkbox-1')).click();
    element(by.buttonText('Next')).click();

    //Restriction Page
    element(by.id('mat-radio-2')).click();
    expect(element(by.id('mat-radio-2')).getAttribute('value')).toEqual('true');
    element(by.buttonText('Next - Create Account')).click();

    //Create Profile Page - Personal Details
    fillFormInput(element(by.formControlName('firstName')), 'Test First Name');
    fillFormInput(element(by.formControlName('lastName')), 'Test Last Name');
    fillFormInput(element(by.formControlName('preferredName')), 'Test');
    fillFormInput(element(by.formControlName('initials')), 'TT');
    fillFormComboBox(element(by.formControlName('gender')), '.mat-option-text', 'Male');
    fillFormInput(element(by.formControlName('dateOfBirth')), '01/01/1990');
    element(by.buttonText('Next - Primary & Mailing Address')).click();

    //Create Profile Page - Address
    var isBCAdressOption = element(by.formControlName('isBcAddress'));
    selectRadioButton(isBCAdressOption,'mat-radio-button',0);
    expect(element(by.tagName('app-bc-address')).isDisplayed()).toBe(true);
    element(by.css('[data-placeholder = "Address Line 1"]')).sendKeys("123 Main St.");
    element(by.css('[data-placeholder = "Address Line 2"]')).sendKeys("Apt 111");
    element(by.css('[data-placeholder = "City"]')).sendKeys("Vancouver");
    element(by.css('[data-placeholder = "Postal Code"]')).sendKeys("V6Z 1E4");

    fillFormComboBox(element(by.formControlName('isNewMailingAddress')),'mat-radio-input cdk-visually-hidden', 'Yes');

    browser.sleep(5000000);
  });


  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });

  async function fillFormInput(element: ElementFinder, text: string) {
    await element.click();
    await element.sendKeys(text);
    browser.waitForAngular();
  }

  async function fillFormComboBox(mainElement: ElementFinder, className: string, option: string) {
    await mainElement.click();
    //await element.sendKeys(text);
    element(by.cssContainingText(className, option)).click();
    browser.waitForAngular();
  }

  async function selectRadioButton(mainElement: ElementFinder, tagName: string, option: number) {
    mainElement.all(by.tagName(tagName)).then((items) =>{
      items[option].click();
      browser.waitForAngular();

    });
  }

});
