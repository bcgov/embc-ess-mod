import { Injectable } from '@angular/core';
import { Address, AnonymousRegistration, NeedsAssessment, Registration } from '../core/api/models';
import { EvacuationFileDataService } from '../sharedModules/components/evacuation-file/evacuation-file-data.service';
import { NeedsAssessmentService } from '../sharedModules/components/needs-assessment/needs-assessment.service';
import { ProfileDataService } from '../sharedModules/components/profile/profile-data.service';

@Injectable({ providedIn: 'root' })
export class NonVerifiedRegistrationMappingService {

    constructor(
        private profileDataService: ProfileDataService, private needsService: NeedsAssessmentService,
        private evacuationFileDataService: EvacuationFileDataService) { }

    mapAnonymousRegistration(): AnonymousRegistration {
        return {
            preliminaryNeedsAssessment: this.mergeData(this.createNeedsAssessment(), this.needsService.createNeedsAssessmentDTO()),
            registrationDetails: this.createRegistrationDTO(),
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
            householdMembers: null,
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
            evacuatedFromAddress: null,
            informationCollectionConsent: false,
            mailingAddress: null,
            personalDetails: null,
            primaryAddress: null,
            restrictedAccess: null,
            secretPhrase: null,
        };
    }

    private createRegistrationDTO(): Registration {

        let nonVerifiedRegistration: Registration = this.createRegistration();

        const evacuatedAddress = {
            evacuatedFromAddress: this.setAddressObject(this.evacuationFileDataService.evacuatedFromAddress)
        };

        nonVerifiedRegistration = this.mergeData(nonVerifiedRegistration, this.profileDataService.createProfileDTO());
        nonVerifiedRegistration = this.mergeData(nonVerifiedRegistration, evacuatedAddress);

        return nonVerifiedRegistration;
    }

    private setAddressObject(addressObject): Address {
        const address: Address = {
            addressLine1: addressObject.addressLine1,
            addressLine2: addressObject.addressLine2,
            country: {
                code: addressObject.country.code,
                name: addressObject.country.name
            },
            jurisdiction: {
                code: addressObject.jurisdiction.code === undefined ?
                    null : addressObject.jurisdiction.code,
                name: addressObject.jurisdiction.name ===
                    undefined ? addressObject.jurisdiction : addressObject.jurisdiction.name
            },
            postalCode: addressObject.postalCode,
            stateProvince: {
                code: addressObject.stateProvince === null ?
                    addressObject.stateProvince : addressObject.stateProvince.code,
                name: addressObject.stateProvince === null ?
                    addressObject.stateProvince : addressObject.stateProvince.name
            }
        };

        return address;
    }
}
