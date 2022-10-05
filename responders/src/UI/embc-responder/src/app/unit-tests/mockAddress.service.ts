import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { CustomValidationService } from '../core/services/customValidation.service';
import { AddressService } from '../feature-components/wizard/profile-components/address/address.service';
import { WizardService } from '../feature-components/wizard/wizard.service';
import { MockStepEvacueeProfileService } from './mockStepEvacueeProfile.service';

@Injectable({
  providedIn: 'root'
})
export class MockAddressService extends AddressService {
  constructor(
    formBuilder: UntypedFormBuilder,
    customValidation: CustomValidationService,
    stepEvacueeProfileService: MockStepEvacueeProfileService,
    wizardService: WizardService
  ) {
    super(
      formBuilder,
      customValidation,
      stepEvacueeProfileService,
      wizardService
    );
  }
}
