export const datePattern = '^(0[1-9]|1[0-2])\/([1-9]|[1-2][0-9]|3[0-1])\/[0-9]{4}$';
export const postalPattern = '^[A-Za-z][0-9][A-Za-z][ ]?[0-9][A-Za-z][0-9]$';
export const defaultProvince = { code: 'BC', name: 'British Columbia' };
export const defaultCountry = { code: 'CAN', name: 'Canada' };
export const usDefaultObject = { code: 'USA', name: 'United States of America' };
export const zipCodePattern = '^([0-9]{5}-[0-9]{4}|[0-9]{5})$';
export const radioButton1 = [
  { name: 'Yes', value: true },
  { name: 'No', value: false }
];

export const noticeBody = {
  body: 'To register with the Evacuee Registration & Assistance (ERA) tool, you must select \'I agree\'.',
  buttons:
    [
      {
        name: 'Close',
        class: 'button-p',
        function: 'close'
      }
    ]
};

export const gender = [
  { name: 'Male', value: 'M' },
  { name: 'Female', value: 'F' },
  { name: 'X', value: 'X' }
];
