import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as globalConst from '../../../core/services/global-constants';
import { TabModel, TabStatusManager } from 'src/app/core/models/tab.model';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup
} from '@angular/forms';
import {
  ContactDetails,
  RegistrantProfile,
  PersonDetails,
  SecurityQuestion
} from 'src/app/core/api/models';
import { Subject } from 'rxjs';
import { AddressModel } from 'src/app/core/models/address.model';
import { RegistrantProfileModel } from 'src/app/core/models/registrant-profile.model';
import { WizardService } from '../wizard.service';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { LocationsService } from 'src/app/core/services/locations.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { WizardSteps } from 'src/app/core/models/wizard-type.model';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { SecurityQuestionsService } from 'src/app/core/services/security-questions.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class StepEvacueeProfileService {
  // Evacuee Details tab
  // First, Last, and DoB are pre-set in wizardStepService
  personalDetailsVal: PersonDetails;

  // Wizard variables
  private profileTabsVal: Array<TabModel>;

  private nextTabUpdateVal: Subject<void> = new Subject();

  // Restriction tab
  private restrictedAccessVal: boolean;

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

  // Edit Profile Flags for Contact tab
  private unlockedFieldsVal: boolean;
  private authorizedUserVal: boolean;

  // Security Questions tab
  private bypassSecurityQuestionsVal: boolean;
  private securityQuestionsVal: SecurityQuestion[];
  private securityQuestionOptionsVal: string[];

  private editQuestionsVal = true;
  private savedQuestionsVal: SecurityQuestion[];

  // Review & Save tab
  private verifiedProfileVal: boolean;
  private inviteEmailVal?: null | string;
  private confirmInviteEmailVal: string;

  constructor(
    protected dialog: MatDialog,
    protected wizardService: WizardService,
    protected locationService: LocationsService,
    protected appBaseService: AppBaseService,
    protected computeState: ComputeRulesService,
    protected securityQuestionsService: SecurityQuestionsService,
    protected alertService: AlertService,
    protected router: Router
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
    this.isMailingAddressSameAsPrimaryAddressVal =
      isMailingAddressSameAsPrimaryAddressVal;
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

  // Edit Profile Flags for Contact tab
  public get unlockedFields(): boolean {
    return this.unlockedFieldsVal;
  }

  public set unlockedFields(unlockedFieldsVal: boolean) {
    this.unlockedFieldsVal = unlockedFieldsVal;
  }

  public get authorizedUser(): boolean {
    return this.authorizedUserVal;
  }

  public set authorizedUser(authorizedUserVal: boolean) {
    this.authorizedUserVal = authorizedUserVal;
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

  public get inviteEmail(): string {
    return this.inviteEmailVal;
  }
  public set inviteEmail(inviteEmailVal: string) {
    this.inviteEmailVal = inviteEmailVal;
  }

  public get confirmInviteEmail(): string {
    return this.confirmInviteEmailVal;
  }
  public set confirmInviteEmail(confirmInviteEmailVal: string) {
    this.confirmInviteEmailVal = confirmInviteEmailVal;
  }

  public setTabStatus(name: string, status: string): void {
    this.profileTabs?.map((tab) => {
      if (tab?.name === name) {
        tab.status = status;
      }
      return tab;
    });
  }

  /**
   * Sets the tab status from Profile wizard
   */
  public setEditProfileTabStatus(): void {
    this.profileTabs.map((tab) => {
      if (tab.name !== 'review') {
        tab.status = 'complete';
      }
      if (this.savedQuestions.length === 0) {
        if (tab.name === 'security-questions') {
          tab.status = 'not-started';
        }
      }

      return tab;
    });
  }

  public setMemberProfileTabStatus(): void {
    this.profileTabs.map((tab) => {
      if (tab.name === 'evacuee-details') {
        tab.status = 'complete';
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
    return this.profileTabs?.some(
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
      primaryAddress: this.locationService.setAddressObjectForDTO(
        this.primaryAddressDetails
      ),
      mailingAddress: this.locationService.setAddressObjectForDTO(
        this.mailingAddressDetails
      ),
      verifiedUser: this.verifiedProfile
    };

    // Only set security questions if they've been changed
    if (this.editQuestions || !(this.savedQuestions?.length > 0))
      profile.securityQuestions = this.securityQuestions;

    return profile;
  }

  public loadSecurityQuestions() {
    this.securityQuestionsService.getSecurityQuestionList().subscribe({
      next: (questions) => {
        this.securityQuestionOptions = questions;
      },
      error: (error) => {
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.genericError);
      }
    });
  }

  /**
   * Loads the default tab
   */
  loadTab(tabs: Array<TabModel>) {
    if (tabs !== null && tabs !== undefined) {
      const firstTabUrl = tabs[0].route;
      this.router.navigate(['/ess-wizard/evacuee-profile/' + firstTabUrl]);
    }
  }

  /**
   * Reset all values in this service to defaults
   */
  public clearService() {
    if (this.profileTabs) {
      this.profileTabs.length = 0;
    }
    // Wizard variables
    this.nextTabUpdate.next();

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

    // Edit Profile Flags for Contact tab
    this.unlockedFields = undefined;
    this.authorizedUser = undefined;

    // Security Questions tab
    this.bypassSecurityQuestions = undefined;
    this.securityQuestions = undefined;
    this.securityQuestionOptions = undefined;

    this.editQuestions = true;
    this.savedQuestions = undefined;

    // Review & Save tab
    this.verifiedProfile = undefined;
    this.inviteEmail = undefined;
    this.confirmInviteEmail = undefined;
  }

  /**
   * Update the wizard's values with ones fetched from API
   */
  public setFormValuesFromProfile(profile: RegistrantProfileModel) {
    this.wizardService.createObjectReference(profile, 'profile');
    // Wizard variables

    this.appBaseService.appModel = {
      selectedProfile: { selectedEvacueeInContext: profile }
    };
    this.appBaseService.wizardProperties = {
      lastCompletedStep: WizardSteps.Step1
    };
    this.computeState.triggerEvent();

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
    this.authorizedUser = profile.authenticatedUser;
  }

  /**
   * Checks if the form is partially completed or not
   *
   * @param form form group
   * @returns true/false
   */
  checkForPartialUpdates(form: UntypedFormGroup): boolean {
    const fields = [];
    Object.keys(form.controls).forEach((field) => {
      const control = form.controls[field] as
        | UntypedFormControl
        | UntypedFormGroup
        | UntypedFormArray;
      if (control instanceof UntypedFormControl) {
        fields.push(control.value);
      } else if (
        control instanceof UntypedFormGroup ||
        control instanceof UntypedFormArray
      ) {
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

  checkForEdit(): boolean {
    return (
      this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
        ?.id !== null
    );
  }

  updateEditedFormStatus() {
    this.wizardService.editStatus$.subscribe((statues: TabStatusManager[]) => {
      const index = statues.findIndex((tab) => tab.tabUpdateStatus === true);
      if (index !== -1) {
        this.setTabStatus('review', 'incomplete');
        this.wizardService.setStepStatus('/ess-wizard/ess-file', true);
        this.wizardService.setStepStatus('/ess-wizard/add-supports', true);
        this.wizardService.setStepStatus('/ess-wizard/add-notes', true);
      } else {
        if (!this.checkTabsStatus()) {
          this.wizardService.setStepStatus('/ess-wizard/ess-file', false);
          this.wizardService.setStepStatus('/ess-wizard/add-supports', false);
          this.wizardService.setStepStatus('/ess-wizard/add-notes', false);
          this.setTabStatus('review', 'complete');
        }
      }
    });
  }

  getNavLinks(name: string): TabModel {
    return this.profileTabs?.find((tab) => tab.name === name);
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
