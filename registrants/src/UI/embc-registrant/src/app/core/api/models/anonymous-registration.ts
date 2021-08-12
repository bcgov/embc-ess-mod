/* tslint:disable */
/* eslint-disable */
import { EvacuationFile } from './evacuation-file';
import { NeedsAssessment } from './needs-assessment';
import { Profile } from './profile';
export interface AnonymousRegistration extends EvacuationFile {
  captcha: string;
  informationCollectionConsent: boolean;
  preliminaryNeedsAssessment: NeedsAssessment;
  registrationDetails: Profile;
}
