/* tslint:disable */
/* eslint-disable */
import { InsuranceOption } from './insurance-option';
import { NeedsAssessmentType } from './needs-assessment-type';
import { PersonDetails } from './person-details';
import { Pet } from './pet';

/**
 * Needs assessment form
 */
export interface NeedsAssessment {
  canEvacueeProvideClothing?: null | boolean;
  canEvacueeProvideFood?: null | boolean;
  canEvacueeProvideIncidentals?: null | boolean;
  canEvacueeProvideLodging?: null | boolean;
  canEvacueeProvideTransportation?: null | boolean;
  familyMembers?: null | Array<PersonDetails>;
  hasPetsFood?: null | boolean;
  haveMedication?: boolean;
  haveSpecialDiet?: boolean;
  id?: null | string;
  insurance: InsuranceOption;
  pets?: null | Array<Pet>;
  specialDietDetails?: null | string;
  type?: NeedsAssessmentType;
}
