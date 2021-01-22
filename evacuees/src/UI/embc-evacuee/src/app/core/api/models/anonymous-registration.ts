/* tslint:disable */
/* eslint-disable */
import { NeedsAssessment } from './needs-assessment';
import { Registration } from './registration';

/**
 * Registration form for anonymous registrants
 */
export interface AnonymousRegistration {
  captcha: string;
  preliminaryNeedsAssessment: NeedsAssessment;
  registrationDetails: Registration;
}
