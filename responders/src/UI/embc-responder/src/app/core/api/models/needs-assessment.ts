/* tslint:disable */
/* eslint-disable */
import { EvacuationFileHouseholdMember } from './evacuation-file-household-member';
import { InsuranceOption } from './insurance-option';
import { NeedsAssessmentType } from './needs-assessment-type';
import { Pet } from './pet';

export interface NeedsAssessment {
  canProvideClothing?: null | boolean;
  canProvideFood?: null | boolean;
  canProvideIncidentals?: null | boolean;
  canProvideLodging?: null | boolean;
  canProvideTransportation?: null | boolean;
  createdOn?: null | string;
  householdMembers: Array<EvacuationFileHouseholdMember>;
  id?: null | string;
  insurance: InsuranceOption;
  modifiedOn?: null | string;
  pets?: Array<Pet>;
  reviewingTeamMemberDisplayName?: null | string;
  reviewingTeamMemberId?: null | string;