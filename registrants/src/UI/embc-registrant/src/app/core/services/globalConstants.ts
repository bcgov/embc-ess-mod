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

export const deleteMemberInfoBody = {
  body: '<p>Are you sure you want to remove this family member from your evacuation file?</p>',
  buttons: [
    {
      name: 'No, Cancel',
      class: 'button-s',
      function: 'close'
    },
    {
      name: 'Yes, remove this family member',
      class: 'button-p',
      function: 'remove'
    }
  ]
};

export const securityQuesError =
  'An error occurred while loading the security questions. Please try again later';

export const addEssFile: DialogContent = {
  text: 'Add Another Evacuation File'
};
