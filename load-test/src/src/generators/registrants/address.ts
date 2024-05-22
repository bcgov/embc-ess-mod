import * as faker from 'faker/locale/en_CA';
import { Address } from '../../api/registrants/models';

export function generateAddress(communities: any[], selfServe: boolean = false): Address {
    if (selfServe) {
        return {
            addressLine1: `275 HORSE LAKE RD`,
            country: "CAN",
            city: '100 MILE HOUSE',
            postalCode: 'V0K 2E0',
            stateProvince: "BC",
        };
    }
    else {
        return {
            addressLine1: `${faker.address.streetAddress()}`,
            country: "CAN",
            community: faker.random.arrayElement(communities)?.value,
            postalCode: faker.address.zipCode(),
            stateProvince: "BC",
        };
    }
}