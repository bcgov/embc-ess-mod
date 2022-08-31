import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomValidationService } from '../core/services/customValidation.service';
import { AppBaseService } from '../core/services/helper/appBase.service';
import { EvacueeDetailsService } from '../feature-components/wizard/profile-components/evacuee-details/evacuee-details.service';
import { WizardService } from '../feature-components/wizard/wizard.service';
import { MockStepEvacueeProfileService } from './mockStepEvacueeProfile.service';

@Injectable({ providedIn: 'root' })
export class MockEvacueeDetailsService extends EvacueeDetailsService {
  constructor(
    stepEvacueeProfileService: MockStepEvacueeProfileService,
    formBuilder: UntypedFormBuilder,
    wizardService: WizardService,
    customValidation: CustomValidationService,
    appBaseService: AppBaseService,
    dialog: MatDialog
  ) {
    super(
      stepEvacueeProfileService,
      formBuilder,
      wizardService,
      customValidation,
      appBaseService,
      dialog
    );
  }
}
