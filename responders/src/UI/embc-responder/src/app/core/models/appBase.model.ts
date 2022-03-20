export class AppBaseModel {
  //TODO: convert to service
  taskStatus?: string;
  allowDigitalFiling?: boolean;
  allowPaperFiling?: boolean;
  allowRemoteExtensions?: boolean;
  selectedUserPathway?: SelectedPathType;
}

export enum SelectedPathType {
  PaperBased = 'paperBased',
  Digital = 'digital',
  RemoteExtensions = 'remoteExtensions'
}

export enum ETransferStatus {
  Available = 'available',
  NotAllowed = 'notAllowed',
  InEligible = 'ineligible',
  Unavailable = 'unavailable'
}

export enum EtransferContent {
  BCServicesCard = 'Profile linked to BC Services Card',
  IsNotMinor = 'Evacuee is over 19 years of age',
  AcceptTransfer = 'Ability to accept e-Transfer',
  Window = '4-hr window to receive money'
}

export class EtransferRequirementStatus {
  statement?: EtransferContent;
  status?: boolean;
}
