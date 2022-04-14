/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { EvacuationFileStatus } from './evacuation-file-status';
import { NeedsAssessment } from './needs-assessment';
import { Support } from './support';

/**
 * Evacuation File
 */
export interface EvacuationFile {
  completedBy?: null | string;
  completedOn?: null | string;
  evacuatedFromAddress: Address;
  evacuationFileDate?: null | string;
  fileId?: null | string;
  isPaper?: null | boolean;
  isRestricted?: null | boolean;
  lastModified?: string;
  manualFileId?: null | string;
  needsAssessment: NeedsAssessment;
  secretPhrase?: null | string;
  secretPhraseEdited?: null | boolean;
  status?: EvacuationFileStatus;
  supports?: Array<Support>;
}
