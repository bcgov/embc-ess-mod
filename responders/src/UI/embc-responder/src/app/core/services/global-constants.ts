import { DialogContent } from '../models/dialog-content.model';

export const phoneMask = [
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/
];

export const mealRate = {
  total: 45,
  breakfast: 10,
  lunch: 13,
  dinner: 22
};

export const groceriesRate = {
  rate: 22.5
};

export const incidentals = {
  rate: 50
};

export const extremeConditions = {
  rate: 200
};

export const normalConditions = {
  rate: 150
};

export const noOfRooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const supportNoOfDays = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30
];
export const mainApplicant = 'Main Applicant';
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
export const radioButtonOptions = [
  { name: 'Yes', value: 'Yes', apiValue: true },
  { name: 'No', value: 'No', apiValue: false }
];

export const mealRateSheet: DialogContent = {
  title: 'ESS Rate Sheet - Meals',
  text:
    '<div class="row primary"><div class="col-md-2">Breakfast</div><div class="col-md-2 bold">$10</div></div><div class="row primary"><div class="col-md-2">Lunch</div><div class="col-md-2 bold">$13</div></div><div class="row primary"><div class="col-md-2">Dinner</div><div class="col-md-2 bold">$22</div></div><div class="row primary"><div class="col-md-2">Total</div><div class="col-md-2 bold">$45(incl. PST)</div></div><p>NOTE:</p><p>Alcohol, tobacco and gratuities are not eligible expenses</p>',
  cancelButton: 'Close'
};

export const groceriesRateSheet: DialogContent = {
  title: 'ESS Rate Sheet - Groceries',
  text:
    '<p class="primary">Daily rate per person <span class="bold">- $22.50 (incl. GST/PST)</span></p> <p>NOTE:</p><p>Alcohol, tobacco and gratuities are not eligible expenses</p>',
  cancelButton: 'Close'
};

export const incidentalsRateSheet: DialogContent = {
  title: 'ESS Rate Sheet - Incidentals',
  text:
    '<p>To be issued when evacuees have been unable to pack necessities</p><p class="primary">Adults, youth & children -<span>up to $50.00 maximum per person (incl. PST)</span></p><p>NOTE:<p><p>May include miscellaneous items such as personal hygiene products, laundry supplies, pet food and lodging, medication for a 3 day period, and other immediate needs as required. The Emergency Management BC (EMBC) Emergency Coordination Centre must be consulted when extraordinary requirements are needed to provide for immediate needs 1-800-663-3456</p>',
  cancelButton: 'Close'
};

export const clothingRateSheet: DialogContent = {
  title: 'ESS Rate Sheet - Clothing',
  text:
    '<p>To be issued when evacuees have been unable to pack necessities</p><p class="primary">Adults, youth & children -<span class="bold">up to $150.00 maximum per person (incl. PST)*</span></p><p>* Where<span class="bold">extreme winter conditions</span>apply at the time of the incident, and on a needs basis, amount maybe increased to <span class="bold">$200 per person.</span></p><p>NOTE:</p><p>Clothing is provided as needed to preserve health and modesty. This is not wardrobe replacement. Clothing may include footwear or special needs items such as baby diapers.</p>',
  cancelButton: 'Close'
};

export const taxiRateSheet: DialogContent = {
  title: 'ESS Rate Sheet - Transportation',
  text:
    '<p>Transportation necessary to meet immediate needs (e.g. taxis, 3 day bus pass, gasoline)</p>',
  cancelButton: 'Close'
};

export const otherRateSheet: DialogContent = {
  title: 'ESS Rate Sheet - Transportation',
  text:
    '<p>Transportation necessary to meet immediate needs (e.g. taxis, 3 day bus pass, gasoline)</p>',
  cancelButton: 'Close'
};

export const hotelRateSheet: DialogContent = {
  title: 'ESS Rate Sheet - Lodging',
  text:
    '<p class="primary bold">Hotel/Motel/B&B</p><p>Emergency Support Services is eligible for approved Provincial Government Rates from commercial accommodations supplier listed in the Ministry of Labour and Citizens Services Business Travel Accommodation Listing for government travel.</p><p class="bold">Only the cost of the room is covered.</p><p>The evacuee is responsible for all other charges (e.g. video rentals, damages, parking, local and long distance calls).</p>',
  cancelButton: 'Close'
};

export const billetingRateSheet: DialogContent = {
  title: 'ESS Rate Sheet - Lodging',
  text:
    '<p class="primary bold">Billeting in Private Homes</p><p>The referral form for billeting is issued to the billeting host (supplier). Billeting rate does not include meals.</p><p>$30 per night based on single occupancy (add $10 for each additional adult and youth and $5 for each additional child.</p>',
  cancelButton: 'Close'
};

export const voidMessage: DialogContent = {
  text: '<p>Support successfully voided.</p>',
  cancelButton: 'Close'
};

