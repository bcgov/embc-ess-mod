export interface EvacueeSearchContextModel {
  hasShownIdentification?: boolean;
  evacueeSearchParameters?: EvacueeDetailsModel;
}

export class EvacueeDetailsModel {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  paperFileNumber?: string;
  essFileNumber?: string;
}
