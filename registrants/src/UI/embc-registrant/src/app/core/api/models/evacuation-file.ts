/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { EvacuationFileStatus } from './evacuation-file-status';
import { NeedsAssessment } from './needs-assessment';

/**
 * Evacuation File
 */
export interface EvacuationFile {
  evacuatedFromAddress: Address;
  evacuationFileDate?: null | string;
  fileId?: null | string;
  isRestricted?: boolean;
  lastModified?: string;
  needsAssessment: NeedsAssessment;
  secretPhrase?: null | string;
  secretPhraseEdited?: boolean;
  status?: EvacuationFileStatus;
}
