import { EvacuationFileHouseholdMember } from '../../api/responders/models/evacuation-file-household-member';
import { InsuranceOption } from '../../api/responders/models/insurance-option';
import { NeedsAssessment } from '../../api/responders/models/needs-assessment';
import { NeedsAssessmentType } from '../../api/responders/models/needs-assessment-type';
import { PersonDetails } from '../../api/responders/models/person-details';
import { Pet } from '../../api/responders/models/pet';
import { getRandomInt } from '../../utilities';
import { generateHouseholdMember } from './household-member';
import { generatePet } from './pet';

export function generateNeedsAssessment(registrantDetails: PersonDetails, registrantId: string): NeedsAssessment {
    let householdMembers: Array<EvacuationFileHouseholdMember> = [];
    let member_count = getRandomInt(0, 8);

    //include primary registrant
    householdMembers.push(generateHouseholdMember(registrantDetails, registrantId));

    for (let i = 0; i < member_count; ++i) {
        householdMembers.push(generateHouseholdMember());
    }

    let pets: Array<Pet> = [];
    let pet_count = getRandomInt(1, 6);

    let petTypes: string[] = ["autotest-load-dog", "autotest-load-cat", "autotest-load-hamster", "autotest-load-bird", "autotest-load-rabbit", "autotest-load-fish"];
    for (let i = 0; i < pet_count; ++i) {
        pets.push(generatePet(petTypes[i]));
    }

    return {
        id: null,
        insurance: InsuranceOption.No,
        householdMembers: householdMembers,
        pets: pets,
        type: NeedsAssessmentType.Preliminary,
    };
}