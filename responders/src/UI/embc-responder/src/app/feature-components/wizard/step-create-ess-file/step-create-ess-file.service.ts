import { Injectable } from '@angular/core';
import {
  HouseholdMember,
  InsuranceOption,
  NeedsAssessment,
  Pet
} from 'src/app/core/models/evacuation-file';
import { TabModel, WizardTabModelValues } from 'src/app/core/models/tab.model';
import * as globalConst from '../../../core/services/global-constants';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { Subject } from 'rxjs';
import { Address, PersonDetails } from 'src/app/core/api/models';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AddressModel } from 'src/app/core/models/address.model';
import { HouseholdMemberModel } from 'src/app/core/models/household-member.model';

@Injectable({ providedIn: 'root' })
export class StepCreateEssFileService {
  private essTabsVal: Array<TabModel> = WizardTabModelValues.essFileTabs;

  private nextTabUpdateVal: Subject<void> = new Subject();

  private paperESSFileVal: string;
  private evacuatedFromPrimaryVal: boolean;
  private evacAddressVal: AddressModel;
  private facilityNameVal: string;
  private insuranceVal: InsuranceOption;
  private householdAffectedVal: string;
  private emergencySupportServicesVal: string;
  private referredServicesVal: boolean;
  private referredServiceDetailsVal: string[];
  private externalServicesVal: string;

  private bypassPhraseVal: boolean;
  private securityPhraseVal: string;

  private haveHouseholdMembersVal: boolean;
  private householdMembersVal: HouseholdMemberModel[];
  private addMemberIndicatorVal: boolean;
  private haveSpecialDietVal: boolean;
  private specialDietDetailsVal: string;
  private haveMedicationVal: boolean;
  private medicationSupplyVal: boolean;

  private havePetsVal: boolean;
  private petsListVal: Pet[];
  private addPetIndicatorVal: boolean;
  private havePetsFoodVal: boolean;
  private petCareDetailsVal: string;

  private canRegistrantProvideClothingVal: string;
  private canRegistrantProvideFoodVal: string;
  private canRegistrantProvideIncidentalsVal: string;
  private canRegistrantProvideLodgingVal: string;
  private canRegistrantProvideTransportationVal: string;

  constructor(private dialog: MatDialog) {}

  // Contact Details Getters and Setters

  public get paperESSFile(): string {
    return this.paperESSFileVal;
  }
  public set paperESSFile(paperESSFileVal: string) {
    this.paperESSFileVal = paperESSFileVal;
  }

  public get evacuatedFromPrimary(): boolean {
    return this.evacuatedFromPrimaryVal;
  }
  public set evacuatedFromPrimary(evacuatedFromPrimaryVal: boolean) {
    this.evacuatedFromPrimaryVal = evacuatedFromPrimaryVal;
  }

  public get evacAddress(): AddressModel {
    return this.evacAddressVal;
  }
  public set evacAddress(evacAddressVal: AddressModel) {
    this.evacAddressVal = evacAddressVal;
  }

  public get facilityName(): string {
    return this.facilityNameVal;
  }
  public set facilityName(facilityNameVal: string) {
    this.facilityNameVal = facilityNameVal;
  }

  public get insurance(): InsuranceOption {
    return this.insuranceVal;
  }
  public set insurance(insuranceVal: InsuranceOption) {
    this.insuranceVal = insuranceVal;
  }

  public get householdAffected(): string {
    return this.householdAffectedVal;
  }
  public set householdAffected(householdAffectedVal: string) {
    this.householdAffectedVal = householdAffectedVal;
  }

  public get emergencySupportServices(): string {
    return this.emergencySupportServicesVal;
  }
  public set emergencySupportServices(emergencySupportServicesVal: string) {
    this.emergencySupportServicesVal = emergencySupportServicesVal;
  }

  public get referredServices(): boolean {
    return this.referredServicesVal;
  }
  public set referredServices(referredServicesVal: boolean) {
    this.referredServicesVal = referredServicesVal;
  }

  public get referredServiceDetails(): string[] {
    return this.referredServiceDetailsVal;
  }
  public set referredServiceDetails(referredServiceDetailsVal: string[]) {
    this.referredServiceDetailsVal = referredServiceDetailsVal;
  }

  public get externalServices(): string {
    return this.externalServicesVal;
  }
  public set externalServices(externalServicesVal: string) {
    this.externalServicesVal = externalServicesVal;
  }

  // Household Members Getter and Setters

  public get haveHouseHoldMembers(): boolean {
    return this.haveHouseholdMembersVal;
  }
  public set haveHouseHoldMembers(haveHouseholdMembersVal: boolean) {
    this.haveHouseholdMembersVal = haveHouseholdMembersVal;
  }

  public get householdMembers(): HouseholdMemberModel[] {
    return this.householdMembersVal;
  }
  public set householdMembers(householdMembersVal: HouseholdMemberModel[]) {
    this.householdMembersVal = householdMembersVal;
  }

