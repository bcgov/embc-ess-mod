import { Code } from '../api/models';
import { EssTaskModel } from './ess-task.model';
import { EvacuationFileModel } from './evacuation-file.model';
import { RegistrantProfileModel } from './registrant-profile.model';
export interface AppBaseModel {
  selectedEssTask?: EssTaskModel;
  selectedUserPathway?: SelectedPathType;
  evacueeSearchType?: DigitalFlow | PaperFlow;
  selectedProfile?: SelectedProfile;
  selectedEssFile?: EvacuationFileModel;
  supportProperties?: SupportProperties;
}

export interface EvacueeSearch {
  idQuestion?: string;
}

export type DigitalFlow = EvacueeSearch;
// VIEW: If Registrant
// CREATE: HouseholdMember, notMinor, no matching registrant
// LINKING: hOUSEHOLDm, notMinor, 1 or more matching profile
// CANNOTLINK: 1 matching profile with no security questions

export type PaperFlow = EvacueeSearch;
// VIEW: If Registrant and The First Name, Last Name and Date of Birth of the Registrant record match to the values entered in the search fields
//

export interface SelectedProfile {
  selectedEvacueeInContext?: RegistrantProfileModel;
}

export interface EtransferProperties {
  isRegistrantEtransferEligible?: boolean;
  etransferStatus?: ETransferStatus;
  interacAllowed?: boolean; //will come from backend
  etransferRequirement?: Array<EtransferRequirementStatus>;
}

export interface SupportProperties {
  selectedSupport?: Code;
}

export enum SelectedPathType {
  paperBased = 'paperBased',
  digital = 'digital',
  remoteExtensions = 'remoteExtensions'
}

export enum ETransferStatus {
  available = 'available',
  notAllowed = 'notAllowed',
  inEligible = 'ineligible',
  unavailable = 'unavailable'
}

export enum EtransferContent {
  bcServicesCard = 'Profile linked to BC Services Card',
  isNotMinor = 'Evacuee is over 19 years of age',
  acceptTransfer = 'Ability to accept e-Transfer',
  window = '4-hr window to receive money'
}

export class EtransferRequirementStatus {
  statement?: EtransferContent;
  status?: boolean;
}

export enum HouseholdMemberButtons {
  viewProfile = 'view-profile',
  createProfile = 'create-profile',
  linkProfile = 'link-profile',
  cannotLinkProfile = 'cannot-link'
}
