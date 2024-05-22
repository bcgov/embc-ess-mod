/* tslint:disable */
/* eslint-disable */
import { ETransferDetails } from './e-transfer-details';
import { SelfServeClothingSupport } from './self-serve-clothing-support';
import { SelfServeFoodGroceriesSupport } from './self-serve-food-groceries-support';
import { SelfServeFoodRestaurantSupport } from './self-serve-food-restaurant-support';
import { SelfServeIncidentalsSupport } from './self-serve-incidentals-support';
import { SelfServeShelterAllowanceSupport } from './self-serve-shelter-allowance-support';
export interface SubmitSupportsRequest {
  eTransferDetails?: ETransferDetails;
  evacuationFileId?: null | string;
  supports?: null | Array<(SelfServeShelterAllowanceSupport | SelfServeFoodGroceriesSupport | SelfServeFoodRestaurantSupport | SelfServeIncidentalsSupport | SelfServeClothingSupport)>;
}
