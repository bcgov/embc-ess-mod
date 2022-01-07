import * as faker from 'faker/locale/en_CA';
import { PersonDetails } from '../../api/registrants/models';

export function generatePersonDetails(): PersonDetails {
    let genders = ['Female', 'Male', 'X'];
    return {
        firstName: `autotest-load-${faker.name.firstName()}`,
        lastName: `autotest-load-${faker.name.lastName()}`,
        initials: null,
        gender: faker.random.arrayElement(genders),
        dateOfBirth: faker.date.past().toLocaleString().split(',')[0]
    };
}