import * as faker from 'faker/locale/en_CA';
import { CommunityCode, PersonDetails, RegistrantProfile } from '../../api/responders/models';
import { generateAddress } from './address';
import { generateSecurityQuestions } from './security-question'

export function generateRegistrant(registrantDetails: PersonDetails,communities: Array<CommunityCode>, security_questions: string[]): RegistrantProfile {
    return {
        id: null,
        restriction: faker.datatype.boolean(),
        personalDetails: registrantDetails,
        contactDetails: {
            email: "autotest." + faker.internet.email(),
            phone: faker.phone.phoneNumber("###-###-####"),
        },
        primaryAddress: generateAddress(communities),
        mailingAddress: generateAddress(communities),
        verifiedUser: faker.datatype.boolean(),
        securityQuestions: generateSecurityQuestions(security_questions),
    }
}