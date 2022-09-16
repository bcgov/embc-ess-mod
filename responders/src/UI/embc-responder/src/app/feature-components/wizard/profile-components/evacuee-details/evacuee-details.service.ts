import { Injectable } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TabModel } from 'src/app/core/models/tab.model';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { VerifyEvacueeDialogComponent } from 'src/app/shared/components/dialog-components/verify-evacuee-dialog/verify-evacuee-dialog.component';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import { WizardService } from '../../wizard.service';
import * as globalConst from '../../../../core/services/global-constants';

@Injectable({ providedIn: 'root' })
export class EvacueeDetailsService {
  private tabMetaDataVal: TabModel;
  private editFlagVal: boolean;
  private verifiedProfileVal: boolean;
  private authorizedUserVal: boolean;
  private showLockIconVal: boolean;
  private showUnlockLinkVal: boolean;

  public get showUnlockLink() {
    return this.showUnlockLinkVal;
  }
  public set showUnlockLink(value) {
    this.showUnlockLinkVal = value;
  }

  public get showLockIcon() {
    return this.showLockIconVal;
  }
  public set showLockIcon(value) {
    this.showLockIconVal = value;
  }

  public get tabMetaData(): TabModel {
    return this.tabMetaDataVal;
  }
  public set tabMetaData(value: TabModel) {
    this.tabMetaDataVal = value;
  }

  public get editFlag(): boolean {
    return this.editFlagVal;
  }
  public set editFlag(value: boolean) {
    this.editFlagVal = value;
  }

  public get verifiedProfile(): boolean {
    return this.verifiedProfileVal;
  }
  public set verifiedProfile(value: boolean) {
    this.verifiedProfileVal = value;
  }

  public get authorizedUser(): boolean {
    return this.authorizedUserVal;
  }
  public set authorizedUser(value: boolean) {
    this.authorizedUserVal = value;
  }

  constructor(
    protected stepEvacueeProfileService: StepEvacueeProfileService,
    protected formBuilder: UntypedFormBuilder,
    protected wizardService: WizardService,
    protected customValidation: CustomValidationService,
    protected appBaseService: AppBaseService,
    protected dialog: MatDialog
  ) {}

  public init() {
    this.tabMetaData =
      this.stepEvacueeProfileService.getNavLinks('evacuee-details');

    this.editFlag = this.appBaseService?.wizardProperties?.editFlag;
    this.verifiedProfile = this.stepEvacueeProfileService.verifiedProfile;
    this.authorizedUser = this.stepEvacueeProfileService.authorizedUser;
  }

  public createForm(): UntypedFormGroup {
    return this.formBuilder.group({
      firstName: [
        this.stepEvacueeProfileService.personalDetails?.firstName,
        [this.customValidation.whitespaceValidator()]
      ],
      lastName: [
        this.stepEvacueeProfileService.personalDetails?.lastName,
        [this.customValidation.whitespaceValidator()]
      ],
      preferredName: [
        this.stepEvacueeProfileService.personalDetails !== undefined
          ? this.stepEvacueeProfileService.personalDetails.preferredName
          : ''
      ],
      initials: [
        this.stepEvacueeProfileService.personalDetails !== undefined
          ? this.stepEvacueeProfileService.personalDetails.initials
          : ''
      ],
      gender: [
        this.stepEvacueeProfileService.personalDetails !== undefined
          ? this.stepEvacueeProfileService.personalDetails.gender
          : '',
        [this.customValidation.whitespaceValidator()]
      ],
      dateOfBirth: [
        this.stepEvacueeProfileService.personalDetails?.dateOfBirth,
        [Validators.required, this.customValidation.dateOfBirthValidator()]
      ]
    });
  }

  /**
   * Checks the form validity and updates the tab status
   */
  public updateTabStatus(form: UntypedFormGroup): Subscription {
    return this.stepEvacueeProfileService.nextTabUpdate.subscribe(() => {
      if (form.valid) {
        this.stepEvacueeProfileService.setTabStatus(
          'evacuee-details',
          'complete'
        );
      } else {
        this.stepEvacueeProfileService.setTabStatus(
          'evacuee-details',
          'incomplete'
        );
      }
      this.stepEvacueeProfileService.personalDetails = form.getRawValue();
    });
  }

  public cleanup(form: UntypedFormGroup) {
    if (this.stepEvacueeProfileService.checkForEdit()) {
      const isFormUpdated = this.wizardService.hasChanged(
        form.controls,
        'personalDetails'
      );

      this.wizardService.setEditStatus({
        tabName: 'details',
        tabUpdateStatus: isFormUpdated
      });
      this.stepEvacueeProfileService.updateEditedFormStatus();
    }
    this.stepEvacueeProfileService.nextTabUpdate.next();
  }

  /**
   * Function that determines whether firstName, lastName and DoB fields should be disabled or not
   */
  public initDisabledFields(form: UntypedFormGroup): void {
    if (this.editFlag) {
      if (this.stepEvacueeProfileService.unlockedFields) {
        this.showLockIcon = false;
        this.showUnlockLink = false;
      } else if (this.verifiedProfile) {
        form.get('firstName').disable();
        form.get('lastName').disable();
        form.get('dateOfBirth').disable();
        this.showLockIcon = true;
        this.showUnlockLink = true;
      } else if (this.authorizedUser) {
        form.get('firstName').disable();
        form.get('lastName').disable();
        form.get('dateOfBirth').disable();
        this.showLockIcon = true;
        this.showUnlockLink = false;
      } else {
        this.showLockIcon = false;
        this.showUnlockLink = false;
      }
    } else if (this.appBaseService?.wizardProperties?.memberFlag) {
      this.showLockIcon = false;
      this.showUnlockLink = false;
    } else {
      form.get('firstName').disable();
      form.get('lastName').disable();
      form.get('dateOfBirth').disable();
      this.showLockIcon = true;
      this.showUnlockLink = false;
    }
  }

  /**
   * Enables the locked fields
   */
  editLockedFields(form: UntypedFormGroup): void {
    this.dialog
      .open(DialogComponent, {
        data: {
          component: VerifyEvacueeDialogComponent,
          content: globalConst.unlockFieldsProfile
        },
        width: '620px'
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'verified') {
          form.get('firstName').enable();
          form.get('lastName').enable();
          form.get('dateOfBirth').enable();
          this.showLockIcon = false;
          this.stepEvacueeProfileService.unlockedFields = true;
          this.showUnlockLink = false;
        }
      });
  }
}
