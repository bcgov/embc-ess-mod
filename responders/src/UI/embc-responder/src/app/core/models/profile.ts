// Temporary
export interface Profile {
  contactDetails: ContactDetails;
  id?: null | string;
  isMailingAddressSameAsPrimaryAddress?: boolean;
  mailingAddress?: null | Address;
  personalDetails: PersonDetails;
  primaryAddress: Address;
  restrictedAccess?: boolean;
  //secretPhrase?: null | string;
}

export interface ContactDetails {
  email?: null | string;
  hideEmailRequired?: boolean;
  hidePhoneRequired?: boolean;
  phone?: null | string;
}

export interface Address {
  addressLine1: string;
  addressLine2?: null | string;
  community?: null | string;
  country: string;
  jurisdiction: string;
  postalCode?: null | string;
  stateProvince?: null | string;
}

export interface PersonDetails {
  dateOfBirth: string;
  firstName: string;
  gender: string;
  initials?: null | string;
  lastName: string;
  preferredName?: null | string;
}

export interface SecurityQuestions {
  question1?: null | string;
  answer1?: null | string;
  question2?: null | string;
  answer2?: null | string;
  question3?: null | string;
  answer3?: null | string;
}