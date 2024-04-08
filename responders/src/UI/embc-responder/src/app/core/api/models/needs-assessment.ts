/* tslint:disable */
/* eslint-disable */
import { EvacuationFileHouseholdMember } from './evacuation-file-household-member';
import { IdentifiedNeed } from './identified-need';
import { InsuranceOption } from './insurance-option';
import { NeedsAssessmentType } from './needs-assessment-type';
import { Pet } from './pet';

/**
 * Needs assessment form
 */
export interface NeedsAssessment {
  createdOn?: null | string;
  householdMembers: Array<EvacuationFileHouseholdMember>;
  id?: null | string;
  insurance: InsuranceOption;
  modifiedOn?: null | string;
  needs?: Array<IdentifiedNeed>;
  pets?: Array<Pet>;
  reviewingTeamMemberDisplayName?: null | string;
  reviewingTeamMemberId?: null | string;
  type?: null | NeedsAssessmentType;
}
