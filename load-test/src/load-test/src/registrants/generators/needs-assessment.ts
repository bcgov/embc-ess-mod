import * as faker from 'faker/locale/en_CA';
import { PersonDetails, NeedsAssessment, HouseholdMember, InsuranceOption, NeedsAssessmentType, Pet } from '../api/models';
import { getRandomInt } from '../../utilities';
import { generateHouseholdMember } from './household-member';
import { generatePet } from './pet';

export function generateNeedsAssessment(registrantDetails: PersonDetails): NeedsAssessment {
    let householdMembers: Array<HouseholdMember> = [];
    let member_count = getRandomInt(8);

    //include primary registrant
    householdMembers.push(generateHouseholdMember(registrantDetails));

    for (let i = 0; i < member_count; ++i) {
        householdMembers.push(generateHouseholdMember());
    }

    let pets: Array<Pet> = [];
    let pet_count = getRandomInt(6);

    let petTypes: string[] = ["dog", "cat", "hamster", "bird", "rabbit", "fish"];
    for (let i = 0; i < pet_count; ++i) {
        pets.push(generatePet(petTypes[i]));
    }

    return {
        id: null,
        canEvacueeProvideClothing: faker.datatype.boolean(),
        canEvacueeProvideFood: faker.datatype.boolean(),
        canEvacueeProvideIncidentals: faker.datatype.boolean(),
        canEvacueeProvideLodging: faker.datatype.boolean(),
        canEvacueeProvideTransportation: faker.datatype.boolean(),
        householdMembers: householdMembers,
        hasPetsFood: faker.datatype.boolean(),
        haveMedication: faker.datatype.boolean(),
        haveSpecialDiet: faker.datatype.boolean(),
        specialDietDetails: "test",
        insurance: InsuranceOption.No,
        pets: pets,
        type: NeedsAssessmentType.Preliminary
    };
}