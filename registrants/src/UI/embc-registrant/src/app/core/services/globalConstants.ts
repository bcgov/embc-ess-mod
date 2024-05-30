import { IMask, IMaskFactory } from 'angular-imask';
import { DialogContent } from '../model/dialog-content.model';

export const datePattern = '^(0[1-9]|1[0-2])/([1-9]|[1-2][0-9]|3[0-1])/[0-9]{4}$';
export const postalPattern = '^[A-Za-z][0-9][A-Za-z][ ]?[0-9][A-Za-z][0-9]$';
export const defaultProvince = { code: 'BC', name: 'British Columbia' };
export const defaultCountry = { code: 'CAN', name: 'Canada' };
export const usDefaultObject = {
  code: 'USA',
  name: 'United States of America'
};
export const zipCodePattern = '^([0-9]{5}-[0-9]{4}|[0-9]{5})$';
export const petsQuantityPattern = '^([1-9][0-9]{0,2})$';

export const radioButton1 = [
  { name: 'Yes', value: true },
  { name: 'No', value: false }
];

export const insuranceOptions = [
  { name: 'Yes', value: 'Yes' },
  {
    name: 'Unsure',
    value: 'Yes, but I am unsure if I have coverage for this event.'
  },
  { name: 'No', value: 'No' },
  { name: 'Unknown', value: "I don't know" }
];

export const gender = [
  { name: 'Male', value: 'Male' },
  { name: 'Female', value: 'Female' },
  { name: 'X', value: 'X' }
];
export enum ShelterType {
  referral = 'Referral',
  allowance = 'Allowance'
}

export const deleteMemberInfoBody: DialogContent = {
  text: '<p>Are you sure you want to remove this household member from your Emergency Support Services (ESS) file?</p>',
  cancelButton: 'No, Cancel',
  confirmButton: 'Yes, remove this household member'
};

export const deletePetInfoBody: DialogContent = {
  text: '<p>Are you sure you want to remove this pet from your Emergency Support Services (ESS) file?</p>',
  cancelButton: 'No, Cancel',
  confirmButton: 'Yes, remove pet'
};

export const addEssFile: DialogContent = {
  text: 'Add Another Evacuation File'
};

export const newEssFile: DialogContent = {
  text: 'Submission Complete'
};

export const invalidGoBack: DialogContent = {
  text: '<p>The Go Back action is disabled on this page</p>',
  cancelButton: 'Close'
};

export const successfulBcscInvite: DialogContent = {
  text: '<p>Email successfully sent.</p>',
  cancelButton: 'Close'
};

export const shelterAllowanceNeedDialog: DialogContent = {
  title: 'Shelter',
  text: 'A shelter allowance of $200 per night for your household.<br/><br/>The shelter allowance can be provided to eligible evacuees via e-Transfer.'
};

export const shelterReferralNeedDialog: DialogContent = {
  title: 'Referrals',
  text: 'Provided by an ESS responder to direct evacuated individuals to specific suppliers or facilities for essential needs like food, shelter, clothing, or other necessary items during the evacuation.'
};

export const incidentalsNeedDialog: DialogContent = {
  title: 'Incidentals',
  text: 'Incidentals could include items such as personal hygiene products like toothpaste, laundry soap and/or pet food.'
};

export const interacETransferDialog: DialogContent = {
  title: 'Interac e-Transfer',
  text: 'Please Note: While the majority of transfers are processed immediately, there are instances where processing delays may occur.'
};

export const interacOptOut: DialogContent = {
  title: 'Referrals',
  text: 'Provided by an ESS responder to direct evacuated individuals to specific suppliers or facilities for essential needs like food, shelter, clothing, or other necessary items during the evacuation.'
};

export const duplicateHouseholdMemberWarning: DialogContent = {
  title: 'Duplicate Household Member Detected',
  text: 'It looks like the member you are trying to add already exists in your household. Please review the existing members before proceeding.',
  cancelButton: 'Close'
};

export const securityQuesError = 'An error occurred while loading the security questions. Please try again later';
export const systemError = 'The service is temporarily unavailable. Please try again later';
export const profileExistError = 'User profile does not exist.';
export const editProfileError = 'Unable to update profile at this time. Please try again later';
export const editNeedsError = 'Unable to update needs assessment at this time. Please try again later';
export const saveProfileError = 'Unable to save profile at this time. Please try again later';
export const getProfileError = 'Unable to retrieve profile at this time. Please try again later';
export const submissionError = 'Unable to submit request at this time. Please try again later';
export const genericError = 'An error occurred while loading this page. Please refresh and try again.';
export const currentEvacError = 'Unable to retrieve current evacuations at this time. Please try again later';
export const pastEvacError = 'Unable to retrieve past evacuations at this time. Please try again later';
export const bcscInviteError = 'Unable to send BC Services Card invitation at this time. Please try again later';
export const supportCategoryListError = 'Unable to retrieve support categories at this time. Please try again later';
export const supportStatusListError = 'Unable to retrieve support status at this time. Please try again later';

export const DateMask: Parameters<IMaskFactory['create']>[1] = {
  mask: 'mm/dd/yyyy',
  lazy: false,
  blocks: {
    yyyy: {
      mask: IMask.MaskedRange,
      placeholderChar: 'y',
      from: 1900,
      to: 2999
    },
    mm: {
      mask: IMask.MaskedRange,
      placeholderChar: 'm',
      from: 1,
      to: 12
    },
    dd: {
      mask: IMask.MaskedRange,
      placeholderChar: 'd',
      from: 1,
      to: 31
    }
  }
};
