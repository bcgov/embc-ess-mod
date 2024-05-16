import * as faker from 'faker/locale/en_CA';
import { CommunityCode, EvacuationFile, PersonDetails } from '../../api/registrants/models';
import { generateAddress } from './address';
import { generateNeedsAssessment } from './needs-assessment';

export function generateEvacuationFile(registrantDetails: PersonDetails, communities: Array<CommunityCode>, selfServe: boolean = false): EvacuationFile {
    return {
        evacuatedFromAddress: generateAddress(communities, selfServe),
        isRestricted: faker.datatype.boolean(),
        needsAssessment: generateNeedsAssessment(registrantDetails, selfServe),
        secretPhrase: "autotest-load",
        secretPhraseEdited: true
    };
}