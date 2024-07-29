/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { ClothingSupport } from '../models/clothing-support';
import { EvacuationFileHouseholdMember } from '../models/evacuation-file-household-member';
import { EvacuationFileStatus } from '../models/evacuation-file-status';
import { EvacuationFileTask } from '../models/evacuation-file-task';
import { FoodGroceriesSupport } from '../models/food-groceries-support';
import { FoodRestaurantSupport } from '../models/food-restaurant-support';
import { IncidentalsSupport } from '../models/incidentals-support';
import { LodgingAllowanceSupport } from '../models/lodging-allowance-support';
import { LodgingBilletingSupport } from '../models/lodging-billeting-support';
import { LodgingGroupSupport } from '../models/lodging-group-support';
import { LodgingHotelSupport } from '../models/lodging-hotel-support';
import { NeedsAssessment } from '../models/needs-assessment';
import { Note } from '../models/note';
import { TransportationOtherSupport } from '../models/transportation-other-support';
import { TransportationTaxiSupport } from '../models/transportation-taxi-support';
export interface EvacuationFile {
  completedBy?: string | null;
  completedOn?: string | null;
  evacuatedFromAddress: Address;
  evacuationFileDate?: string | null;
  householdMembers?: Array<EvacuationFileHouseholdMember> | null;
  id?: string | null;
  isPaper?: boolean | null;
  isRestricted?: boolean | null;
  manualFileId?: string | null;
  needsAssessment: NeedsAssessment;
  notes?: Array<Note> | null;
  primaryRegistrantFirstName?: string | null;
  primaryRegistrantId: string;
  primaryRegistrantLastName?: string | null;
  registrationLocation: string;
  securityPhrase?: string | null;
  securityPhraseEdited?: boolean | null;
  status?: EvacuationFileStatus;
  supports?: Array<
    | ClothingSupport
    | IncidentalsSupport
    | FoodGroceriesSupport
    | FoodRestaurantSupport
    | LodgingHotelSupport
    | LodgingBilletingSupport
    | LodgingGroupSupport
    | LodgingAllowanceSupport
    | TransportationTaxiSupport
    | TransportationOtherSupport
  > | null;
  task: EvacuationFileTask;
}
