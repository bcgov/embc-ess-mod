import { Injectable } from '@angular/core';
import {
  Address,
  AnonymousRegistration,
  EvacuationFile,
  NeedsAssessment,
  Profile
} from '../../core/api/models';
import { EvacuationFileDataService } from '../../sharedModules/components/evacuation-file/evacuation-file-data.service';
import { NeedsAssessmentService } from '../needs-assessment/needs-assessment.service';
import { ProfileDataService } from '../profile/profile-data.service';

@Injectable({ providedIn: 'root' })
export class NonVerifiedRegistrationMappingService {
  constructor(
    private profileDataService: ProfileDataService,
    private needsService: NeedsAssessmentService,
    private evacuationFileDataService: EvacuationFileDataService
  ) {}

  mapAnonymousRegistration(): AnonymousRegistration {
    return {
      // evacuatedFromAddress: this.setAddressObject(
      //   this.evacuationFileDataService.evacuatedFromAddress
      // ),
      informationCollectionConsent: true,
      preliminaryNeedsAssessment:
        this.evacuationFileDataService.createEvacuationFileDTO(),
      // preliminaryNeedsAssessment: this.mergeData(
      //   this.createNeedsAssessment(),
      //   this.needsService.createNeedsAssessmentDTO()
      // ),
      registrationDetails: this.mergeData(
        this.createRegistration(),
        this.profileDataService.createProfileDTO()
      ),
      captcha: 'abc'
      // secretPhrase: this.needsService.secretWordPhrase,
      // needsAssessments: []
    };
  }

  private mergeData<T>(finalValue: T, incomingValue: Partial<T>): T {
    return { ...finalValue, ...incomingValue };
  }

  private createEvacuationFile(): EvacuationFile {
    return {
      evacuatedFromAddress: null,
      isRestricted: null,
      needsAssessment: null,
      secretPhrase: null,
      secretPhraseEdited: null,
      status: null
    };
  }

  private createNeedsAssessment(): NeedsAssessment {
    return {
      canEvacueeProvideClothing: null,
      canEvacueeProvideFood: null,
      canEvacueeProvideIncidentals: null,
      canEvacueeProvideLodging: null,
      canEvacueeProvideTransportation: null,
      householdMembers: null,
      hasPetsFood: null,
      haveMedication: null,
      haveSpecialDiet: null,
      specialDietDetails: null,
      insurance: null,
      pets: null
    };
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

  private setAddressObject(addressObject): Address {
    const address: Address = {
      addressLine1: addressObject.addressLine1,
      addressLine2: addressObject.addressLine2,
      country: addressObject.country.code,
      community:
        addressObject.community.code === undefined
          ? null
          : addressObject.community.code,
      postalCode: addressObject.postalCode,
      stateProvince:
        addressObject.stateProvince === null
          ? addressObject.stateProvince
          : addressObject.stateProvince.code
    };

    return address;
  }
}
