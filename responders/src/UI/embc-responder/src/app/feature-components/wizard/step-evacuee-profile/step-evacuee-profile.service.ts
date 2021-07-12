import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as globalConst from '../../../core/services/global-constants';
import { TabModel, WizardTabModelValues } from 'src/app/core/models/tab.model';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  ContactDetails,
  RegistrantProfile,
  PersonDetails,
  SecurityQuestion
} from 'src/app/core/api/models';
import { Subject } from 'rxjs';
import { AddressModel } from 'src/app/core/models/address.model';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { WizardService } from '../wizard.service';
import { DialogContent } from 'src/app/core/models/dialog-content.model';

@Injectable({ providedIn: 'root' })
export class StepEvacueeProfileService {
  // Wizard variables
  private profileTabsVal: Array<TabModel> =
    WizardTabModelValues.evacueeProfileTabs;

  private nextTabUpdateVal: Subject<void> = new Subject();

  // Restriction tab
  private restrictedAccessVal: boolean;

  // Evacuee Details tab
  // First, Last, and DoB are pre-set in wizardStepService
  private personalDetailsVal: PersonDetails;

  // Address tab
  private primaryAddressDetailsVal: AddressModel;
  private isBcAddressVal: string;

  private isMailingAddressSameAsPrimaryAddressVal: string;
  private mailingAddressDetailsVal: AddressModel;
  private isBcMailingAddressVal: string;

  // Contact tab
  private showContactVal: boolean;
  private contactDetailsVal: ContactDetails;
  private confirmEmailVal: string;
  private unlockedFieldsVal: boolean;

  // Security Questions tab
  private bypassSecurityQuestionsVal: boolean;
  private securityQuestionsVal: SecurityQuestion[];
  private securityQuestionOptionsVal: string[];

  private editQuestionsVal = true;
  private savedQuestionsVal: SecurityQuestion[];

  // Review & Save tab
  private verifiedProfileVal: boolean;

  constructor(
    private dialog: MatDialog,
    private wizardService: WizardService,
    private evacueeSession: EvacueeSessionService
  ) {}
  // Wizard variables
  public get profileTabs(): Array<TabModel> {
    return this.profileTabsVal;
  }
  public set profileTabs(profileTabsVal: Array<TabModel>) {
    this.profileTabsVal = profileTabsVal;
  }

  public get nextTabUpdate(): Subject<void> {
    return this.nextTabUpdateVal;
  }
  public set nextTabUpdate(nextTabUpdateVal: Subject<void>) {
    this.nextTabUpdateVal = nextTabUpdateVal;
  }

  // Required values not set on form

  // Restriction tab
  public get restrictedAccess(): boolean {
    return this.restrictedAccessVal;
  }
  public set restrictedAccess(restrictedAccessVal: boolean) {
    this.restrictedAccessVal = restrictedAccessVal;
  }

  // Evacuee Details tab
  // First, Last, and DoB are pre-set in wizardStepService
  public get personalDetails(): PersonDetails {
    return this.personalDetailsVal;
  }
  public set personalDetails(personalDetailsVal: PersonDetails) {
    this.personalDetailsVal = personalDetailsVal;
  }

  // Address tab
  public get primaryAddressDetails(): AddressModel {
    return this.primaryAddressDetailsVal;
  }
  public set primaryAddressDetails(primaryAddressDetailsVal: AddressModel) {
    this.primaryAddressDetailsVal = primaryAddressDetailsVal;
  }

  public get isBcAddress(): string {
    return this.isBcAddressVal;
  }
  public set isBcAddress(isBcAddressVal: string) {
    this.isBcAddressVal = isBcAddressVal;
  }

  public get isMailingAddressSameAsPrimaryAddress(): string {
    return this.isMailingAddressSameAsPrimaryAddressVal;
  }
  public set isMailingAddressSameAsPrimaryAddress(
    isMailingAddressSameAsPrimaryAddressVal: string
  ) {
    this.isMailingAddressSameAsPrimaryAddressVal = isMailingAddressSameAsPrimaryAddressVal;
  }

  public get mailingAddressDetails(): AddressModel {
    return this.mailingAddressDetailsVal;
  }
  public set mailingAddressDetails(mailingAddressDetailsVal: AddressModel) {
    this.mailingAddressDetailsVal = mailingAddressDetailsVal;
  }

  public get isBcMailingAddress(): string {
    return this.isBcMailingAddressVal;
  }
  public set isBcMailingAddress(isBcMailingAddressVal: string) {
    this.isBcMailingAddressVal = isBcMailingAddressVal;
  }

  // Contact tab
  public get showContact(): boolean {
    return this.showContactVal;
  }
  public set showContact(showContactVal: boolean) {
    this.showContactVal = showContactVal;
  }

  public get contactDetails(): ContactDetails {
    return this.contactDetailsVal;
  }
  public set contactDetails(contactDetailsVal: ContactDetails) {
    this.contactDetailsVal = contactDetailsVal;
  }

  public get confirmEmail(): string {
    return this.confirmEmailVal;
  }
  public set confirmEmail(confirmEmailVal: string) {
    this.confirmEmailVal = confirmEmailVal;
  }

  public get unlockedFields(): boolean {
    return this.unlockedFieldsVal;
  }

  public set unlockedFields(unlockedFieldsVal: boolean) {
    this.unlockedFieldsVal = unlockedFieldsVal;
  }

  // Security Questions tab
  public get bypassSecurityQuestions(): boolean {
    return this.bypassSecurityQuestionsVal;
  }
  public set bypassSecurityQuestions(bypassSecurityQuestionsVal: boolean) {
    this.bypassSecurityQuestionsVal = bypassSecurityQuestionsVal;
  }

