import * as faker from 'faker/locale/en_CA';
import { Address } from '../../api/registrants/models';

export function generateAddress(communities: any[]): Address {
    return {
        addressLine1: `1068 SKWLAX SUBDIVISION RD`,
        country: "CAN",
        city: 'SHUSWAP',
        postalCode: 'V0E 1M0',
        stateProvince: "BC",
    };
    // return {
    //     addressLine1: `${faker.address.streetAddress()}`,
    //     country: "CAN",
    //     community: faker.random.arrayElement(communities)?.value,
    //     postalCode: faker.address.zipCode(),
    //     stateProvince: "BC",
    // };
}