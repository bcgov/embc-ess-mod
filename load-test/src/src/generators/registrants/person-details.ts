import * as faker from 'faker/locale/en_CA';
import { PersonDetails } from '../../api/registrants/models';
import { getDaysInMonth } from '../../utilities';

// @ts-ignore
import { MAX_VU, MAX_ITER } from '../../../load-test.parameters-APP_TARGET';

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

    let curr_vu = __VU - 1; //VU's begin at 1, not 0
    curr_vu = (curr_vu % MAX_VU) + 1;
    let curr_iter = __ITER % MAX_ITER;

    return {
        firstName: `autotest-load-${curr_vu}`,
        lastName: `autotest-load-${curr_iter}`,
        initials: null,
        gender: genders[__ITER % 3],
        dateOfBirth: dob
    };
}