/* tslint:disable */
/* eslint-disable */
import { ETransferDetails } from '../models/e-transfer-details';
import { SelfServeClothingSupport } from '../models/self-serve-clothing-support';
import { SelfServeFoodGroceriesSupport } from '../models/self-serve-food-groceries-support';
import { SelfServeFoodRestaurantSupport } from '../models/self-serve-food-restaurant-support';
import { SelfServeIncidentalsSupport } from '../models/self-serve-incidentals-support';
import { SelfServeShelterAllowanceSupport } from '../models/self-serve-shelter-allowance-support';
export interface SubmitSupportsRequest {
  eTransferDetails?: ETransferDetails;
  evacuationFileId?: string | null;
  supports?: Array<
    | SelfServeShelterAllowanceSupport
    | SelfServeFoodGroceriesSupport
    | SelfServeFoodRestaurantSupport
    | SelfServeIncidentalsSupport
    | SelfServeClothingSupport
  > | null;
}
