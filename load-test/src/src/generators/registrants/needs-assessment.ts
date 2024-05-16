import * as faker from 'faker/locale/en_CA';
import { HouseholdMember, PersonDetails, Pet } from '../../api/registrants/models';
import { IdentifiedNeed } from '../../api/registrants/models/identified-need';
import { InsuranceOption } from '../../api/registrants/models/insurance-option';
import { NeedsAssessment } from '../../api/registrants/models/needs-assessment';
import { NeedsAssessmentType } from '../../api/registrants/models/needs-assessment-type';
import { getRandomInt } from '../../utilities';
import { generateHouseholdMember } from './household-member';
import { generatePet } from './pet';

export function generateNeedsAssessment(registrantDetails: PersonDetails, selfServe: boolean = false): NeedsAssessment {
    let householdMembers: Array<HouseholdMember> = [];
    let member_count = getRandomInt(0, selfServe ? 4 : 8);

    //include primary registrant
    householdMembers.push(generateHouseholdMember(registrantDetails));

    for (let i = 0; i < member_count; ++i) {
        householdMembers.push(generateHouseholdMember());
    }

    let pets: Array<Pet> = [];
    let pet_count = getRandomInt(1, 6);

    let petTypes: string[] = ["autotest-load-dog", "autotest-load-cat", "autotest-load-hamster", "autotest-load-bird", "autotest-load-rabbit", "autotest-load-fish"];
    for (let i = 0; i < pet_count; ++i) {
        pets.push(generatePet(petTypes[i]));
    }

    let need_options = Object.values(IdentifiedNeed);
    //Transportation isn't selectable in the portal, so don't include it...
    let transportation_index = need_options.findIndex(opt => opt == IdentifiedNeed.Tranportation);
    if (transportation_index >= 0) need_options.splice(transportation_index, 1);

    //can only choose one of shelter allowance or referral, so randomly remove one as a choosable option
    //self serve is not allowed if shelter referral
    let shelter_allowance = faker.datatype.boolean() || selfServe;
    let shelter_referral_index = need_options.findIndex(opt => opt == IdentifiedNeed.ShelterReferral);
    if (shelter_allowance) need_options.splice(shelter_referral_index, 1);
    else need_options.splice(1, 1);

    let needs_count = getRandomInt(1, need_options.length);
    let needs: Array<IdentifiedNeed> = [];
    for (let i = 0; i < needs_count; ++i) {
        needs.push(need_options.splice(getRandomInt(0, need_options.length - 1), 1)[0]);
    }

    return {
        id: null,
        insurance: InsuranceOption.No,
        householdMembers: householdMembers,
        pets: pets,
        type: NeedsAssessmentType.Preliminary,
        needs: needs
    };
}