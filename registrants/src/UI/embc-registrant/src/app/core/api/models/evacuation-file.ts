/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { ClothingSupport } from '../models/clothing-support';
import { EvacuationFileStatus } from '../models/evacuation-file-status';
import { FoodGroceriesSupport } from '../models/food-groceries-support';
import { FoodRestaurantSupport } from '../models/food-restaurant-support';
import { IncidentalsSupport } from '../models/incidentals-support';
import { LodgingAllowanceSupport } from '../models/lodging-allowance-support';
import { LodgingBilletingSupport } from '../models/lodging-billeting-support';
import { LodgingGroupSupport } from '../models/lodging-group-support';
import { LodgingHotelSupport } from '../models/lodging-hotel-support';
import { NeedsAssessment } from '../models/needs-assessment';
import { TransportationOtherSupport } from '../models/transportation-other-support';
import { TransportationTaxiSupport } from '../models/transportation-taxi-support';
export interface EvacuationFile {
  completedBy?: string | null;
  completedOn?: string | null;
  evacuatedFromAddress: Address;
  evacuationFileDate?: string | null;
  fileId?: string | null;
  isPaper?: boolean | null;
  isRestricted?: boolean | null;
  lastModified?: string;
  manualFileId?: string | null;
  needsAssessment: NeedsAssessment;
  secretPhrase?: string | null;
  secretPhraseEdited?: boolean | null;
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
}
