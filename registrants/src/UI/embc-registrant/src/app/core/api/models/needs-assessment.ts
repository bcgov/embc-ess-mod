/* tslint:disable */
/* eslint-disable */
import { HouseholdMember } from './household-member';
import { InsuranceOption } from './insurance-option';
import { NeedsAssessmentType } from './needs-assessment-type';
import { Pet } from './pet';

/**
 * Needs assessment form
 */
export interface NeedsAssessment {
  canEvacueeProvideClothing?: null | boolean;
  canEvacueeProvideFood?: null | boolean;
  canEvacueeProvideIncidentals?: null | boolean;
  canEvacueeProvideLodging?: null | boolean;
  shelterOption?: null | string;
  canEvacueeProvideTransportation?: null | boolean;
  doesEvacueeNotRequireAssistance?: null | boolean;
  householdMembers?: Array<HouseholdMember>;
  id?: null | string;
  insurance: InsuranceOption;
  pets?: Array<Pet>;
  type?: NeedsAssessmentType;
}