  public get addMemberIndicator(): boolean {
    return this.addMemberIndicatorVal;
  }
  public set addMemberIndicator(addMemberIndicatorVal: boolean) {
    this.addMemberIndicatorVal = addMemberIndicatorVal;
  }

  public get haveSpecialDiet(): boolean {
    return this.haveSpecialDietVal;
  }
  public set haveSpecialDiet(haveSpecialDietVal: boolean) {
    this.haveSpecialDietVal = haveSpecialDietVal;
  }

  public get specialDietDetails(): string {
    return this.specialDietDetailsVal;
  }
  public set specialDietDetails(specialDietDetailsVal: string) {
    this.specialDietDetailsVal = specialDietDetailsVal;
  }

  public get haveMedication(): boolean {
    return this.haveMedicationVal;
  }
  public set haveMedication(haveMedicationVal: boolean) {
    this.haveMedicationVal = haveMedicationVal;
  }

  public get medicationSupply(): boolean {
    return this.medicationSupplyVal;
  }
  public set medicationSupply(medicationSupplyVal: boolean) {
    this.medicationSupplyVal = medicationSupplyVal;
  }

  // Animals Getters and Setters

  public get havePets(): boolean {
    return this.havePetsVal;
  }
  public set havePets(havePetsVal: boolean) {
    this.havePetsVal = havePetsVal;
  }

  public get petsList(): Pet[] {
    return this.petsListVal;
  }
  public set petsList(petsListVal: Pet[]) {
    this.petsListVal = petsListVal;
  }

  public get addPetIndicator(): boolean {
    return this.addPetIndicatorVal;
  }
  public set addPetIndicator(addPetIndicatorVal: boolean) {
    this.addPetIndicatorVal = addPetIndicatorVal;
  }

  public get havePetsFood(): boolean {
    return this.havePetsFoodVal;
  }
  public set havePetsFood(havePetsFoodVal: boolean) {
    this.havePetsFoodVal = havePetsFoodVal;
  }

  public get petCareDetails(): string {
    return this.petCareDetailsVal;
  }
  public set petCareDetails(petCareDetailsVal: string) {
    this.petCareDetailsVal = petCareDetailsVal;
  }

  // Needs Assessment Getters and Setters

  public get canRegistrantProvideClothing(): string {
    return this.canRegistrantProvideClothingVal;
  }
  public set canRegistrantProvideClothing(
    canRegistrantProvideClothingVal: string
  ) {
    this.canRegistrantProvideClothingVal = canRegistrantProvideClothingVal;
  }

  public get canRegistrantProvideFood(): string {
    return this.canRegistrantProvideFoodVal;
  }
  public set canRegistrantProvideFood(canRegistrantProvideFoodVal: string) {
    this.canRegistrantProvideFoodVal = canRegistrantProvideFoodVal;
  }

  public get canRegistrantProvideIncidentals(): string {
    return this.canRegistrantProvideIncidentalsVal;
  }
  public set canRegistrantProvideIncidentals(
    canRegistrantProvideIncidentalsVal: string
  ) {
    this.canRegistrantProvideIncidentalsVal = canRegistrantProvideIncidentalsVal;
  }

  public get canRegistrantProvideLodging(): string {
    return this.canRegistrantProvideLodgingVal;
  }
  public set canRegistrantProvideLodging(
    canRegistrantProvideLodgingVal: string
  ) {
    this.canRegistrantProvideLodgingVal = canRegistrantProvideLodgingVal;
  }

  public get canRegistrantProvideTransportation(): string {
    return this.canRegistrantProvideTransportationVal;
  }
  public set canRegistrantProvideTransportation(
    canRegistrantProvideTransportationVal: string
  ) {
    this.canRegistrantProvideTransportationVal = canRegistrantProvideTransportationVal;
  }

  public get bypassPhrase(): boolean {
    return this.bypassPhraseVal;
  }
  public set bypassPhrase(bypassPhraseVal: boolean) {
    this.bypassPhraseVal = bypassPhraseVal;
  }

  public get securityPhrase(): string {
    return this.securityPhraseVal;
  }
  public set securityPhrase(securityPhraseVal: string) {
    this.securityPhraseVal = securityPhraseVal;
  }

  // Tabs Navigation Getters and Setters
  public get nextTabUpdate(): Subject<void> {
    return this.nextTabUpdateVal;
  }
  public set nextTabUpdate(nextTabUpdateVal: Subject<void>) {
    this.nextTabUpdateVal = nextTabUpdateVal;
  }

  public get essTabs(): Array<TabModel> {
    return this.essTabsVal;
  }
  public set essTabs(essTabsVal: Array<TabModel>) {
    this.essTabsVal = essTabsVal;
  }

