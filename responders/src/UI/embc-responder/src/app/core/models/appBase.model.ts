import { EssTaskModel } from './ess-task.model';
import { RegistrantProfileModel } from './registrant-profile.model';

export interface AppBaseModel {
  selectedEssTask?: EssTaskModel;
  selectedUserPathway?: SelectedPathType;
  evacueeSearchType?: DigitalFlow | PaperFlow;
  selectedProfile?: SelectedProfile;
}

export interface EvacueeSearch {
  idQuestion: string;
}

export interface DigitalFlow extends EvacueeSearch {}

export interface PaperFlow extends EvacueeSearch {}

export interface SelectedProfile {
  selectedEvacueeInContext?: RegistrantProfileModel;
  features?: [];
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
