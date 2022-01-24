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
  evacuatedFromAddress: Address;
  evacuationFileDate?: null | string;
  externalReferenceId?: null | string;
  fileId?: null | string;
  isRestricted?: null | boolean;
  lastModified?: string;
  needsAssessment: NeedsAssessment;
  secretPhrase?: null | string;
  secretPhraseEdited?: null | boolean;
  status?: EvacuationFileStatus;
  supports?: Array<Support>;
}
