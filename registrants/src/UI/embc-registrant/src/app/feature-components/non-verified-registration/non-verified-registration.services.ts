import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CaptchaResponse } from 'src/app/core/components/captcha-v2/captcha-v2.component';
import { RegistrationResult } from '../../core/api/models/registration-result';
import { EvacuationsService } from '../../core/api/services';
import { NonVerifiedRegistrationMappingService } from './non-verified-registration-mapping.service';

@Injectable({ providedIn: 'root' })
export class NonVerifiedRegistrationService {
  constructor(
    private evacuationsService: EvacuationsService,
    private registrationMapping: NonVerifiedRegistrationMappingService
  ) {}

  public submitRegistration(
    captchaResponse: CaptchaResponse
  ): Observable<RegistrationResult> {
    return this.evacuationsService.evacuationsCreate({
      body: this.registrationMapping.mapAnonymousRegistration(captchaResponse)
    });
  }
}
