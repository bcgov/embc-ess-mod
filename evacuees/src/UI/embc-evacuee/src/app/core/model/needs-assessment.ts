import { RegAddress } from './address';
import { InsuranceOption } from './insurance-option';
import { PersonDetails } from '../services/api/models/person-details';
import { Pet } from '../services/api/models/pet';

export interface NeedsAssessment {
  evacuatedFromAddress: RegAddress;
  familyMembers?: null | Array<PersonDetails>;
  haveMedication?: boolean;
  haveSpecialDiet?: boolean;
  hasPetsFood?: boolean;
  insurance: InsuranceOption;
  pets?: null | Array<Pet>;
  canEvacueeProvideClothing?: null | boolean;
  canEvacueeProvideFood?: null | boolean;
  canEvacueeProvideIncidentals?: null | boolean;
  canEvacueeProvideLodging?: null | boolean;
  canEvacueeProvideTransportation?: null | boolean;
}
