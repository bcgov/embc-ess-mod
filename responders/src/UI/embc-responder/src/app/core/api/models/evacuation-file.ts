/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { EvacuationFileHouseholdMember } from './evacuation-file-household-member';
import { EvacuationFileStatus } from './evacuation-file-status';
import { EvacuationFileTask } from './evacuation-file-task';
import { NeedsAssessment } from './needs-assessment';

/**
 * Evacuation File
 */
export interface EvacuationFile {
  essFileNumber?: null | string;
  evacuatedFromAddress: Address;
  evacuationFileDate?: null | string;
  householdMembers?: null | Array<EvacuationFileHouseholdMember>;
  isRestricted?: boolean;
  lastNeedsAssessment: NeedsAssessment;
  needsAssessments?: null | Array<NeedsAssessment>;
  primaryRegistrantId?: null | string;
  registrationLocation?: null | string;
  securityPhrase?: null | string;
  securityPhraseEdited?: boolean;
  status?: EvacuationFileStatus;
  task: EvacuationFileTask;
}
