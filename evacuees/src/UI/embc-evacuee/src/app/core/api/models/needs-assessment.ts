/* tslint:disable */
/* eslint-disable */
import { Address } from './address';
import { InsuranceOption } from './insurance-option';
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
  evacuatedFromAddress: Address;
  familyMembers?: null | Array<PersonDetails>;
  hasPetsFood?: null | boolean;
  haveMedication?: boolean;
  haveSpecialDiet?: boolean;
  insurance: InsuranceOption;
  pets?: null | Array<Pet>;
  specialDietDetails?: null | string;
}
