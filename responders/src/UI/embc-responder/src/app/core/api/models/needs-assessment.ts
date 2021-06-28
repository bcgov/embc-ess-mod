/* tslint:disable */
/* eslint-disable */
import { EvacuationFileHouseholdMember } from './evacuation-file-household-member';
import { InsuranceOption } from './insurance-option';
import { NeedsAssessmentType } from './needs-assessment-type';
import { Note } from './note';
import { Pet } from './pet';
import { ReferralServices } from './referral-services';

/**
 * Needs assessment form
 */
export interface NeedsAssessment {
  canProvideClothing?: null | boolean;
  canProvideFood?: null | boolean;
  canProvideIncidentals?: null | boolean;
  canProvideLodging?: null | boolean;
  canProvideTransportation?: null | boolean;
  createdOn?: string;
  haveMedicalSupplies?: null | boolean;
  havePetsFood?: null | boolean;
  haveSpecialDiet?: boolean;
  householdMembers: Array<EvacuationFileHouseholdMember>;
  id?: null | string;
  insurance: InsuranceOption;
  modifiedOn?: string;
  notes?: null | Array<Note>;
  pets?: null | Array<Pet>;
  recommendedReferralServices?: null | Array<ReferralServices>;
  specialDietDetails?: null | string;
  takeMedication?: boolean;
  type?: NeedsAssessmentType;
}
