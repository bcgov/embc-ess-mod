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
  evacuatedFromAddress: Address;
  evacuationFileDate?: null | string;
  householdMembers?: null | Array<EvacuationFileHouseholdMember>;
  id?: null | string;
  isRestricted?: null | boolean;
  needsAssessment: NeedsAssessment;
  primaryRegistrantId: string;
  registrationLocation: string;
  securityPhrase?: null | string;
  securityPhraseEdited?: boolean;
  status?: null | EvacuationFileStatus;
  task: EvacuationFileTask;
}
