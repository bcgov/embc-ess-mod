import { RegistrantProfile } from '../api/models';
import { HouseholdMemberButtons } from './appBase.model';

export interface LinkRegistrantProfileModel extends RegistrantProfile {
  hasSecurityQuestions?: boolean;
}

export interface LinkedRegistrantProfileResults {
  matchedProfiles: LinkRegistrantProfileModel[];
  householdMemberDisplayButton?: HouseholdMemberButtons;
}
