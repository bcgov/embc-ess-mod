export interface RegAddress {
  addressLine1: string;
  addressLine2?: null | string;
  community?: Community | string;
  postalCode: null | string;
  stateProvince: StateProvince;
  country: Country;
}

export interface Community {
  code?: null | string;
  name?: null | string;
}

export interface StateProvince {
  code?: null | string;
  name?: null | string;
}

export interface Country {
  code?: string;
  name?: string;
}
