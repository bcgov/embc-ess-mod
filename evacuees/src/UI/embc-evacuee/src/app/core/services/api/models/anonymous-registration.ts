/* tslint:disable */
import { NeedsAssessment } from './needs-assessment';
import { Registration } from './registration';

/**
 * Registration form for anonymous registrants
 */
export interface AnonymousRegistration {
  captcha: string;
  perliminaryNeedsAssessment: NeedsAssessment;
  registrationDetails: Registration;
}
