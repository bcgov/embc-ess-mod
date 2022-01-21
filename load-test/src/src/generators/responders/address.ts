import * as faker from 'faker/locale/en_CA';
import { Address } from '../../api/responders/models';

export function generateAddress(communities: any[]): Address {
    return {
        addressLine1: `${faker.address.streetAddress()}`,
        countryCode: "CAN",
        communityCode: faker.random.arrayElement(communities)?.value,
        postalCode: faker.address.zipCode(),
        stateProvinceCode: "BC",
    };
}