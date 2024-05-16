import * as faker from 'faker/locale/en_CA';
import { CommunityCode, Profile } from '../../api/registrants/models';
import { generateAddress } from './address';
import { getPersonDetailsForIteration } from './person-details';
import { generateSecurityQuestions } from './security-question';

export function generateProfile(communities: Array<CommunityCode>, questions: string[], selfServe: boolean = false): Profile {
    return {
        contactDetails: {
            email: "autotest." + faker.internet.email(),
            phone: faker.phone.phoneNumber("###-###-####"),
        },
        isMailingAddressSameAsPrimaryAddress: false,
        personalDetails: getPersonDetailsForIteration(),
        primaryAddress: generateAddress(communities, selfServe),
        mailingAddress: generateAddress(communities, selfServe),
        restrictedAccess: faker.datatype.boolean(),
        securityQuestions: generateSecurityQuestions(questions),
    };
}