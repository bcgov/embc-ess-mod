export const defaultProvince = { code: 'BC', name: 'British Columbia' };
export const insuranceOptions = [
  { name: 'Yes', value: 'Yes' },
  { name: 'Unsure', value: 'Yes, but I am unsure if I have coverage for this event.' },
  { name: 'No', value: 'No' },
  { name: 'Unknown', value: 'I don\'t know' }
];
export const referredServiceOptions = [
  {name: 'Inquiry'},
  {name: 'Health Services'},
  {name: 'First Aid'},
  {name: 'Personal Services'},
  {name: 'Child Care'},
  {name: 'Pet Care'},
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
export const wizardProfileMessage =
  'Please complete all sections of the Evacuee Profile prior to submitting.';
export const wizardESSFileMessage =
  'Please complete all sections of the ESS File prior to submitting.';
export const lockedStepMessage =
  'Please complete the ESS File prior to proceeding to the next steps.';

// Generic error messages
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
export const editProfileError =
  'Unable to update your user profile at this time. Please try again later';
