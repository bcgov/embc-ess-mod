import { Injectable } from '@angular/core';
import { AnonymousRegistration, NeedsAssessment, Registration } from '../core/api/models';
import { NeedsAssessmentService } from '../sharedModules/components/needs-assessment/needs-assessment.service';
import { ProfileDataService } from '../sharedModules/components/profile/profile-data.service';

@Injectable({ providedIn: 'root' })
export class NonVerifiedRegistrationMappingService {

    constructor(private profileDataService: ProfileDataService, private needsService: NeedsAssessmentService) { }

    mapAnonymousRegistration(): AnonymousRegistration {
        return {
            preliminaryNeedsAssessment: this.mergeData(this.createNeedsAssessment(), this.needsService.createNeedsAssessmentDTO()),
            registrationDetails: this.mergeData(this.createRegistration(), this.profileDataService.createProfileDTO()),
            captcha: 'abc'
        };
    }

    private mergeData<T>(finalValue: T, incomingValue: Partial<T>): T {
        return { ...finalValue, ...incomingValue };
    }

    private createNeedsAssessment(): NeedsAssessment {
        return {
            canEvacueeProvideClothing: null,
            canEvacueeProvideFood: null,
            canEvacueeProvideIncidentals: null,
            canEvacueeProvideLodging: null,
            canEvacueeProvideTransportation: null,
            evacuatedFromAddress: null,
            familyMembers: null,
            hasPetsFood: null,
            haveMedication: null,
            haveSpecialDiet: null,
            insurance: null,
            pets: null,
        };
    }

    private createRegistration(): Registration {
        return {
            contactDetails: null,
            contactId: null,
            informationCollectionConsent: false,
            mailingAddress: null,
            personalDetails: null,
            primaryAddress: null,
            restrictedAccess: null,
            secretPhrase: null,
        };
    }
}
