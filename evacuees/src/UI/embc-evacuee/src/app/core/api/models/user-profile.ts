/* tslint:disable */
/* eslint-disable */
import { Profile } from './profile';
import { ProfileDataConflict } from './profile-data-conflict';

/**
 * DTO for conflict resolution data
 */
export interface UserProfile {
  conflicts?: null | Array<ProfileDataConflict>;
  eraProfile?: null | Profile;
  isNewUser?: boolean;
  loginProfile?: null | Profile;
}