  public get securityQuestions(): SecurityQuestion[] {
    return this.securityQuestionsVal;
  }
  public set securityQuestions(securityQuestionsVal: SecurityQuestion[]) {
    this.securityQuestionsVal = securityQuestionsVal;
  }

  public get securityQuestionOptions(): string[] {
    return this.securityQuestionOptionsVal;
  }
  public set securityQuestionOptions(securityQuestionOptionsVal: string[]) {
    this.securityQuestionOptionsVal = securityQuestionOptionsVal;
  }

  public get editQuestions(): boolean {
    return this.editQuestionsVal;
  }
  public set editQuestions(editQuestionsVal: boolean) {
    this.editQuestionsVal = editQuestionsVal;
  }

  public get savedQuestions(): SecurityQuestion[] {
    return this.savedQuestionsVal;
  }
  public set savedQuestions(savedQuestionsVal: SecurityQuestion[]) {
    this.savedQuestionsVal = savedQuestionsVal;
  }

  // Review & Save tab
  public get verifiedProfile(): boolean {
    return this.verifiedProfileVal;
  }
  public set verifiedProfile(verifiedProfileVal: boolean) {
    this.verifiedProfileVal = verifiedProfileVal;
  }

  public setTabStatus(name: string, status: string): void {
    this.profileTabs.map((tab) => {
      if (tab.name === name) {
        tab.status = status;
      }
      return tab;
    });
  }

  // TODO: To be reviewed later by Avisha
  // public setEditTabStatus(): void {
  //   this.profileTabs.map((tab) => {
  //     if (tab.name !== 'review') {
  //       tab.status = 'complete';
  //     }
  //     return tab;
  //   });
  // }

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
    return this.profileTabs.some(
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
  openModal(content: DialogContent): MatDialogRef<DialogComponent, any> {
    const thisModal = this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content
      },
      width: '530px'
    });

    return thisModal;
  }

  /**
   * Convert Create Profile form data into object that can be submitted to the API
   *
   * @returns Profile record usable by the API
   */
  public createProfileDTO(): RegistrantProfile {
    const profile: RegistrantProfile = {
      restriction: this.restrictedAccess,
      personalDetails: this.personalDetails,
      contactDetails: this.contactDetails,
      primaryAddress: this.wizardService.setAddressObjectForDTO(
        this.primaryAddressDetails
      ),
      mailingAddress: this.wizardService.setAddressObjectForDTO(
        this.mailingAddressDetails
      ),
      verifiedUser: this.verifiedProfile
    };

    // Only set security questions if they've been changed
    if (this.editQuestions || !(this.savedQuestions?.length > 0))
      profile.securityQuestions = this.securityQuestions;

    return profile;
  }

  /**
   * Reset all values in this service to defaults
   */
  public clearService() {
    // Wizard variables
    this.nextTabUpdate.next(null);

    // Restriction tab
    this.restrictedAccess = undefined;

    // Evacuee Details tab
    // First, Last, and DoB are pre-set in wizardStepService
    this.personalDetails = undefined;

    // Address tab
    this.primaryAddressDetails = undefined;
    this.isBcAddress = undefined;

    this.isMailingAddressSameAsPrimaryAddress = undefined;
    this.mailingAddressDetails = undefined;
    this.isBcMailingAddress = undefined;

    // Contact tab
    this.showContact = undefined;
    this.contactDetails = undefined;
    this.confirmEmail = undefined;
    this.unlockedFields = undefined;

    // Security Questions tab
    this.bypassSecurityQuestions = undefined;
    this.securityQuestions = undefined;
    this.securityQuestionOptions = undefined;

    this.editQuestions = true;
    this.savedQuestions = undefined;

    // Review & Save tab
    this.verifiedProfile = undefined;
  }

  /**
   * Update the wizard's values with ones fetched from API
   */
  public setFormValuesFromProfile(profile: RegistrantProfileModel) {
    // Wizard variables
    this.evacueeSession.profileId = profile.id;

    // Restriction tab
    this.restrictedAccess = profile.restriction;

    // Evacuee Details tab
    this.personalDetails = profile.personalDetails;

    // Address tab
    this.primaryAddressDetails = this.wizardService.setAddressObjectForForm(
      profile.primaryAddress
    );
    this.isBcAddress = this.checkForBCAddress(
      profile.primaryAddress.stateProvinceCode
    );

    this.isBcMailingAddress = this.checkForBCAddress(
      profile.mailingAddress.stateProvinceCode
    );
    this.mailingAddressDetails = this.wizardService.setAddressObjectForForm(
      profile.mailingAddress
    );
    this.isMailingAddressSameAsPrimaryAddress = this.checkForSameMailingAddress(
      profile.isMailingAddressSameAsPrimaryAddress
    );

    // Contact tab
    this.contactDetails = profile.contactDetails;
    this.confirmEmail = profile.contactDetails?.email;

    this.showContact =
      this.contactDetails.email?.length > 0 ||
      this.contactDetails.phone?.length > 0;

    // Security Questions tab
    this.securityQuestions = [];
    this.savedQuestions = profile.securityQuestions;
    this.editQuestions = false;

    // Review & Save tab
    this.verifiedProfile = profile.verifiedUser;
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

  private checkForSameMailingAddress(
    isMailingAddressSameAsPrimaryAddress: boolean
  ): string {
    return isMailingAddressSameAsPrimaryAddress === true ? 'Yes' : 'No';
  }

  private checkForBCAddress(province: null | string): string {
    return province !== null && province === 'BC' ? 'Yes' : 'No';
  }
}