  /**
   * Set the given status to the given tab
   *
   * @param name of the tab
   * @param status of the tab
   */
  public setTabStatus(name: string, status: string): void {
    this.essTabsVal.map((tab) => {
      if (tab.name === name) {
        tab.status = status;
      }
      return tab;
    });
  }

  /**
   * Generates a needsAssessment DTO to be sent to the API
   *
   * @returns NeedsAssessment DTO
   */
  public createNeedsAssessmentDTO(): NeedsAssessment {
    // console.log({
    //   paperESSFile: this.paperESSFile,
    //   facilityName: this.facilityName,
    //   insurance: this.insurance,
    //   householdAffected: this.householdAffected,
    //   emergencySupportServices: this.emergencySupportServices,
    //   referredServices: this.referredServices,
    //   referredServiceDetails: this.referredServiceDetails,
    //   externalServices: this.externalServices,
    //   evacAddress: this.setAddressObject(this.evacAddress),

    //   haveHouseHoldMembers: this.hasHouseHoldMembers,
    //   householdMembers:
    //     this.householdMembers.length > 0
    //       ? this.setHouseHoldMembersObject(this.householdMembers)
    //       : [],
    //   haveMedication: this.haveMedication,
    //   haveSpecialDiet: this.haveSpecialDiet,
    //   specialDietDetails: this.specialDietDetails,
    //   medicationSuppply: this.medicationSupply
    // });

    return {
      paperESSFile: this.paperESSFileVal,
      facilityName: this.facilityNameVal,
      insurance: this.insuranceVal,
      householdAffected: this.householdAffectedVal,
      emergencySupportServices: this.emergencySupportServicesVal,
      referredServices: this.referredServicesVal,
      referredServiceDetails: this.referredServiceDetailsVal,
      externalServices: this.externalServicesVal,
      securityPhrase: this.securityPhrase
    };
  }

  /**
   * Determines if the tab navigation is allowed or not
   *
   * @param tabRoute clicked route
   * @param $event mouse click event
   * @returns true/false
   */
  isAllowed(tabRoute: string, $event: MouseEvent): boolean {
    if (tabRoute === 'review') {
      const allow = this.checkTabsStatus();
      if (allow) {
        $event.stopPropagation();
        $event.preventDefault();

        this.openModal(
          globalConst.wizardESSFileMessage.text,
          globalConst.wizardESSFileMessage.title
        );
      }
      return allow;
    }
  }

  /**
   * Checks the status of the tabs
   *
   * @returns true/false
   */
  checkTabsStatus(): boolean {
    return this.essTabsVal.some(
      (tab) =>
        (tab.status === 'not-started' || tab.status === 'incomplete') &&
        tab.name !== 'review'
    );
  }

  /**
   * Open information modal window
   *
   * @param text text to display
   */
  openModal(text: string, title?: string): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        text,
        title
      },
      width: '530px'
    });
  }

  /**
   * Checks if the form is partially completed or not
   *
   * @param form form group
   * @returns true/false
   */
  checkForPartialUpdates(form: FormGroup): boolean {
    const fields = [];
    Object.keys(form.controls).forEach((field) => {
      const control = form.controls[field] as
        | FormControl
        | FormGroup
        | FormArray;
      if (control instanceof FormControl) {
        if (control.value instanceof Object && control.value != null) {
          fields.push(control.value.length);
        } else {
          fields.push(control.value);
        }
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        for (const key in control.controls) {
          if (control.controls.hasOwnProperty(key)) {
            fields.push(control.controls[key].value);
          }
        }
      }
    });
    const result = fields.filter((field) => !!field);
    return result.length !== 0;
  }

  /**
   * Transforms an AddressModel Object into an Address Object
   *
   * @param addressObject
   * @returns
   */
  public setAddressObject(addressObject: AddressModel): Address {
    const address: Address = {
      addressLine1: addressObject.addressLine1,
      addressLine2: addressObject.addressLine2,
      countryCode: addressObject.country.code,
      communityCode:
        addressObject.community.code === undefined
          ? null
          : addressObject.community.code,
      postalCode: addressObject.postalCode,
      stateProvinceCode:
        addressObject.stateProvince === null
          ? null
          : addressObject.stateProvince.code
    };

    return address;
  }

  /**
   * Transforms a HouseholdMember Object into a Household Member Object
   *
   * @param householdMembers
   * @returns
   */
  private setHouseHoldMembersObject(
    householdMembers: HouseholdMemberModel[]
  ): HouseholdMember[] {
    const houseHoldMembersAPI: HouseholdMember[] = [];

    for (const member of householdMembers) {
      const details: PersonDetails = {
        firstName: member.firstName,
        lastName: member.lastName,
        initials: member.initials,
        dateOfBirth: member.dateOfBirth,
        gender: member.gender
      };

      const householdMember: HouseholdMember = {
        details
      };

      houseHoldMembersAPI.push(householdMember);
    }

    return houseHoldMembersAPI;
  }
}
