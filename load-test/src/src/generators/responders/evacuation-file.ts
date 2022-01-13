import * as faker from 'faker/locale/en_CA';
import { CommunityCode, EvacuationFile, EvacuationFileSearchResult, PersonDetails } from '../../api/responders/models';
import { generateAddress } from './address';
import { generateNeedsAssessment } from './needs-assessment';

export function generateEvacuationFile(registrantId: string, registrantDetails: PersonDetails, communities: Array<CommunityCode>, taskId: string): EvacuationFile {
    return {
        primaryRegistrantId: registrantId,
        evacuatedFromAddress: generateAddress(communities),
        registrationLocation: faker.company.companyName(),
        needsAssessment: generateNeedsAssessment(registrantDetails, registrantId),
        securityPhrase: "autotest-load",
        securityPhraseEdited: true,
        task: { taskNumber: taskId },
    };
}

export function getUpdatedEvacuationFile(file: any, registrantId: string, registrantDetails: PersonDetails, communities: Array<CommunityCode>, taskId: string): EvacuationFile {
    let ret = {
        id: file.id,
        primaryRegistrantId: registrantId,
        evacuatedFromAddress: generateAddress(communities),
        registrationLocation: faker.company.companyName(),
        needsAssessment: generateNeedsAssessment(registrantDetails, registrantId),
        securityPhrase: "autotest-load",
        securityPhraseEdited: true,
        task: { taskNumber: taskId },
    };

    let primaryMemberId = file.householdMembers.find((m: any) => m.isMainApplicant).id;
    let primaryIndex = ret.needsAssessment.householdMembers.findIndex(m => m.isPrimaryRegistrant)
    if (primaryIndex >= 0) ret.needsAssessment.householdMembers[primaryIndex].id = primaryMemberId;
    
    return ret;
}