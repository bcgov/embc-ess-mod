/* tslint:disable */
/* eslint-disable */
import { HouseholdMember } from '../models/household-member';
import { IdentifiedNeed } from '../models/identified-need';
import { InsuranceOption } from '../models/insurance-option';
import { NeedsAssessmentType } from '../models/needs-assessment-type';
import { Pet } from '../models/pet';
export interface NeedsAssessment {
  householdMembers?: Array<HouseholdMember> | null;
  id?: string | null;
  insurance: InsuranceOption;
  needs?: Array<IdentifiedNeed> | null;
  pets?: Array<Pet> | null;
  type?: NeedsAssessmentType;
}
