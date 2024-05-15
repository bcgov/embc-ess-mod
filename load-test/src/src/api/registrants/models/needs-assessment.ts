/* tslint:disable */
/* eslint-disable */
import { HouseholdMember } from './household-member';
import { IdentifiedNeed } from './identified-need';
import { InsuranceOption } from './insurance-option';
import { NeedsAssessmentType } from './needs-assessment-type';
import { Pet } from './pet';
export interface NeedsAssessment {
  householdMembers?: null | Array<HouseholdMember>;
  id?: null | string;
  insurance: InsuranceOption;
  needs?: null | Array<IdentifiedNeed>;
  pets?: null | Array<Pet>;
  type?: NeedsAssessmentType;
}
