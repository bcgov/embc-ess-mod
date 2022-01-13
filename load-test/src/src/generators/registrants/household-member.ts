import { HouseholdMember, PersonDetails } from '../../api/registrants/models';
import { generateNewPersonDetails } from './person-details';

export function generateHouseholdMember(primaryRegistrant?: PersonDetails): HouseholdMember {
    let member: HouseholdMember = {
        id: null,
        details: generateNewPersonDetails()
    };

    if (primaryRegistrant) {
        member.details = primaryRegistrant;
        member.isPrimaryRegistrant = true;
    }

    return member;
}