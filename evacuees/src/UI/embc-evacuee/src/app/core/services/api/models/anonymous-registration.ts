import { NeedsAssessment } from '../../../model/needs-assessment';
import { Registration } from '../../../model/registration';

export interface AnonymousRegistration {
  captcha: string;
  preliminaryNeedsAssessment: NeedsAssessment;
  registrationDetails: Registration;
}
