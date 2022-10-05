import { Injectable } from '@angular/core';
import { CaptchaResponse } from 'src/app/core/components/captcha-v2/captcha-v2.component';
import { AnonymousRegistration, Profile } from '../../core/api/models';
import { EvacuationFileDataService } from '../../sharedModules/components/evacuation-file/evacuation-file-data.service';
import { ProfileDataService } from '../profile/profile-data.service';

@Injectable({ providedIn: 'root' })
export class NonVerifiedRegistrationMappingService {
  constructor(
    private profileDataService: ProfileDataService,
    private evacuationFileDataService: EvacuationFileDataService
  ) {}

  mapAnonymousRegistration(
    captchaResponse: CaptchaResponse
  ): AnonymousRegistration {
    return {
      informationCollectionConsent: true,
      preliminaryNeedsAssessment:
        this.evacuationFileDataService.createEvacuationFileDTO(),
      registrationDetails: this.mergeData(
        this.createRegistration(),
        this.profileDataService.createProfileDTO()
      ),
      captcha: captchaResponse.resolved
    };
  }

  private mergeData<T>(finalValue: T, incomingValue: Partial<T>): T {
    return { ...finalValue, ...incomingValue };
  }

  private createRegistration(): Profile {
    return {
      id: null,
      contactDetails: null,
      mailingAddress: null,
      personalDetails: null,
      primaryAddress: null,
      restrictedAccess: null,
      securityQuestions: null
    };
  }
}
