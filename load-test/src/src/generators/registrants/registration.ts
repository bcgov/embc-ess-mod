import * as faker from 'faker/locale/en_CA';
import { AnonymousRegistration, CommunityCode, PersonDetails } from '../../api/registrants/models';
import { generateAddress } from './address';
import { generateEvacuationFile } from './evacuation-file';
import { generateNewPersonDetails } from './person-details';
import { generateSecurityQuestions } from './security-question'

export function generateAnonymousRegistration(communities: Array<CommunityCode>, security_questions: string[]): AnonymousRegistration {
    let registrantDetails: PersonDetails = generateNewPersonDetails();
    return {
        informationCollectionConsent: faker.datatype.boolean(),
        preliminaryNeedsAssessment: generateEvacuationFile(registrantDetails, communities),
        registrationDetails: {
            id: null,
            contactDetails: {
                phone: faker.phone.phoneNumber("###-###-####"),
                hideEmailRequired: false,
                hidePhoneRequired: false
            },
            mailingAddress: generateAddress(communities),
            personalDetails: registrantDetails,
            primaryAddress: generateAddress(communities),
            restrictedAccess: true,
            securityQuestions: generateSecurityQuestions(security_questions),
        },
        captcha: "abc"
    }
}