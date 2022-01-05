import * as faker from 'faker/locale/en_CA';
import { CommunityCode, EvacuationFile, PersonDetails } from '../../api/responders/models';
import { generateAddress } from './address';
import { generateNeedsAssessment } from './needs-assessment';

export function generateEvacuationFile(registrantId: string, registrantDetails: PersonDetails, communities: Array<CommunityCode>, taskId: string): EvacuationFile {
    return {
        primaryRegistrantId: registrantId,
        evacuatedFromAddress: generateAddress(communities),
        registrationLocation: faker.company.companyName(),
        needsAssessment: generateNeedsAssessment(registrantDetails),
        securityPhrase: "autotest-load",
        securityPhraseEdited: true,
        task: { taskNumber: taskId },
    };
}