/* tslint:disable */
/* eslint-disable */
import { EvacuationFile } from './evacuation-file';
import { Profile } from './profile';

/**
 * Registration form for anonymous registrants
 */
export interface AnonymousRegistration {
  captcha: string;
  informationCollectionConsent: boolean;
  preliminaryNeedsAssessment: EvacuationFile;
  registrationDetails: Profile;
}
