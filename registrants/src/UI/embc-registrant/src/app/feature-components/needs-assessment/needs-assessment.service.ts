import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { InsuranceOption, NeedsAssessment, PersonDetails, Pet, RegistrationResult, NeedsAssessmentType, HouseholdMember, IdentifiedNeed } from 'src/app/core/api/models';
import { ProfileDataService } from '../profile/profile-data.service';
import { ShelterType } from 'src/app/core/services/globalConstants';

@Injectable({ providedIn: 'root' })
export class NeedsAssessmentService {
  private needsAssessmentID: string = null;
  private insuranceOption: InsuranceOption;
  private householdMember: Array<HouseholdMember> = [];
  private pet: Array<Pet> = [];
  private requiresClothingVal: boolean;
  private requiresFoodVal: boolean;
  private requiresIncidentalsVal: boolean;
  private requiresShelterTypeVal: ShelterType;
  private mainHouseholdMembers: HouseholdMember;
  private registrationResult: RegistrationResult;
  private verifiedRegistrationResult: string;

  constructor(private profileDataService: ProfileDataService) { }

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

  public get requiresClothing(): boolean {
    return this.requiresClothingVal;
  }

  public set requiresClothing(value: boolean) {
    this.requiresClothingVal = value;
  }

  public get requiresFood(): boolean {
    return this.requiresFoodVal;
  }

  public set requiresFood(value: boolean) {
    this.requiresFoodVal = value;
  }

  public get requiresIncidentals(): boolean {
    return this.requiresIncidentalsVal;
  }

  public set requiresIncidentals(value: boolean) {
    this.requiresIncidentalsVal = value;
  }

  public get requiresShelterType(): ShelterType {
    return this.requiresShelterTypeVal;
  }

  public set requiresShelterType(value: ShelterType) {
    this.requiresShelterTypeVal = value;
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
    this.requiresClothing = formGroup.get('requiresClothing').value;
    this.requiresFood = formGroup.get('requiresFood').value;
    this.requiresIncidentals = formGroup.get('requiresIncidentals').value;
    this.requiresShelterType = formGroup.get('requiresShelterType').value;
  }

  public createNeedsAssessmentDTO(): NeedsAssessment {
    return {
      id: this.id,
      needs: this.addNeedsToNeedsAssessment(),
      householdMembers: this.addPrimaryApplicantToHousehold(),
      insurance: this.insurance,
      pets: this.pets,
      type: NeedsAssessmentType.Preliminary
    };
  }

  public setNonVerifiedEvacuationFileNo(registrationResult: RegistrationResult): void {
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
    this.requiresClothingVal = undefined;
    this.requiresFoodVal = undefined;
    this.requiresIncidentalsVal = undefined;
    this.requiresShelterTypeVal = undefined;
    this.pets = undefined;
    this.householdMembers = undefined;
  }

  addPrimaryApplicantToHousehold(): HouseholdMember[] {
    const primaryMember: HouseholdMember = {
      details: this.profileDataService.createProfileDTO().personalDetails,
      isPrimaryRegistrant: true
    };
    if (this.householdMembers.length === 0) {
      return [...this.householdMembers, primaryMember];
    } else if (!this.householdMembers.find((member) => member.isPrimaryRegistrant === true) &&
      !this.householdMembers.find((member: any) => member.details.isPrimaryRegistrant === true)
    ) {
      return [...this.householdMembers, primaryMember];
    } else {
      this.householdMembers = this.householdMembers.filter((member: any) => !member.isPrimaryRegistrant && !member.details.isPrimaryRegistrant);
      return [...this.householdMembers, primaryMember];
    }
  }

  private addNeedsToNeedsAssessment(): IdentifiedNeed[] {
    const needs: IdentifiedNeed[] = [];
    if (this.requiresClothingVal) {
      needs.push(IdentifiedNeed.Clothing);
    }
    if (this.requiresFood) {
      needs.push(IdentifiedNeed.Food);
    }
    if (this.requiresIncidentals) {
      needs.push(IdentifiedNeed.Incidentals);
    }
    if (this.requiresShelterType === ShelterType.referral) {
      needs.push(IdentifiedNeed.ShelterReferral);
    }
    if (this.requiresShelterType === ShelterType.allowance) {
      needs.push(IdentifiedNeed.ShelterAllowance);
    }
    return needs;
  }
}
