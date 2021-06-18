export const insuranceOptions = [
  { name: 'Yes', value: 'Yes' },
  {
    name: 'Yes, but I am unsure if I have coverage for this event.',
    value: 'Unsure'
  },
  { name: 'No', value: 'No' },
  { name: "I don't know", value: 'Unknown' }
];
export const needsOptions = [
  { name: 'Yes', value: 'Yes', apiValue: true },
  { name: 'No', value: 'No', apiValue: false },
  { name: "I'm not sure", value: 'Unsure', apiValue: null }
];
export const referredServiceOptions = [
  { name: 'Inquiry' },
  { name: 'Health Services' },
  { name: 'First Aid' },
  { name: 'Personal Services' },
  { name: 'Child Care' },
  { name: 'Pet Care' }
];
export const radioButtonOptions1 = [
  { name: 'Yes', value: true },
  { name: 'No', value: false }
];
export const deleteMessage =
  'User has been successfully deleted from the ERA Tool.';
export const editMessage = 'User has been edited successfully.';
export const addMessage =
  'Team member has been <b>saved</b> & added successfully.';
export const tier2Notes = 'Notes regarding Tier 2 Supervisor';
export const tier3Notes = 'Notes regarding Tier 3 ESS Director/ Manager';
export const tier1Notes = 'Notes regarding Tier 1 Responder';
export const defaultRole = {
  code: 'Tier1',
  description: 'Tier 1 (Responder)'
};

export const postalPattern = '^[A-Za-z][0-9][A-Za-z][ ]?[0-9][A-Za-z][0-9]$';
export const defaultProvince = { code: 'BC', name: 'British Columbia' };
export const defaultCountry = { code: 'CAN', name: 'Canada' };
export const usDefaultObject = {
  code: 'USA',
  name: 'United States of America'
};
export const zipCodePattern = '^([0-9]{5}-[0-9]{4}|[0-9]{5})$';
export const securityQuestionAnswerPattern = '^[a-zA-Z0-9 ]+$';
export const securityPhrasePattern = securityQuestionAnswerPattern;
export const petsQuantityPattern = '^([1-9][0-9]{0,2})$';

export const gender = [
  { name: 'Male', value: 'Male' },
  { name: 'Female', value: 'Female' },
  { name: 'X', value: 'X' }
];

export const wizardProfileMessage = {
  title: 'Complete all steps',
  text:
    'Please complete all sections of the Evacuee Profile prior to submitting.'
};
export const evacueeProfileCreatedMessage = {
  title: 'Evacuee Profile Saved',
  text: 'Evacuee profile has been successfully created.',
  button: 'Proceed to Step 2'
};
export const wizardESSFileMessage = {
  title: 'Complete all steps',
  text: 'Please complete all sections of the ESS File prior to submitting.'
};
export const essFileCreatedMessage = {
  title: 'ESS File Saved',
  text: 'ESS File has been successfully created.',
  button: 'Proceed to Step 3',
  exitLink: 'Exit Wizard'
};

export const evacueeProfileStepIncompleteMessage =
  'Please <strong>complete the Evacuee Profile</strong> prior to proceeding to the next steps.';
export const essFileStepIncompleteMessage =
  'Please <strong>complete the ESS File</strong> prior to proceeding to the next steps.';
export const stepIncompleteMessage =
  'Please <strong>complete the current step</strong> prior to proceeding to the next steps.';

export const successfulVerification =
  'Evacuee profile has been successfully verified';

// Generic error messages
export const genericError =
  'An error occurred while loading this page. Please refresh and try again.';
export const teamMemberListError =
  'Unable to retrieve team members at this time. Please try again later';
export const activateTeamMemberError =
  'Unable to activate team member at this time. Please try again later';
export const deActivateTeamMemberError =
  'Unable to deactivate team member at this time. Please try again later';
export const usernameCheckerror =
  'Unable to check username at this time. Please try again later';
export const communityListError =
  'Unable to retrieve assigned communities at this time. Please try again later';
export const createRegProfileError =
  'Unable to create evacuee profile at this time. Please try again later';
export const editProfileError =
  'Unable to update your user profile at this time. Please try again later';
export const securityQuestionError =
  'Unable to load security questions. Please try again later';
export const taskSearchError =
  'Unable to retrieve this task number. Please try again later';
export const evacueeSearchError =
  'Unable to complete the search at this time. Please try again later';
