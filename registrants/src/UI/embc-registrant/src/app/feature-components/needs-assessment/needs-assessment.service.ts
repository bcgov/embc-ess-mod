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
  private householdMember: Array<HouseholdMember> = [];
  private pet: Array<Pet> = [];
  private canEvacueesProvideClothing: string;
  private canEvacueesProvideFood: string;
  private canEvacueesProvideIncidentals: string;
  private canEvacueesProvideLodging: string;
  private canEvacueesProvideTransportation: string;
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

  public get canEvacueeProvideLodging(): string {
    return this.canEvacueesProvideLodging;
  }

  public set canEvacueeProvideLodging(value: string) {
    this.canEvacueesProvideLodging = value;
  }

  public get canEvacueeProvideTransportation(): string {
    return this.canEvacueesProvideTransportation;
  }

  public set canEvacueeProvideTransportation(value: string) {
    this.canEvacueesProvideTransportation = value;
  }

  public get pets(): Array<Pet> {
    return this.pet;
  }

  public set pets(value: Array<Pet>) {
    this.pet = value;
  }


  public get householdMembers(): Array<HouseholdMember> {
    return this.householdMember;
  }

  public set householdMembers(value: Array<HouseholdMember>) {
    this.householdMember = value;
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
    this.canEvacueeProvideClothing = formGroup.get(
      'canEvacueeProvideClothing'
    ).value;
    this.canEvacueeProvideFood = formGroup.get('canEvacueeProvideFood').value;
    this.canEvacueeProvideIncidentals = formGroup.get(
      'canEvacueeProvideIncidentals'
    ).value;
    this.canEvacueeProvideLodging = formGroup.get(
      'canEvacueeProvideLodging'
    ).value;
    this.canEvacueeProvideTransportation = formGroup.get(
      'canEvacueeProvideTransportation'
    ).value;

    // this.canEvacueeProvideClothing =
    //   formGroup.get('canEvacueeProvideClothing').value === 'null'
    //     ? null
    //     : formGroup.get('canEvacueeProvideClothing').value;
    // this.canEvacueeProvideFood =
    //   formGroup.get('canEvacueeProvideFood').value === 'null'
    //     ? null
    //     : formGroup.get('canEvacueeProvideFood').value;
    // this.canEvacueeProvideIncidentals =
    //   formGroup.get('canEvacueeProvideIncidentals').value === 'null'
    //     ? null
    //     : formGroup.get('canEvacueeProvideIncidentals').value;
    // this.canEvacueeProvideLodging =
    //   formGroup.get('canEvacueeProvideLodging').value === 'null'
    //     ? null
    //     : formGroup.get('canEvacueeProvideLodging').value;
    // this.canEvacueeProvideTransportation =
    //   formGroup.get('canEvacueeProvideTransportation').value === 'null'
    //     ? null
    //     : formGroup.get('canEvacueeProvideTransportation').value;
  }

  public createNeedsAssessmentDTO(): NeedsAssessment {
    // Get correct API values for Needs Assessment selections
    const needsClothingDTO = globalConst.needsOptions.find(
      (ins) => ins.value === this.canEvacueeProvideClothing
    )?.apiValue;

    const needsFoodDTO = globalConst.needsOptions.find(
      (ins) => ins.value === this.canEvacueeProvideFood
    )?.apiValue;

    const needsIncidentalsDTO = globalConst.needsOptions.find(
      (ins) => ins.value === this.canEvacueeProvideIncidentals
    )?.apiValue;

    const needsLodgingDTO = globalConst.needsOptions.find(
      (ins) => ins.value === this.canEvacueeProvideLodging
    )?.apiValue;

    const needsTransportationDTO = globalConst.needsOptions.find(
      (ins) => ins.value === this.canEvacueeProvideTransportation
    )?.apiValue;
    return {
      id: this.id,
      canEvacueeProvideClothing: needsClothingDTO,
      canEvacueeProvideFood: needsFoodDTO,
      canEvacueeProvideIncidentals: needsIncidentalsDTO,
      canEvacueeProvideLodging: needsLodgingDTO,
      canEvacueeProvideTransportation: needsTransportationDTO,
      householdMembers: this.addPrimaryApplicantToHousehold(),
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
    this.canEvacueeProvideClothing = undefined;
    this.canEvacueeProvideFood = undefined;
    this.canEvacueeProvideIncidentals = undefined;
    this.canEvacueeProvideLodging = undefined;
    this.canEvacueeProvideTransportation = undefined;
    this.pets = undefined;
    this.householdMembers = undefined;
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
