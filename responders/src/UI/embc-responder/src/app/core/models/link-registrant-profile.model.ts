import { RegistrantProfile } from '../api/models';

export interface LinkRegistrantProfileModel extends RegistrantProfile {
  hasSecurityQuestions?: boolean;
}
