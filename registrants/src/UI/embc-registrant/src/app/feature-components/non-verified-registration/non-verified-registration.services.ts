import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistrationResult } from '../../core/api/models/registration-result';
import { EvacuationsService } from '../../core/api/services';
import { NonVerifiedRegistrationMappingService } from './non-verified-registration-mapping.service';

@Injectable({ providedIn: 'root' })
export class NonVerifiedRegistrationService {
  constructor(
    private evacuationsService: EvacuationsService,
    private registrationMapping: NonVerifiedRegistrationMappingService
  ) {}

  public submitRegistration(): Observable<RegistrationResult> {
    console.log(this.registrationMapping.mapAnonymousRegistration());
    return this.evacuationsService.evacuationsCreate({
      body: this.registrationMapping.mapAnonymousRegistration()
    });
  }
}
