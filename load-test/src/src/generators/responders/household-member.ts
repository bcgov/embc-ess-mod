
import * as faker from 'faker/locale/en_CA';
import { EvacuationFileHouseholdMember, PersonDetails } from '../../api/responders/models';

export function generateHouseholdMember(primaryRegistrant?: PersonDetails, registrantId?: string): EvacuationFileHouseholdMember {
    let genders = ['Female', 'Male', 'X'];
    let member: EvacuationFileHouseholdMember = {
        id: null,
        firstName: `autotest-load-${faker.name.firstName()}`,
        lastName: `autotest-load-${faker.name.lastName()}`,
        initials: null,
        gender: faker.random.arrayElement(genders),
        dateOfBirth: faker.date.past().toLocaleString().split(',')[0]
    };

    if (primaryRegistrant) {
        Object.assign(member, primaryRegistrant);
        member.isPrimaryRegistrant = true;
        member.linkedRegistrantId = registrantId;
    }

    return member;
}