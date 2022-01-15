import * as faker from 'faker/locale/en_CA';
import { PersonDetails, NeedsAssessment, InsuranceOption, NeedsAssessmentType, Pet, EvacuationFileHouseholdMember } from '../../api/responders/models';
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
        canProvideClothing: faker.datatype.boolean(),
        canProvideFood: faker.datatype.boolean(),
        canProvideIncidentals: faker.datatype.boolean(),
        canProvideLodging: faker.datatype.boolean(),
        canProvideTransportation: faker.datatype.boolean(),
        householdMembers: householdMembers,
        havePetsFood: faker.datatype.boolean(),
        haveMedicalSupplies: faker.datatype.boolean(),
        haveSpecialDiet: faker.datatype.boolean(),
        specialDietDetails: "test",
        insurance: InsuranceOption.No,
        pets: pets,
        type: NeedsAssessmentType.Preliminary
    };
}