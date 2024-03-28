import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
  InsuranceOption,
  NeedsAssessment,
  PersonDetails,
  Pet,
  RegistrationResult,
  NeedsAssessmentType,
  HouseholdMember
} from 'src/app/core/api/models';
import { ProfileDataService } from '../profile/profile-data.service';
import * as globalConst from '../../core/services/globalConstants';

@Injectable({ providedIn: 'root' })
export class NeedsAssessmentService {
  private needsAssessmentID: string = null;
  private insuranceOption: InsuranceOption;
  private haveMedications: boolean;
  private haveSpecialDiets: boolean;
  private householdMember: Array<HouseholdMember> = [];
  private specialDietDetail: string;
  private pet: Array<Pet> = [];
  private hasPetFood: boolean;
  private canEvacueesProvideLodging: string;
  private shelterOption: string;
  private canEvacueesProvideClothing: string;
  private canEvacueesProvideFood: string;
  private canEvacueesProvideIncidentals: string;
  private canEvacueesProvideTransportation: string;
  private doEvacueesNotRequireAssistance: string;
  private mainHouseholdMembers: HouseholdMember;
  private registrationResult: RegistrationResult;
  private verifiedRegistrationResult: string;

  constructor(private profileDataService: ProfileDataService) {}

  public get id(): string {
    return this.needsAssessmentID;
  }
  public set id(value: string) {
    this.needsAssessmentID = value;
  }

  public get insurance(): InsuranceOption {
    return this.insuranceOption;
  }
  public set insurance(value: InsuranceOption) {
    this.insuranceOption = value;
  }

  public get canEvacueeProvideLodging(): string {
    return this.canEvacueesProvideLodging;
  }

  public set canEvacueeProvideLodging(value: string) {
    this.canEvacueesProvideLodging = value;
  }

  public get shelterOptions(): string {
    return this.shelterOption;
  }

  public set shelterOptions(value: string) {
    this.shelterOption = value;
  }

  public get doesEvacueeNotRequireAssistance(): string {
    return this.doEvacueesNotRequireAssistance;
  }

  public set doesEvacueeNotRequireAssistance(value: string) {
    this.doEvacueesNotRequireAssistance = value;
  }

  public get canEvacueeProvideClothing(): string {
    return this.canEvacueesProvideClothing;
  }

  public set canEvacueeProvideClothing(value: string) {
    this.canEvacueesProvideClothing = value;
  }

  public get canEvacueeProvideFood(): string {
    return this.canEvacueesProvideFood;
  }

  public set canEvacueeProvideFood(value: string) {
    this.canEvacueesProvideFood = value;
  }

  public get canEvacueeProvideIncidentals(): string {
    return this.canEvacueesProvideIncidentals;
  }

  public set canEvacueeProvideIncidentals(value: string) {
    this.canEvacueesProvideIncidentals = value;
  }

  public get canEvacueeProvideTransportation(): string {
    return this.canEvacueesProvideTransportation;
  }

  public set canEvacueeProvideTransportation(value: string) {
    this.canEvacueesProvideTransportation = value;
  }

  public get hasPetsFood(): boolean {
    return this.hasPetFood;
  }

  public set hasPetsFood(value: boolean) {
    this.hasPetFood = value;
  }

  public get pets(): Array<Pet> {
    return this.pet;
  }

  public set pets(value: Array<Pet>) {
    this.pet = value;
  }

  public get haveMedication(): boolean {
    return this.haveMedications;
  }

  public set haveMedication(value: boolean) {
    this.haveMedications = value;
  }

  public get haveSpecialDiet(): boolean {
    return this.haveSpecialDiets;
  }

  public set haveSpecialDiet(value: boolean) {
    this.haveSpecialDiets = value;
  }

  public get householdMembers(): Array<HouseholdMember> {
    return this.householdMember;
  }

  public set householdMembers(value: Array<HouseholdMember>) {
    this.householdMember = value;
  }

  public get specialDietDetails(): string {
    return this.specialDietDetail;
  }
  public set specialDietDetails(value: string) {
    this.specialDietDetail = value;
  }

  public get mainHouseholdMember(): HouseholdMember {
    return this.mainHouseholdMembers;
  }

  public set mainHouseholdMember(value: HouseholdMember) {
    this.mainHouseholdMembers = value;
  }

  public setHouseHoldMembers(members: PersonDetails[]): void {
    const householdMembersArray: Array<HouseholdMember> = [];
    for (const member of members) {
      const houseHoldMember: HouseholdMember = {
        id: null,
        details: member
      };

      householdMembersArray.push(houseHoldMember);
    }
    this.householdMembers = householdMembersArray;
  }

