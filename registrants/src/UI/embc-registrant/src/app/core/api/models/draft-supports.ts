/* tslint:disable */
/* eslint-disable */
import { HouseholdMember } from '../models/household-member';
import { SelfServeClothingSupport } from '../models/self-serve-clothing-support';
import { SelfServeFoodGroceriesSupport } from '../models/self-serve-food-groceries-support';
import { SelfServeFoodRestaurantSupport } from '../models/self-serve-food-restaurant-support';
import { SelfServeIncidentalsSupport } from '../models/self-serve-incidentals-support';
import { SelfServeShelterAllowanceSupport } from '../models/self-serve-shelter-allowance-support';
export interface DraftSupports {
  householdMembers?: Array<HouseholdMember> | null;
  items?: Array<
    | SelfServeShelterAllowanceSupport
    | SelfServeFoodGroceriesSupport
    | SelfServeFoodRestaurantSupport
    | SelfServeIncidentalsSupport
    | SelfServeClothingSupport
  > | null;
}
