import { Injectable } from '@angular/core';
import { AddressModel } from 'src/app/core/models/address.model';
import { WizardSidenavModel } from 'src/app/core/models/wizard-sidenav.model';
import { WizardType } from 'src/app/core/models/wizard-type.model';
import { CacheService } from 'src/app/core/services/cache.service';
import { WizardDataService } from './wizard-data.service';

@Injectable({ providedIn: 'root' })
export class WizardService {
  private sideMenuItems: Array<WizardSidenavModel>;

  constructor(
    private cacheService: CacheService,
    private wizardDataService: WizardDataService
  ) {}

  public get menuItems(): Array<WizardSidenavModel> {
    if (this.sideMenuItems === null || this.sideMenuItems === undefined)
      this.sideMenuItems = JSON.parse(this.cacheService.get('wizardMenu'));

    return this.sideMenuItems;
  }
  public set menuItems(menuItems: Array<WizardSidenavModel>) {
    this.sideMenuItems = menuItems;
    this.cacheService.set('wizardMenu', menuItems);
  }

  public setDefaultMenuItems(type: string): void {
    if (type === WizardType.NewRegistration) {
      this.menuItems = this.wizardDataService.createNewRegistrationMenu();
    } else if (type === WizardType.NewEssFile) {
      this.menuItems = this.wizardDataService.createNewESSFileMenu();
    } else if (type === WizardType.EditRegistration) {
      this.menuItems = this.wizardDataService.createEditProfileMenu();
    } else if (type === WizardType.ReviewFile) {
      this.menuItems = this.wizardDataService.createReviewFileMenu();
    } else if (type === WizardType.CompleteFile) {
      this.menuItems = this.wizardDataService.createCompleteFileMenu();
    } else if (type === WizardType.MemberRegistration) {
      this.menuItems = this.wizardDataService.createMembersProfileMenu();
    }
  }

  /**
   * Return the index of current step of the wizard, based on the submitted URL
   *
   * @param url URL of current page, typically retrieved from this.router.url
   */
  public getCurrentStep(currentUrl: string): number {
    let curStep = -1;
    currentUrl = currentUrl.toLowerCase();

    this.menuItems.every((item, index) => {
      const route = item.route.toLowerCase();

      // If match is found, set value and stop loop
      if (currentUrl.startsWith(route)) {
        curStep = index;
        return false;
      }

      return true;
    });

    return curStep;
  }

  public setStepStatus(name: string, status: boolean): void {
    this.menuItems.map((menu) => {
      if (menu.route === name) {
        menu.isLocked = status;
      }
      return menu;
    });
  }

  /**
   * Map an address from the API to an address usable by the wizard form
   *
   * @param addressObject AddressModel object with nested objects set by UI code
   * @returns An Address that can be filled into the site's address forms
   */
  public setAddressObjectForForm(addressObject: AddressModel): AddressModel {
    const address: AddressModel = {
      addressLine1: addressObject.addressLine1,
      addressLine2: addressObject.addressLine2,
      country: addressObject.country,
      postalCode: addressObject.postalCode,
      stateProvince: addressObject.stateProvince,
      community:
        addressObject.city !== null
          ? addressObject.city
          : addressObject.community
    };

    return address;
  }
}
