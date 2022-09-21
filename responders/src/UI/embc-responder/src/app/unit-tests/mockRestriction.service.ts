import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { RestrictionService } from '../feature-components/wizard/profile-components/restriction/restriction.service';
import { WizardService } from '../feature-components/wizard/wizard.service';
import { MockStepEvacueeProfileService } from './mockStepEvacueeProfile.service';

@Injectable({
  providedIn: 'root'
})
export class MockRestrictionService extends RestrictionService {
  constructor(
    stepEvacueeProfileService: MockStepEvacueeProfileService,
    formBuilder: UntypedFormBuilder,
    wizardService: WizardService
  ) {
    super(stepEvacueeProfileService, formBuilder, wizardService);
  }
}
