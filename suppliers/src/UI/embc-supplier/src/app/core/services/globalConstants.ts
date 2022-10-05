export const referralList: any = [
  { id: 1, name: '1' },
  { id: 2, name: '2' },
  { id: 3, name: '3' },
  { id: 4, name: '4' },
  { id: 5, name: '5' }
];

export const captchaErr = 'Please complete the captcha above.';
export const appSubmitErr =
  'The service is temporarily unavailable. Please try again later.';
export const showInvoiceMsg =
  '<p>You are about to <b>clear all receipt information</b>.</p><p>Are you sure you want to do this?</p>';
export const showInvoiceButton = 'Yes, Clear receipt information';
export const showRefferalMsg =
  '<p>You are about to <b>clear all invoice information</b>.</p><p>Are you sure you want to do this?</p>';
export const showReferalButton = 'Yes, Clear invoice information';
export const deleteRefferalMsg =
  '<p>Are you sure you want to <b>remove this referral?</b></p><p>You will lose all the information you have entered.</p>';
export const deleteReferalButton = 'Yes, Remove this Referral';
export const deleteInvoiceMsg =
  '<p>Are you sure you want to <b>remove this invoice?</b></p><p>You will lose all the information you have entered.</p>';
export const deleteInvoiceButton = 'Yes, Remove this Invoice';
export const deleteReceiptsMsg =
  '<p>Are you sure you want to <b>remove this receipt?</b></p><p>You will lose all the information you have entered.</p>';
export const deleteReceiptButton = 'Yes, Remove this Receipt';
export const postalPattern = '^[A-Za-z][0-9][A-Za-z][ ]?[0-9][A-Za-z][0-9]$';
export const defaultProvince = { code: 'BC', name: 'British Columbia' };
export const defaultCountry = { code: 'CAN', name: 'Canada' };
export const zipCodePattern = '^([0-9]{5}-[0-9]{4}|[0-9]{5})$'; // '^([0-9]{5})(?:[-\s]*([0-9]{4}))?$';
export const usDefaultObject = {
  code: 'USA',
  name: 'United States of America'
};
export const allowedFileTypes = [
  'application/pdf',
  'image/jpg',
  'image/jpeg',
  'image/png'
];
export const zeroFileMessage = 'Attachment file size must be greater than 0Kb';
export const fileTypeMessage = 'File type pdf, jpg, jpeg, png allowed';
export const datePattern =
  '^([1-9]|1[0-2])/([1-9]|[1-2][0-9]|3[0-1])/[0-9]{4}$';
export const fileNameFormat = /^[\w,\s-_()]+\.[A-Za-z]{3,4}$/;
export const invalidFileNameMessage =
  'File name must not contain the following characters: ~ " . # % & * : < > ? /  { | }. Leading and trailing spaces are not allowed.';
