/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { NeedsAssessment } from './needs-assessment';

/**
 * Evacuation File
 */
export interface EvacuationFile {
  essFileNumber?: null | string;
  evacuatedFromAddress: Address;
  evacuationFileDate?: null | string;
  isRestricted?: boolean;
  needsAssessments: Array<NeedsAssessment>;
}
