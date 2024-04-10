/* tslint:disable */
/* eslint-disable */
import { HouseholdMember } from './household-member';
import { IdentifiedNeed } from './identified-need';
import { InsuranceOption } from './insurance-option';
import { NeedsAssessmentType } from './needs-assessment-type';
import { Pet } from './pet';

/**
 * Needs assessment form
 */
export interface NeedsAssessment {
  householdMembers?: Array<HouseholdMember>;
  id?: null | string;
  insurance: InsuranceOption;
  needs?: Array<IdentifiedNeed>;
  pets?: Array<Pet>;
  type?: NeedsAssessmentType;
}