export const deleteDraftMessage: DialogContent = {
  title: 'Delete Support',
  text: '<p>Are you sure you want to delete this support?</p>',
  confirmButton: 'Yes, Delete Support',
  cancelButton: 'No, Cancel'
};

export const saveMessage: DialogContent = {
  text: '<p>Support successfully saved.</p>',
  cancelButton: 'Close'
};

export const supportDeleteMessage: DialogContent = {
  text: '<p>Support successfully deleted.</p>',
  cancelButton: 'Close'
};

export const supportEditMessage: DialogContent = {
  text: '<p>Support successfully updated.</p>',
  cancelButton: 'Close'
};

export const deleteMessage: DialogContent = {
  text: '<p>User has been successfully deleted from ERA.</p>',
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
export const profileLinkMessage: DialogContent = {
  text: '<p>Profile Successfully Linked</p>',
  cancelButton: 'Close'
};
export const profileLinkErrorMessage: DialogContent = {
  text: '<p>Error while linking the profile. Please try again later</p>',
  cancelButton: 'Close'
};
export const essFileLinkMessage: DialogContent = {
  text: '<p>ESS File Successfully Linked</p>',
  cancelButton: 'Close'
};
export const essFileLinkErrorMessage: DialogContent = {
  text: '<p>Error while linking the ESS File. Please try again later</p>',
  cancelButton: 'Close'
};
export const deleteSupplierMessage: DialogContent = {
  text: '<p>Supplier was successfully removed.</p>',
  cancelButton: 'Close'
};
export const editSupplierMessage: DialogContent = {
  text: '<p>Supplier was successfully edited.</p>',
  cancelButton: 'Close'
};
export const addSupplierMessage: DialogContent = {
  text: '<p>Supplier was successfully added.</p>',
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

export const supportDataLossDialog: DialogContent = {
  text:
    '<p>Warning this will result in the current Support data being lost. Do you wish to continue?</p>',
  confirmButton: 'Yes',
  cancelButton: 'No'
};

export const wizardProfileMessage: DialogContent = {
  title: 'Complete all steps',
  text:
    '<p>Please complete all sections of the Evacuee Profile prior to submitting.</p>',
  cancelButton: 'Close'
};
export const wizardESSFileMessage: DialogContent = {
  title: 'Complete all steps',
  text:
    '<p>Please complete all sections of the ESS File prior to submitting.</p>',
  cancelButton: 'Close'
};

export const newRegWizardProfileCreatedMessage: DialogContent = {
  title: 'Evacuee Profile Saved',
  text: '<p>Evacuee profile has been successfully created.</p>',
  confirmButton: 'Proceed to Step 2'
};
export const newRegWizardEssFileCreatedMessage: DialogContent = {
  title: 'ESS File Saved',
  text: '<p>ESS File has been successfully created and saved.</p>',
  confirmButton: 'Proceed to Step 3',
  exitLink: 'Exit Wizard'
};

export const newRegWizardProfileUpdatedMessage: DialogContent = {
  title: 'Evacuee Profile Updated',
  text: '<p>Evacuee profile has been successfully updated.</p>',
  confirmButton: 'Proceed to Step 2'
};

export const editRegWizardProfileCreatedMessage: DialogContent = {
  title: 'Evacuee Profile Saved',
  text: '<p>Evacuee profile has been successfully updated.</p>',
  confirmButton: 'Proceed to Step 2'
};

export const evacueeProfileUpdatedMessage: DialogContent = {
  title: 'Evacuee Profile Updated',
  text: '<p>Evacuee profile has been successfully updated.</p>',
  cancelButton: 'Close'
};

export const memberProfileCreateMessage: DialogContent = {
  title: 'Profile Created Successfully',
  text: '<p>Evacuee profile has been successfully created.</p>',
  cancelButton: 'Close'
};

export const petDeleteDialog: DialogContent = {
  title: 'Remove Pet',
  text:
    '<p>Are you sure you want to remove this pet from your ESS file?</p>',
  confirmButton: 'Yes, Remove Pet',
  cancelButton: 'No, Cancel'
};

export const householdMemberDeleteDialog: DialogContent = {
  title: 'Remove Household Member',
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

export const supportIncompleteMessage: DialogContent = {
  text:
    '<p>Please process the <strong>DRAFT</strong> Supports prior to accessing this step.</p>',
  cancelButton: 'Close'
};

export const supportInProgressMessage: DialogContent = {
  text:
    '<p><span class="bold field-error">WARNING: </span>You have a Support that has not been completed. This record will be lost if you continue. Do you wish to continue?</p>',
  confirmButton: 'Yes',
  cancelButton: 'No, Cancel'
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

export const verifyEvacueeProfile: DialogContent = {
  subtitle: 'Verify Evacuee Profile',
  text:
    '<div class="row"><div class="col-md-12"><p id="verified-radio-group-label" class="bold">To verify this profile please confirm that you have seen government issue identification for this evacuee.</p></div></div>',
  cancelButton: 'Cancel',
  confirmButton: 'Verify Profile'
};

export const unlockFieldsProfile: DialogContent = {
  subtitle: 'Edit Evacuee Details',
  text:
    '<div class="row"><div class="col-md-12"><p id="verified-radio-group-label" class="bold">To unlock these fields, please confirm that you have seen government issue identification to support these changes.</p></div></div>',
  cancelButton: 'Cancel',
  confirmButton: 'Unlock'
};

export const dashboardViewProfile: DialogContent = {
  subtitle: 'Identify Verification',
  text:
    '<div class="row"><div class="col-md-12"><p id="verified-radio-group-label" class="bold">Did you see government issued identification from this individual?</p></div></div>',
  cancelButton: 'Cancel',
  confirmButton: 'Next'
};

export const hideNote: DialogContent = {
  title: '<p class="dialog-title">Hide Case Note<p>',
  text:
    '<div class="row"><div class="col-md-12"><p>Are you sure you want to hide this Case Note?</p><p>Hidden Case Notes will only be viewed by Director/Manager tier and above.</p></div></div>',
  cancelButton: 'No, Cancel',
  confirmButton: 'Yes, Hide Note'
};

export const showNote: DialogContent = {
  title: '<p class="dialog-title">Show Case Note<p>',
  text:
    '<div class="row"><div class="col-md-12"><p>Are you sure you want to show this Case Note?</p><p>This Case Note can now be viewed by all ERA responders.</p></div></div>',
  cancelButton: 'No, Cancel',
  confirmButton: 'Yes, Show Note'
};

export const deleteSupplierFromList: DialogContent = {
  title: 'Remove Supplier from Supplier List',
  text:
    '<p>Are you sure you want to remove this supplier from your supplier list? Any ESS Teams who have this supplier on their list due to a mutual aid agreement will also have this supplier removed from their list.</p>',
  cancelButton: 'No, Cancel',
  confirmButton: 'Yes, Remove Supplier'
};

export const rescindSupplierFromList: DialogContent = {
  title: 'Rescind',
  text:
    '<p>Are you sure you want to permanently remove this ESS Team?</p><p>They will no longer have access to use this supplier.</p>',
  cancelButton: 'No, Cancel',
  confirmButton: 'Yes, Remove ESS Team'
};

export const supplierStatusDefinition: DialogContent = {
  title: 'Status Definitions',
  text:
    '<p class="green-info"><b>Active</b></p><p>ACTIVE suppliers will appear in your supplier list for responders to use during referral creation.</p><p class="red-alert"><b>Deactivated</b></p><p>DEACTIVATED suppliers will NOT appear in your supplier list for responders to use during referral creation</p><p><b>Status changes affect your ESS Team, as well as any ESS Teams connected to your supplier via a mutual aid agreement.</b></p>',
  cancelButton: 'Close'
};

export const systemError =
  'The service is temporarily unavailable. Please try again later';
export const accessError = 'Access Denied';
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
export const editEssFileError =
  'Unable to update the ESS file at this time. Please try again later';
export const securityQuestionError =
  'Unable to load security questions. Please try again later';
export const taskSearchError =
  'Unable to retrieve this task number. Please try again later';
export const evacueeSearchError =
  'Unable to complete the search at this time. Please try again later';
export const notesListError =
  'Unable to retrieve notes at this time. Please try again later';
export const addNotesError =
  'Unable to add notes at this time. Please try again later';
export const hideNoteError =
  'Unable to hide note at this time. Please try again later';
export const showNoteError =
  'Unable to show note at this time. Please try again later';
export const editNotesError =
  'Unable to edit note at this time. Please try again later';
export const verifyRegistrantProfileError =
  'Unable to verify the Registrant Profile at this time. Please try again later';
export const getProfileEssFilesError =
  'Unable to verify get the ESS Files associated to the registrant at this time. Please try again later';
export const getPossibleEssfileMatchError =
  'Unable to get possible ESS Files associated to the registrant at this time. Please try again later';
export const fileDashboardError =
  'Unable to load ESS File at this time. Please try again later';
export const supplierCheckerror =
  'Unable to check supplier at this time. Please try again later';
export const mainSuppliersListError =
  'Unable to retrieve suppliers list at this time. Please try again later';
export const mutualAidListError =
  'Unable to retrieve mutual aid suppliers list at this time. Please try again later';
export const activateSupplierError =
  'Unable to activate supplier at this time. Please try again later';
export const deActivateSupplierError =
  'Unable to deactivate supplier at this time. Please try again later';
export const supplierRefresherror =
  'Unable to refresh supplier list at this time. Please try again later';
export const supportListerror =
  'Unable to retrieve support list at this time. Please try again later';
export const supportNeedsAssessmentError =
  'Unable to retrieve needs assessment at this time. Please try again later';
