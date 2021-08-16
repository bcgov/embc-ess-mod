import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  InsuranceOption,
  NeedsAssessment,
  PersonDetails,
  Pet,
  RegistrationResult,
  NeedsAssessmentType,
  HouseholdMember
} from 'src/app/core/api/models';

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
  private canEvacueesProvideClothing: boolean;
  private canEvacueesProvideFood: boolean;
  private canEvacueesProvideIncidentals: boolean;
  private canEvacueesProvideLodging: boolean;
  private canEvacueesProvideTransportation: boolean;
  private mainHouseholdMembers: HouseholdMember;
  private registrationResult: RegistrationResult;
  private verifiedRegistrationResult: string;
  private secretPhrase: string;

  constructor() {}

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

  public get canEvacueeProvideClothing(): boolean {
    return this.canEvacueesProvideClothing;
  }

  public set canEvacueeProvideClothing(value: boolean) {
    this.canEvacueesProvideClothing = value;
  }

  public get canEvacueeProvideFood(): boolean {
    return this.canEvacueesProvideFood;
  }

  public set canEvacueeProvideFood(value: boolean) {
    this.canEvacueesProvideFood = value;
  }

  public get canEvacueeProvideIncidentals(): boolean {
    return this.canEvacueesProvideIncidentals;
  }

  public set canEvacueeProvideIncidentals(value: boolean) {
    this.canEvacueesProvideIncidentals = value;
  }

  public get canEvacueeProvideLodging(): boolean {
    return this.canEvacueesProvideLodging;
  }

  public set canEvacueeProvideLodging(value: boolean) {
    this.canEvacueesProvideLodging = value;
  }

  public get canEvacueeProvideTransportation(): boolean {
    return this.canEvacueesProvideTransportation;
  }

  public set canEvacueeProvideTransportation(value: boolean) {
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

  public get secretWordPhrase(): string {
    return this.secretPhrase;
  }
  public set secretWordPhrase(value: string) {
    this.secretPhrase = value;
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

  public setNeedsDetails(formGroup: FormGroup): void {
    this.canEvacueeProvideClothing =
      formGroup.get('canEvacueeProvideClothing').value === 'null'
        ? null
        : formGroup.get('canEvacueeProvideClothing').value;
    this.canEvacueeProvideFood =
      formGroup.get('canEvacueeProvideFood').value === 'null'
        ? null
        : formGroup.get('canEvacueeProvideFood').value;
    this.canEvacueeProvideIncidentals =
      formGroup.get('canEvacueeProvideIncidentals').value === 'null'
        ? null
        : formGroup.get('canEvacueeProvideIncidentals').value;
    this.canEvacueeProvideLodging =
      formGroup.get('canEvacueeProvideLodging').value === 'null'
        ? null
        : formGroup.get('canEvacueeProvideLodging').value;
    this.canEvacueeProvideTransportation =
      formGroup.get('canEvacueeProvideTransportation').value === 'null'
        ? null
        : formGroup.get('canEvacueeProvideTransportation').value;
  }

  public createNeedsAssessmentDTO(): NeedsAssessment {
    console.log({
      id: this.id,
      canEvacueeProvideClothing: this.canEvacueeProvideClothing,
      canEvacueeProvideFood: this.canEvacueeProvideFood,
      canEvacueeProvideIncidentals: this.canEvacueeProvideIncidentals,
      canEvacueeProvideLodging: this.canEvacueeProvideLodging,
      canEvacueeProvideTransportation: this.canEvacueeProvideTransportation,
      householdMembers: this.householdMembers,
      hasPetsFood: this.hasPetsFood,
      haveMedication: this.haveMedication,
      haveSpecialDiet: this.haveSpecialDiet,
      specialDietDetails: this.specialDietDetails,
      insurance: this.insurance,
      pets: this.pets,
      type: NeedsAssessmentType.Preliminary
    });

    return {
      id: this.id,
      canEvacueeProvideClothing: this.canEvacueeProvideClothing,
      canEvacueeProvideFood: this.canEvacueeProvideFood,
      canEvacueeProvideIncidentals: this.canEvacueeProvideIncidentals,
      canEvacueeProvideLodging: this.canEvacueeProvideLodging,
      canEvacueeProvideTransportation: this.canEvacueeProvideTransportation,
      householdMembers: this.householdMembers,
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
}
