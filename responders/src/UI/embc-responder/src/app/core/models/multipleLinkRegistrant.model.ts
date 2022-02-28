import { LinkRegistrantProfileModel } from './link-registrant-profile.model';

export class MultipleLinkRegistrantModel {
  profiles: LinkRegistrantProfileModel[];
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  householdMemberId: string;
}
