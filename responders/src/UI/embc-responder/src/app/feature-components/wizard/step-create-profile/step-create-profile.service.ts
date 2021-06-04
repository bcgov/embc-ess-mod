import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as globalConst from '../../../core/services/global-constants';
import { TabModel, WizardTabModelValues } from 'src/app/core/models/tab.model';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  Address,
  ContactDetails,
  RegistrantProfile,
  PersonDetails,
  SecurityQuestion
} from 'src/app/core/api/models';
import { Subject } from 'rxjs';
import { AddressModel } from 'src/app/core/models/Address.model';

@Injectable({ providedIn: 'root' })
export class StepCreateProfileService {
  private profileTabs: Array<TabModel> =
    WizardTabModelValues.evacueeProfileTabs;

  private setNextTabUpdate: Subject<void> = new Subject();

  private restricted: boolean;
  private personalDetail: PersonDetails;
  private contactDetail: ContactDetails;
  private showContacts: boolean;
  private confirmEmails: string;

  private primaryAddressDetail: AddressModel;
  private mailingAddressDetail: AddressModel;
  private isBcAddresS: boolean;
  private isBcMailingAddresS: boolean;
  private isMailingAddressSameAsPrimaryAddresS: boolean;

  private bypassQuestions: boolean;
  private securityQuestion: SecurityQuestion[];
  private securityQuestionOption: string[];

  private verified: boolean;

  constructor(private dialog: MatDialog) {}

  public get showContact(): boolean {
    return this.showContacts;
  }
  public set showContact(showContacts: boolean) {
    this.showContacts = showContacts;
  }

  public get confirmEmail(): string {
    return this.confirmEmails;
  }
  public set confirmEmail(value: string) {
    this.confirmEmails = value;
  }

  public get isMailingAddressSameAsPrimaryAddress(): boolean {
    return this.isMailingAddressSameAsPrimaryAddresS;
  }
  public set isMailingAddressSameAsPrimaryAddress(
    isMailingAddressSameAsPrimaryAddresS: boolean
  ) {
    this.isMailingAddressSameAsPrimaryAddresS = isMailingAddressSameAsPrimaryAddresS;
  }

  public get isBcMailingAddress(): boolean {
    return this.isBcMailingAddresS;
  }
  public set isBcMailingAddress(isBcMailingAddresS: boolean) {
    this.isBcMailingAddresS = isBcMailingAddresS;
  }

  public get isBcAddress(): boolean {
    return this.isBcAddresS;
  }
  public set isBcAddress(isBcAddresS: boolean) {
    this.isBcAddresS = isBcAddresS;
  }

  public get restrictedAccess(): boolean {
    return this.restricted;
  }
  public set restrictedAccess(restricted: boolean) {
    this.restricted = restricted;
  }

  public get verifiedProfile(): boolean {
    return this.verified;
  }
  public set verifiedProfile(verified: boolean) {
    this.verified = verified;
  }

  public get personalDetails(): PersonDetails {
    return this.personalDetail;
  }
  public set personalDetails(personalDetail: PersonDetails) {
    this.personalDetail = personalDetail;
  }

  public get primaryAddressDetails(): AddressModel {
    return this.primaryAddressDetail;
  }
  public set primaryAddressDetails(primaryAddressDetail: AddressModel) {
    this.primaryAddressDetail = primaryAddressDetail;
  }

  public get mailingAddressDetails(): AddressModel {
    return this.mailingAddressDetail;
  }
  public set mailingAddressDetails(mailingAddressDetail: AddressModel) {
    this.mailingAddressDetail = mailingAddressDetail;
  }

  public get contactDetails(): ContactDetails {
    return this.contactDetail;
  }
  public set contactDetails(contactDetail: ContactDetails) {
    this.contactDetail = contactDetail;
  }

  public get bypassSecurityQuestions(): boolean {
    return this.bypassQuestions;
  }
  public set bypassSecurityQuestions(bypassQuestions: boolean) {
    this.bypassQuestions = bypassQuestions;
  }

  public get securityQuestions(): SecurityQuestion[] {
    return this.securityQuestion;
  }
  public set securityQuestions(securityQuestion: SecurityQuestion[]) {
    this.securityQuestion = securityQuestion;
  }

  public get securityQuestionOptions(): string[] {
    return this.securityQuestionOption;
  }
  public set securityQuestionOptions(securityQuestionOption: string[]) {
    this.securityQuestionOption = securityQuestionOption;
  }

  public get nextTabUpdate(): Subject<void> {
    return this.setNextTabUpdate;
  }
  public set nextTabUpdate(setNextTabUpdate: Subject<void>) {
    this.setNextTabUpdate = setNextTabUpdate;
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

        this.openModal(
          globalConst.wizardProfileMessage.text,
          globalConst.wizardProfileMessage.title
        );
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
  openModal(text: string, title?: string): MatDialogRef<DialogComponent, any> {
    const thisModal = this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        text,
        title
      },
      width: '530px'
    });

    return thisModal;
  }

  public createProfileDTO(): RegistrantProfile {
    return {
      restriction: this.restrictedAccess,
      personalDetails: this.personalDetails,
      contactDetails: this.contactDetails,
      primaryAddress: this.setAddressObject(this.primaryAddressDetails),
      mailingAddress: this.setAddressObject(this.mailingAddressDetails),
      securityQuestions: this.securityQuestions,
      verifiedUser: this.verifiedProfile
    };
  }

  public setAddressObject(addressObject: AddressModel): Address {
    const address: Address = {
      addressLine1: addressObject.addressLine1,
      addressLine2: addressObject.addressLine2,
      countryCode: addressObject.country.code,
      communityCode:
        addressObject.community.code === undefined
          ? null
          : addressObject.community.code,
      postalCode: addressObject.postalCode,
      stateProvinceCode:
        addressObject.stateProvince === null
          ? null
          : addressObject.stateProvince.code
    };

    return address;
  }

  /**
   * Checks if the form is partially completed or not
   *
   * @param form form group
   * @returns true/false
   */
  checkForPartialUpdates(form: FormGroup): boolean {
    const fields = [];
    Object.keys(form.controls).forEach((field) => {
      const control = form.controls[field] as
        | FormControl
        | FormGroup
        | FormArray;
      if (control instanceof FormControl) {
        fields.push(control.value);
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        for (const key in control.controls) {
          if (control.controls.hasOwnProperty(key)) {
            fields.push(control.controls[key].value);
          }
        }
      }
    });

    const result = fields.filter((field) => !!field);
    return result.length !== 0;
  }
}
