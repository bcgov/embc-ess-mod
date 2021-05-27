// Temporary

import { Address, PersonDetails } from '../api/models';

export interface EvacuationFile {
  essFileNumber?: null | string;
  evacuatedFromAddress: Address;
  evacuationFileDate?: null | string;
  isRestricted?: boolean;
  needsAssessments: Array<NeedsAssessment>;
}

export interface HouseholdMember {
  details?: null | PersonDetails;
  id?: null | string;
  isUnder19?: boolean;
}

export interface Pet {
  quantity?: null | string;
  type?: null | string;
}

export enum NeedsAssessmentType {
  preliminary = 'preliminary',
  assessed = 'assessed'
}

export enum InsuranceOption {
  no = 'no',
  yes = 'yes',
  unsure = 'unsure',
  unknown = 'unknown'
}

export interface NeedsAssessment {
  canEvacueeProvideClothing?: null | boolean;
  canEvacueeProvideFood?: null | boolean;
  canEvacueeProvideIncidentals?: null | boolean;
  canEvacueeProvideLodging?: null | boolean;
  canEvacueeProvideTransportation?: null | boolean;
  hasPetsFood?: null | boolean;
  haveMedication?: boolean;
  haveSpecialDiet?: boolean;
  householdMembers?: null | Array<HouseholdMember>;
  id?: null | string;
  insurance: InsuranceOption;
  pets?: null | Array<Pet>;
  specialDietDetails?: null | string;
  medicationSupply?: null | boolean;
  paperESSFile: null | string;
  facilityName: string;
  householdAffected: string;
  emergencySupportServices: null | string;
  referredServices: null | boolean;
  referredServiceDetails: string[];
  externalServices: null | string;
  type?: NeedsAssessmentType;
}
