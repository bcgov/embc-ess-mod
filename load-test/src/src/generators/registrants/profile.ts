import * as faker from 'faker/locale/en_CA';
import { CommunityCode, Profile } from '../../api/registrants/models';
import { generateAddress } from './address';
import { generatePersonDetails } from './person-details';
import { generateSecurityQuestions } from './security-question';

export function generateProfile(communities: Array<CommunityCode>, questions: string[]): Profile {
    return {
        contactDetails: {
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber("###-###-####"),
        },
        isMailingAddressSameAsPrimaryAddress: false,
        personalDetails: generatePersonDetails(),
        primaryAddress: generateAddress(communities),
        mailingAddress: generateAddress(communities),
        restrictedAccess: faker.datatype.boolean(),
        securityQuestions: generateSecurityQuestions(questions),
    };
}