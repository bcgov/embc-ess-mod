import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DialogContent } from '../models/dialog-content.model';

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
  { name: 'Inquiry', value: 'Inquiry' },
  { name: 'Health Services', value: 'Health' },
  { name: 'First Aid', value: 'FirstAid' },
  { name: 'Personal Services', value: 'Personal' },
  { name: 'Child Care', value: 'ChildCare' },
  { name: 'Pet Care', value: 'PetCare' }
];
export const radioButtonOptions1 = [
  { name: 'Yes', value: true },
  { name: 'No', value: false }
];
export const deleteMessage: DialogContent = {
  text: '<p>User has been successfully deleted from the ERA Tool.</p>',
  cancelButton: 'Close'
};
export const editMessage: DialogContent = {
  text: '<p>User has been edited successfully.</p>',
  cancelButton: 'Close'
};
export const addMessage: DialogContent = {
  text: '<p>Team member has been <b>saved</b> & added successfully.</p>',
  cancelButton: 'Close'
};
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

export const wizardProfileMessage: DialogContent = {
  title: 'Complete all steps',
  text:
    '<p>Please complete all sections of the Evacuee Profile prior to submitting.</p>',
  cancelButton: 'Close'
};
export const evacueeProfileCreatedMessage: DialogContent = {
  title: 'Evacuee Profile Saved',
  text: '<p>Evacuee profile has been successfully created.</p>',
  confirmButton: 'Proceed to STEP 2'
};
export const wizardESSFileMessage: DialogContent = {
  title: 'Complete all steps',
  text:
    '<p>Please complete all sections of the ESS File prior to submitting.</p>',
  cancelButton: 'Close'
};
export const essFileCreatedMessage: DialogContent = {
  title: 'ESS File Saved',
  text: '<p>ESS File has been successfully created.</p>',
  confirmButton: 'Proceed to STEP 3',
  exitLink: 'Exit Wizard'
};

export const householdMemberDeleteDialog: DialogContent = {
  text:
    '<p>Are you sure you want to <b>remove</b> this household member from your evacuation file?</p>',
  confirmButton: 'Yes, Remove Household Member',
  cancelButton: 'No, Cancel'
};

export const exitWizardDialog: DialogContent = {
  text:
    '<p>Are you sure you want to exit the wizard?</p><p>Any information that has not been <b>submitted</b> will be lost.</p>',
  confirmButton: 'Yes, Exit Wizard',
  cancelButton: 'No, Cancel'
};

export const evacueeProfileStepIncompleteMessage: DialogContent = {
  text:
    '<p>Please <strong>complete the Evacuee Profile</strong> prior to proceeding to the next steps.</p>',
  cancelButton: 'Close'
};

export const essFileStepIncompleteMessage: DialogContent = {
  text:
    '<p>Please <strong>complete the ESS File</strong> prior to proceeding to the next steps.</p>',
  cancelButton: 'Close'
};
export const stepIncompleteMessage: DialogContent = {
  text:
    '<p>Please <strong>complete the current step</strong> prior to proceeding to the next steps.</p>',
  cancelButton: 'Close'
};

export const successfulVerification: DialogContent = {
  title: 'Profile Successfully Verified',
  text: '<p>Evacuee profile has been successfully verified.</p>',
  cancelButton: 'Close'
};

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
export const createEssFileError =
  'Unable to create ESS file at this time. Please try again later';
export const securityQuestionError =
  'Unable to load security questions. Please try again later';
export const taskSearchError =
  'Unable to retrieve this task number. Please try again later';
export const evacueeSearchError =
  'Unable to complete the search at this time. Please try again later';
