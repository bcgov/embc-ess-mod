import { DialogContent } from '../model/dialog-content.model';

export const datePattern =
  '^(0[1-9]|1[0-2])/([1-9]|[1-2][0-9]|3[0-1])/[0-9]{4}$';
export const postalPattern = '^[A-Za-z][0-9][A-Za-z][ ]?[0-9][A-Za-z][0-9]$';
export const defaultProvince = { code: 'BC', name: 'British Columbia' };
export const defaultCountry = { code: 'CAN', name: 'Canada' };
export const usDefaultObject = {
  code: 'USA',
  name: 'United States of America'
};
export const zipCodePattern = '^([0-9]{5}-[0-9]{4}|[0-9]{5})$';
export const petsQuantityPattern = '^([1-9][0-9]{0,2})$';

export const booleanOptions = [
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

export const deleteMemberInfoBody: DialogContent = {
  text: '<p>Are you sure you want to remove this household member from your Emergency Support Services (ESS) file?</p>',
  cancelButton: 'No, Cancel',
  confirmButton: 'Yes, remove this household member'
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

export const needsShelterAllowanceMessage: DialogContent = {
  title: 'Shelter',
  text: '<p>A shelter allowance of $30 per night based on single occupancy ($10 for each additional adult and youth, and $5 for each child).</p></br><p>The shelter allowance can be provided to eligible evacuees via e-Transfer.</p>',
};

export const needsShelterReferralMessage: DialogContent = {
  title: 'Referrals',
  text: '<p>A paper form provided by an ESS responder, directing evacuated individuals to specific suppliers or facilities for essential needs like food, shelter, clothing, or other necessary items during the evacuation.</p>',
};

export const needsIncidentalMessage: DialogContent = {
  title: 'Incidentals',
  text: '<p>Incidentals could include miscellaneous items such as personal hygiene products such as toothpaste, laundry soap and/or pet food.</p>',
};

export const securityQuesError =
  'An error occurred while loading the security questions. Please try again later';
export const systemError =
  'The service is temporarily unavailable. Please try again later';
export const profileExistError = 'User profile does not exist.';
export const editProfileError =
  'Unable to update profile at this time. Please try again later';
export const editNeedsError =
  'Unable to update needs assessment at this time. Please try again later';
export const saveProfileError =
  'Unable to save profile at this time. Please try again later';
export const getProfileError =
  'Unable to retrieve profile at this time. Please try again later';
export const submissionError =
  'Unable to submit request at this time. Please try again later';
export const genericError =
  'An error occurred while loading this page. Please refresh and try again.';
export const currentEvacError =
  'Unable to retrieve current evacuations at this time. Please try again later';
export const pastEvacError =
  'Unable to retrieve past evacuations at this time. Please try again later';
export const bcscInviteError =
  'Unable to send BC Services Card invitation at this time. Please try again later';
export const supportCategoryListError =
  'Unable to retrieve support categories at this time. Please try again later';
export const supportStatusListError =
  'Unable to retrieve support status at this time. Please try again later';
