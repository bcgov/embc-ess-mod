/* tslint:disable */
/* eslint-disable */
import { EvacuationFileHouseholdMember } from './evacuation-file-household-member';
import { InsuranceOption } from './insurance-option';
import { NeedsAssessmentType } from './needs-assessment-type';
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
  evacuationExternalReferrals?: null | string;
  evacuationImpact?: null | string;
  haveMedicalSupplies?: null | boolean;
  havePetsFood?: null | boolean;
  haveSpecialDiet?: boolean;
  houseHoldRecoveryPlan?: null | string;
  householdMembers: Array<EvacuationFileHouseholdMember>;
  id?: null | string;
  insurance: InsuranceOption;
  modifiedOn?: string;
  petCarePlans?: null | string;
  pets?: null | Array<Pet>;
  recommendedReferralServices?: null | Array<ReferralServices>;
  specialDietDetails?: null | string;
  takeMedication?: boolean;
  type?: NeedsAssessmentType;
}
