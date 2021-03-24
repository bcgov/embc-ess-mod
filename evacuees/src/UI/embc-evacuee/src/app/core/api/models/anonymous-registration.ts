/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { NeedsAssessment } from './needs-assessment';
import { Profile } from './profile';

/**
 * Registration form for anonymous registrants
 */
export interface AnonymousRegistration {
  captcha: string;
  evacuatedFromAddress: Address;
  informationCollectionConsent: boolean;
  preliminaryNeedsAssessment: NeedsAssessment;
  registrationDetails: Profile;
}
