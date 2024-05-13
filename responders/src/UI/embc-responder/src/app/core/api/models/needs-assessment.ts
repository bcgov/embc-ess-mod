/* tslint:disable */
/* eslint-disable */
import { EvacuationFileHouseholdMember } from '../models/evacuation-file-household-member';
import { IdentifiedNeed } from '../models/identified-need';
import { InsuranceOption } from '../models/insurance-option';
import { NeedsAssessmentType } from '../models/needs-assessment-type';
import { Pet } from '../models/pet';

/**
 * Needs assessment form
 */
export interface NeedsAssessment {
  createdOn?: string | null;
  householdMembers: Array<EvacuationFileHouseholdMember>;
  id?: string | null;
  insurance: InsuranceOption;
  modifiedOn?: string | null;
  needs?: Array<IdentifiedNeed>;
  pets?: Array<Pet>;
  reviewingTeamMemberDisplayName?: string | null;
  reviewingTeamMemberId?: string | null;
  type?: NeedsAssessmentType | null;
}
