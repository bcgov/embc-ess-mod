export interface RegAddress {
  addressLine1: string;
  addressLine2?: null | string;
  jurisdiction: Partial<Jurisdiction>;
  postalCode: null | string;
  stateProvince: Partial<StateProvince>;
  country: Country;
}

export interface Jurisdiction {
  code?: null | string;
  name?: null | string;
}

export interface StateProvince {
  code?: null | string;
  name?: null | string;
}

export interface Country {
  code: string;
  name: string;
}
