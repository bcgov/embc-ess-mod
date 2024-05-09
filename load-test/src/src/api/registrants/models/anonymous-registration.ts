/* tslint:disable */
/* eslint-disable */
import { EvacuationFile } from './evacuation-file';
import { Profile } from './profile';
export interface AnonymousRegistration {
  captcha: string;
  informationCollectionConsent: boolean;
  preliminaryNeedsAssessment: EvacuationFile;
  registrationDetails: Profile;
}
