import { Code } from '../api/models';
import { EssTaskModel } from './ess-task.model';
import { EvacuationFileModel } from './evacuation-file.model';
import { RegistrantProfileModel } from './registrant-profile.model';

export interface AppBaseModel {
  selectedEssTask?: EssTaskModel;
  selectedUserPathway?: SelectedPathType;
  evacueeSearchType?: DigitalFlow | PaperFlow;
  selectedProfile?: SelectedProfile;
  etransferProperties?: EtransferProperties;
  selectedEssFile?: EvacuationFileModel;
  supportProperties?: SupportProperties;
}

export interface EvacueeSearch {
  idQuestion: string;
}

export type DigitalFlow = EvacueeSearch;

export type PaperFlow = EvacueeSearch;

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
