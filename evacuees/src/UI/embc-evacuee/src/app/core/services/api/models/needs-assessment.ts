/* tslint:disable */
import { Address } from './address';
import { InsuranceOption } from './insurance-option';
import { PersonDetails } from './person-details';
import { Pet } from './pet';

/**
 * Needs assessment form
 */
export interface NeedsAssessment {
  evacuatedFromAddress: Address;
  familyMembers?: null | Array<PersonDetails>;
  haveMedication?: boolean;
  haveSpecialDiet?: boolean;
  insurance: InsuranceOption;
  pets?: null | Array<Pet>;
  requiresClothing?: null | boolean;
  requiresFood?: null | boolean;
  requiresIncidentals?: null | boolean;
  requiresLodging?: null | boolean;
  requiresTransportation?: null | boolean;
}
