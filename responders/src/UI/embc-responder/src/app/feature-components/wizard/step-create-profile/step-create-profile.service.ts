import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as globalConst from '../../../core/services/global-constants';
import { TabModel, WizardTabModelValues } from 'src/app/core/models/tab.model';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import {
  Address,
  ContactDetails,
  PersonDetails,
  Profile
} from 'src/app/core/models/profile';

@Injectable({ providedIn: 'root' })
export class StepCreateProfileService {
  private profileTabs: Array<TabModel> =
    WizardTabModelValues.evacueeProfileTabs;

  private restricted: boolean;

  private personalDetail: PersonDetails;
  private primaryAddressDetail: Address;
  private mailingAddressDetail: Address;
  private contactDetail: ContactDetails;

  constructor(private dialog: MatDialog) {}

  public get restrictedAccess(): boolean {
    return this.restricted;
  }
  public set restrictedAccess(restricted: boolean) {
    this.restricted = restricted;
  }

  public get personalDetails(): PersonDetails {
    return this.personalDetail;
  }
  public set personalDetails(personalDetail: PersonDetails) {
    this.personalDetail = personalDetail;
  }

  public get primaryAddressDetails(): Address {
    return this.primaryAddressDetail;
  }
  public set primaryAddressDetails(primaryAddressDetail: Address) {
    this.primaryAddressDetail = primaryAddressDetail;
  }

  public get mailingAddressDetails(): Address {
    return this.mailingAddressDetail;
  }
  public set mailingAddressDetails(mailingAddressDetail: Address) {
    this.mailingAddressDetail = mailingAddressDetail;
  }

  public get contactDetails(): ContactDetails {
    return this.contactDetail;
  }
  public set contactDetails(contactDetail: ContactDetails) {
    this.contactDetail = contactDetail;
  }

  public get tabs(): Array<TabModel> {
    return this.profileTabs;
  }
  public set tabs(tabs: Array<TabModel>) {
    this.profileTabs = tabs;
  }

  public setTabStatus(name: string, status: string): void {
    this.tabs.map((tab) => {
      if (tab.name === name) {
        tab.status = status;
      }
      return tab;
    });
  }

  /**
   * Determines if the tab navigation is allowed or not
   *
   * @param tabRoute clicked route
   * @param $event mouse click event
   * @returns true/false
   */
  isAllowed(tabRoute: string, $event: MouseEvent): boolean {
    if (tabRoute === 'review') {
      const allow = this.checkTabsStatus();
      if (allow) {
        $event.stopPropagation();
        $event.preventDefault();
        this.openModal(globalConst.wizardProfileMessage);
      }
      return allow;
    }
  }

  /**
   * Checks the status of the tabs
   *
   * @returns true/false
   */
  checkTabsStatus(): boolean {
    return this.tabs.some(
      (tab) =>
        (tab.status === 'not-started' || tab.status === 'incomplete') &&
        tab.name !== 'review'
    );
  }

  /**
   * Open information modal window
   *
   * @param text text to display
   */
  openModal(text: string): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        text
      },
      height: '230px',
      width: '530px'
    });
  }

  public createProfileDTO(): Profile {
    return {
      contactDetails: this.contactDetails,
      mailingAddress: this.setAddressObject(this.mailingAddressDetails),
      personalDetails: this.personalDetails,
      primaryAddress: this.setAddressObject(this.primaryAddressDetails),
      restrictedAccess: this.restrictedAccess
    };
  }

  public setAddressObject(addressObject): Address {
    const address: Address = {
      addressLine1: addressObject.addressLine1,
      addressLine2: addressObject.addressLine2,
      country: addressObject.country.code,
      jurisdiction:
        addressObject.jurisdiction.code === undefined
          ? null
          : addressObject.jurisdiction.code,
      postalCode: addressObject.postalCode,
      stateProvince:
        addressObject.stateProvince === null
          ? addressObject.stateProvince
          : addressObject.stateProvince.code
    };

    return address;
  }
}
