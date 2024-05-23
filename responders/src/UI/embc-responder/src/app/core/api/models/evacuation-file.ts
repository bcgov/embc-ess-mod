/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { EvacuationFileHouseholdMember } from '../models/evacuation-file-household-member';
import { EvacuationFileStatus } from '../models/evacuation-file-status';
import { EvacuationFileTask } from '../models/evacuation-file-task';
import { NeedsAssessment } from '../models/needs-assessment';
import { Note } from '../models/note';
import { Support } from '../models/support';

/**
 * Evacuation File
 */
export interface EvacuationFile {
  completedBy?: string | null;
  completedOn?: string | null;
  evacuatedFromAddress: Address;
  evacuationFileDate?: string | null;
  householdMembers?: Array<EvacuationFileHouseholdMember>;
  id?: string | null;
  isPaper?: boolean | null;
  isRestricted?: boolean | null;
  manualFileId?: string | null;
  needsAssessment: NeedsAssessment;
  notes?: Array<Note>;
  primaryRegistrantFirstName?: string | null;
  primaryRegistrantId: string;
  primaryRegistrantLastName?: string | null;
  registrationLocation: string;
  securityPhrase?: string | null;
  securityPhraseEdited?: boolean | null;
  status?: EvacuationFileStatus | null;
  supports?: Array<Support>;
  task: EvacuationFileTask;
}
