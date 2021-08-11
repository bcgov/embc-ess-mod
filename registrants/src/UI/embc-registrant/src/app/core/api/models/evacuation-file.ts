/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { EvacuationFileStatus } from './evacuation-file-status';
import { NeedsAssessment } from './needs-assessment';

/**
 * Evacuation File
 */
export interface EvacuationFile {
  essFileNumber?: null | string;
  evacuatedFromAddress: Address;
  evacuationFileDate?: null | string;
  isRestricted?: boolean;
  lastModified?: string;
  needsAssessments?: Array<NeedsAssessment>;
  secretPhrase?: null | string;
  secretPhraseEdited?: boolean;
  status?: EvacuationFileStatus;
}
