export interface Address {
  addressLine1: string;
  addressLine2?: null | string;
  jurisdiction: Partial<Jurisdiction>;
  postalCode: string;
  stateProvince: Partial<StateProvince>;
  country: Country;
}

export interface Jurisdiction {
  jurisdictionCode?: null | string;
  jurisdictionName?: null | string;
}

export interface StateProvince {
  stateProvinceCode?: null | string;
  stateProvinceName?: null | string;
}

export interface Country {
  countryCode: string;
  countryName: string;
}
