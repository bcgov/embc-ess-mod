import * as faker from 'faker/locale/en_CA';
import { PersonDetails } from '../../api/responders/models';
import { getDaysInMonth } from '../../utilities';

export function generateNewPersonDetails(): PersonDetails {
    let genders = ['Female', 'Male', 'X'];
    return {
        firstName: `autotest-load-${faker.name.firstName()}`,
        lastName: `autotest-load-${faker.name.lastName()}`,
        initials: null,
        gender: faker.random.arrayElement(genders),
        dateOfBirth: faker.date.past().toLocaleString().split(',')[0]
    };
}

/** Generates consistent person details for the current vu and interation */
export function getPersonDetailsForIteration(): PersonDetails {
    let genders = ['Female', 'Male', 'X'];
    let month = (__VU % 12) + 1;
    let year = 1900 + (__ITER % 99);
    let maxDay = getDaysInMonth(month, year);
    let day = (__ITER % maxDay) + 1;
    let dob = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

    return {
        firstName: `autotest-load-${__VU.toString().padStart(3, '0')}`,
        lastName: `autotest-load-${__ITER.toString().padStart(3, '0')}`,
        initials: null,
        gender: genders[__ITER % 3],
        dateOfBirth: dob
    };
}