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
  evacuatedFromAddress: Address;
  evacuationFileDate?: null | string;
  householdMembers?: Array<EvacuationFileHouseholdMember>;
  id?: null | string;
  isRestricted?: null | boolean;
  needsAssessment: NeedsAssessment;
  notes?: Array<Note>;
  paperFileNumber?: null | string;
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
