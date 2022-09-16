import * as faker from 'faker/locale/en_CA';
import { CommunityCode, Profile } from '../../api/registrants/models';
import { generateAddress } from './address';
import { getPersonDetailsForIteration } from './person-details';
import { generateSecurityQuestions } from './security-question';

export function generateProfile(communities: Array<CommunityCode>, questions: string[]): Profile {
    return {
        contactDetails: {
            email: "autotest." + faker.internet.email(),
            phone: faker.phone.phoneNumber("###-###-####"),
        },
        isMailingAddressSameAsPrimaryAddress: false,
        personalDetails: getPersonDetailsForIteration(),
        primaryAddress: generateAddress(communities),
        mailingAddress: generateAddress(communities),
        restrictedAccess: faker.datatype.boolean(),
        securityQuestions: generateSecurityQuestions(questions),
    };
}