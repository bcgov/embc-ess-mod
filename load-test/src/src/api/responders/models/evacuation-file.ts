/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { EvacuationFileHouseholdMember } from './evacuation-file-household-member';
import { EvacuationFileStatus } from './evacuation-file-status';
import { EvacuationFileTask } from './evacuation-file-task';
import { NeedsAssessment } from './needs-assessment';
import { Note } from './note';
import { Support } from './support';

/**
 * Evacuation File
 */
export interface EvacuationFile {
  completedBy?: null | string;
  completedOn?: null | string;
  evacuatedFromAddress: Address;
  evacuationFileDate?: null | string;
  householdMembers?: Array<EvacuationFileHouseholdMember>;
  id?: null | string;
  isPaper?: null | boolean;
  isRestricted?: null | boolean;
  manualFileId?: null | string;
  needsAssessment: NeedsAssessment;
  notes?: Array<Note>;
  primaryRegistrantFirstName?: null | string;
  primaryRegistrantId: string;
  primaryRegistrantLastName?: null | string;
  registrationLocation: string;
  securityPhrase?: null | string;
  securityPhraseEdited?: null | boolean;
  status?: null | EvacuationFileStatus;
  supports?: Array<Support>;
  task: EvacuationFileTask;
}