  public setNeedsDetails(formGroup: UntypedFormGroup): void {
    this.canEvacueeProvideLodging = formGroup.get(
      'canEvacueeProvideLodging'
    )?.value;
    this.shelterOptions = formGroup.get(
      'shelterOptions'
    )?.value;
    this.canEvacueeProvideClothing = formGroup.get(
      'canEvacueeProvideClothing'
    )?.value;
    this.canEvacueeProvideFood = formGroup.get(
      'canEvacueeProvideFood'
    )?.value;
    this.canEvacueeProvideIncidentals = formGroup.get(
      'canEvacueeProvideIncidentals'
    )?.value;
    this.canEvacueeProvideTransportation = formGroup.get(
      'canEvacueeProvideTransportation'
    )?.value;
    this.doesEvacueeNotRequireAssistance = formGroup.get(
      'doesEvacueeNotRequireAssistance'
    )?.value;
  }

  public createNeedsAssessmentDTO(): NeedsAssessment {
    // Get correct API values for Needs Assessment selections
    const needsLodgingDTO = globalConst.booleanOptions.find(
      (ins) => ins.name === this.canEvacueeProvideLodging
    )?.value;

    const shelterOptionsDTO = this.shelterOptions;

    const needsClothingDTO = globalConst.booleanOptions.find(
      (ins) => ins.name === this.canEvacueeProvideClothing
    )?.value;

    const needsFoodDTO = globalConst.booleanOptions.find(
      (ins) => ins.name === this.canEvacueeProvideFood
    )?.value;

    const needsIncidentalsDTO = globalConst.booleanOptions.find(
      (ins) => ins.name === this.canEvacueeProvideIncidentals
    )?.value;

    const needsTransportationDTO = globalConst.booleanOptions.find(
      (ins) => ins.name === this.canEvacueeProvideTransportation
    )?.value;

    const doesEvacueeNotRequireAssistanceDTO = globalConst.booleanOptions.find(
      (ins) => ins.name === this.doesEvacueeNotRequireAssistance
    )?.value;

    return {
      id: this.id,
      canEvacueeProvideLodging: needsLodgingDTO,
      shelterOptions: shelterOptionsDTO,
      canEvacueeProvideClothing: needsClothingDTO,
      canEvacueeProvideFood: needsFoodDTO,
      canEvacueeProvideIncidentals: needsIncidentalsDTO,
      canEvacueeProvideTransportation: needsTransportationDTO,
      doesEvacueeNotRequireAssistance: doesEvacueeNotRequireAssistanceDTO,
      householdMembers: this.addPrimaryApplicantToHousehold(),
      hasPetsFood: this.hasPetsFood,
      haveMedication: this.haveMedication,
      haveSpecialDiet: this.haveSpecialDiet,
      specialDietDetails: this.specialDietDetails,
      insurance: this.insurance,
      pets: this.pets,
      type: NeedsAssessmentType.Preliminary
    };
  }

  public setNonVerifiedEvacuationFileNo(
    registrationResult: RegistrationResult
  ): void {
    this.registrationResult = registrationResult;
  }

  public getNonVerifiedEvacuationFileNo(): RegistrationResult {
    return this.registrationResult;
  }

  public setVerifiedEvacuationFileNo(registrationResult: string): void {
    this.verifiedRegistrationResult = registrationResult;
  }

  public getVerifiedEvacuationFileNo(): string {
    return this.verifiedRegistrationResult;
  }

  public clearEvacuationFileNo(): void {
    this.registrationResult = { referenceNumber: null };
    this.verifiedRegistrationResult = null;
  }

  public clearNeedsAssessmentData(): void {
    this.id = undefined;
    this.insurance = undefined;
    this.canEvacueeProvideLodging = 'false';
    this.shelterOptions = undefined;
    this.canEvacueeProvideClothing = undefined;
    this.canEvacueeProvideFood = undefined;
    this.canEvacueeProvideIncidentals = undefined;
    this.canEvacueeProvideTransportation = undefined;
    this.doesEvacueeNotRequireAssistance = undefined;
    this.hasPetsFood = undefined;
    this.pets = undefined;
    this.haveMedication = undefined;
    this.haveSpecialDiet = undefined;
    this.householdMembers = undefined;
    this.specialDietDetails = undefined;
  }

  addPrimaryApplicantToHousehold() {
    const primaryMember: HouseholdMember = {
      details: this.profileDataService.createProfileDTO().personalDetails,
      isPrimaryRegistrant: true
    };
    if (this.householdMembers.length === 0) {
      return [...this.householdMembers, primaryMember];
    } else if (
      !this.householdMembers.find(
        (member) => member.isPrimaryRegistrant === true
      )
    ) {
      return [...this.householdMembers, primaryMember];
    } else {
      return this.householdMembers;
    }
  }
}
