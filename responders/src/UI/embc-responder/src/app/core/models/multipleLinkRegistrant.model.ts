import { RegistrantProfile } from '../api/models';

export class MultipleLinkRegistrantModel {
  profiles: RegistrantProfile[];
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  householdMemberId: string;
}
