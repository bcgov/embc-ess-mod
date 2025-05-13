/* tslint:disable */

import { TabModel } from './tab.model';
import { WizardSidenavModel } from './wizard-sidenav.model';

/* eslint-disable */
export enum WizardType {
  NewRegistration = 'new-registration',
  EditRegistration = 'edit-registration',
  NewEssFile = 'new-ess-file',
  MemberRegistration = 'member-registration',
  ReviewFile = 'review-file',
  CompleteFile = 'complete-file',
  ExtendSupports = 'extend-supports',
  CaseNotes = 'case-notes'
}

export interface WizardProperties {
  wizardType?: string;
  exitLink?: string;
  lastCompletedStep?: string;
  editFlag?: boolean;
  memberFlag?: boolean;
  evacueeDetailTipText?: string;
  memberTipText?: string;
  profileTabs?: Array<TabModel>;
  essFileTabs?: Array<TabModel>;
  wizardMenu?: WizardSidenavModel[];
}

export enum WizardExitMap {
  SearchPage = '/responder-access/search/evacuee',
  ProfileDashboard = '/responder-access/search/evacuee-profile-dashboard',
  FileDashoard = '/responder-access/search/essfile-dashboard'
}

export enum WizardSteps {
  Step1 = 'STEP 1',
  Step2 = 'STEP 2',
  Step3 = 'STEP 3',
  Step4 = 'STEP 4'
}
