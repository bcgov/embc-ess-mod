import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TabModel } from 'src/app/core/models/tab.model';
import { StepEvacueeProfileService } from '../../step-evacuee-profile/step-evacuee-profile.service';
import { WizardService } from '../../wizard.service';

@Injectable({ providedIn: 'root' })
export class RestrictionService {
  tabMetaData: TabModel;

  constructor(
    private stepEvacueeProfileService: StepEvacueeProfileService,
    private formBuilder: FormBuilder,
    private wizardService: WizardService
  ) {
    this.tabMetaData =
      this.stepEvacueeProfileService.getNavLinks('restriction');
  }

  public createForm(): FormGroup {
    return this.formBuilder.group({
      restrictedAccess: [
        this.stepEvacueeProfileService.restrictedAccess !== null
          ? this.stepEvacueeProfileService.restrictedAccess
          : '',
        [Validators.required]
      ]
    });
  }

  /**
   * Checks the form validity and updates the tab status
   */
  public updateTabStatus(restrictionForm: FormGroup): Subscription {
    return this.stepEvacueeProfileService.nextTabUpdate.subscribe(() => {
      if (restrictionForm.valid) {
        this.stepEvacueeProfileService.setTabStatus('restriction', 'complete');
      }
      this.stepEvacueeProfileService.restrictedAccess =
        restrictionForm.get('restrictedAccess').value;
    });
  }

  public cleanup(restrictionForm: FormGroup) {
    if (this.stepEvacueeProfileService.checkForEdit()) {
      const isFormUpdated = this.wizardService.hasChanged(
        restrictionForm.controls,
        'restriction'
      );

      this.wizardService.setEditStatus({
        tabName: 'restriction',
        tabUpdateStatus: isFormUpdated
      });
      this.stepEvacueeProfileService.updateEditedFormStatus();
    }
    this.stepEvacueeProfileService.nextTabUpdate.next();
  }
}
