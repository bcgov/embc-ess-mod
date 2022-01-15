import * as faker from 'faker/locale/en_CA';
import { CommunityCode, EssTask, EvacuationFile, PersonDetails } from '../../api/responders/models';
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

export function getUpdatedEvacuationFile(file: EvacuationFile, registrantId: string, registrantDetails: PersonDetails, task: EssTask): EvacuationFile {
    //need to retain and set household member id of primary member
    let primaryMember = file.needsAssessment.householdMembers.find(m => m.isPrimaryRegistrant);
    file.needsAssessment = generateNeedsAssessment(registrantDetails, registrantId);
    if (primaryMember) {
        file.needsAssessment.householdMembers[0].id = primaryMember.id;
    }
    file.evacuatedFromAddress.countryCode = "CAN";
    file.evacuatedFromAddress.stateProvinceCode = "BC";

    if (!file.task.taskNumber) {
        file.task.taskNumber = task.id || "";
    }

    if (!file.registrationLocation) file.registrationLocation = faker.company.companyName();

    file.supports = [];

    return file;
}