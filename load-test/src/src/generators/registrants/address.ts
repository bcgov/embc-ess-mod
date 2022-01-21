import * as faker from 'faker/locale/en_CA';
import { Address } from '../../api/registrants/models';

export function generateAddress(communities: any[]): Address {
    return {
        addressLine1: `${faker.address.streetAddress()}`,
        country: "CAN",
        community: faker.random.arrayElement(communities)?.value,
        postalCode: faker.address.zipCode(),
        stateProvince: "BC",
    };
}