import { RegistrantProfileSearchResult } from '../api/models/registrant-profile-search-result';

export class MultipleLinkRegistrantModel {
  profiles: RegistrantProfileSearchResult[];
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  householdMemberId: string;
}
