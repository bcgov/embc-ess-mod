/* tslint:disable */
/* eslint-disable */
import { EvacuationFile } from '../models/evacuation-file';
import { Profile } from '../models/profile';
export interface AnonymousRegistration {
  captcha: string;
  informationCollectionConsent: boolean;
  preliminaryNeedsAssessment: EvacuationFile;
  registrationDetails: Profile;
}
