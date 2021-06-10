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
import { AddressModel } from 'src/app/core/models/Address.model';
import { HouseholdMemberModel } from 'src/app/core/models/HouseholdMember.model';

@Injectable({ providedIn: 'root' })
export class StepCreateEssFileService {
  private essTabs: Array<TabModel> = WizardTabModelValues.essFileTabs;

  private setNextTabUpdate: Subject<void> = new Subject();

  private paperESSFile: string;
  private evacuatedFromPrimary: boolean;
  private evacAddress: AddressModel;
  private facilityName: string;
  private insurance: InsuranceOption;
  private householdAffected: string;
  private emergencySupportServices: string;
  private referredServices: boolean;
  private referredServiceDetails: string[];
  private externalServices: string;

  private bypassPhraseVal: boolean;
  private securityPhraseVal: string;

  private haveHouseholdMembers: boolean;
  private householdMembers: HouseholdMemberModel[];
  private addHouseholdMemberIndicator: boolean;
  private haveSpecialDiet: boolean;
  private specialDietDetails: string;
  private haveMedication: boolean;
  private medicationSupply: boolean;

  private havePets: boolean;
  private petsList: Pet[];
  private addPetsIndicator: boolean;
  private havePetsFood: boolean;
  private petCareDetail: string;

  private canRegistrantProvideClothing: boolean;
  private canRegistrantProvideFood: boolean;
  private canRegistrantProvideIncidentals: boolean;
  private canRegistrantProvideLodging: boolean;
  private canRegistrantProvideTransportation: boolean;

  constructor(private dialog: MatDialog) {}

  // Contact Details Getters and Setters

  public get paperESSFiles(): string {
    return this.paperESSFile;
  }
  public set paperESSFiles(paperESSFile: string) {
    this.paperESSFile = paperESSFile;
  }

  public get evacuatedFromPrimaryAddress(): boolean {
    return this.evacuatedFromPrimary;
  }
  public set evacuatedFromPrimaryAddress(evacuatedFromPrimary: boolean) {
    this.evacuatedFromPrimary = evacuatedFromPrimary;
  }

  public get evacAddresS(): AddressModel {
    return this.evacAddress;
  }
  public set evacAddresS(evacAddress: AddressModel) {
    this.evacAddress = evacAddress;
  }

  public get facilityNames(): string {
    return this.facilityName;
  }
  public set facilityNames(facilityName: string) {
    this.facilityName = facilityName;
  }

  public get insuranceInfo(): InsuranceOption {
    return this.insurance;
  }
  public set insuranceInfo(insurance: InsuranceOption) {
    this.insurance = insurance;
  }

  public get householdAffectedInfo(): string {
    return this.householdAffected;
  }
  public set householdAffectedInfo(householdAffected: string) {
    this.householdAffected = householdAffected;
  }

  public get emergencySupportServiceS(): string {
    return this.emergencySupportServices;
  }
  public set emergencySupportServiceS(emergencySupportServices: string) {
    this.emergencySupportServices = emergencySupportServices;
  }

  public get referredServiceS(): boolean {
    return this.referredServices;
  }
  public set referredServiceS(referredServices: boolean) {
    this.referredServices = referredServices;
  }

  public get referredServiceDetailS(): string[] {
    return this.referredServiceDetails;
  }
  public set referredServiceDetailS(referredServiceDetails: string[]) {
    this.referredServiceDetails = referredServiceDetails;
  }

  public get externalServiceS(): string {
    return this.externalServices;
  }
  public set externalServiceS(externalServices: string) {
    this.externalServices = externalServices;
  }

  // Household Members Getter and Setters

  public get hasHouseHoldMembers(): boolean {
    return this.haveHouseholdMembers;
  }
  public set hasHouseHoldMembers(haveHouseholdMembers: boolean) {
    this.haveHouseholdMembers = haveHouseholdMembers;
  }

  public get houseHoldMembers(): HouseholdMemberModel[] {
    return this.householdMembers;
  }
  public set houseHoldMembers(householdMembers: HouseholdMemberModel[]) {
    this.householdMembers = householdMembers;
  }

  public get addMemberIndicator(): boolean {
    return this.addHouseholdMemberIndicator;
  }
  public set addMemberIndicator(addHouseholdMemberIndicator: boolean) {
    this.addHouseholdMemberIndicator = addHouseholdMemberIndicator;
  }

  public get hasSpecialDiet(): boolean {
    return this.haveSpecialDiet;
  }
  public set hasSpecialDiet(haveSpecialDiet: boolean) {
    this.haveSpecialDiet = haveSpecialDiet;
  }

  public get specialDietDetailS(): string {
    return this.specialDietDetails;
  }
  public set specialDietDetailS(specialDietDetails: string) {
    this.specialDietDetails = specialDietDetails;
  }

  public get hasMedication(): boolean {
    return this.haveMedication;
  }
  public set hasMedication(haveMedication: boolean) {
    this.haveMedication = haveMedication;
  }

  public get medicationSupplY(): boolean {
    return this.medicationSupply;
  }
  public set medicationSupplY(medicationSupply: boolean) {
    this.medicationSupply = medicationSupply;
  }

  // Animals Getters and Setters

  public get hasPets(): boolean {
    return this.havePets;
  }
  public set hasPets(havePets: boolean) {
    this.havePets = havePets;
  }

  public get pets(): Pet[] {
    return this.petsList;
  }
  public set pets(petsList: Pet[]) {
    this.petsList = petsList;
  }

  public get addPetIndicator(): boolean {
    return this.addPetsIndicator;
  }
  public set addPetIndicator(addPetsIndicator: boolean) {
    this.addPetsIndicator = addPetsIndicator;
  }

  public get hasPetsFood(): boolean {
    return this.havePetsFood;
  }
  public set hasPetsFood(havePetsFood: boolean) {
    this.havePetsFood = havePetsFood;
  }

  public get petCareDetailS(): string {
    return this.petCareDetail;
  }
  public set petCareDetails(petCareDetail: string) {
    this.petCareDetail = petCareDetail;
  }

  // Needs Assessment Getters and Setters

  public get canEvacueeProvideClothing(): boolean {
    return this.canRegistrantProvideClothing;
  }
  public set canEvacueeProvideClothing(canRegistrantProvideClothing: boolean) {
    this.canRegistrantProvideClothing = canRegistrantProvideClothing;
  }

  public get canEvacueeProvideFood(): boolean {
    return this.canRegistrantProvideFood;
  }
  public set canEvacueeProvideFood(canRegistrantProvideFood: boolean) {
    this.canRegistrantProvideFood = canRegistrantProvideFood;
  }

  public get canEvacueeProvideIncidentals(): boolean {
    return this.canRegistrantProvideIncidentals;
  }
  public set canEvacueeProvideIncidentals(
    canRegistrantProvideIncidentals: boolean
  ) {
    this.canRegistrantProvideIncidentals = canRegistrantProvideIncidentals;
  }

  public get canEvacueeProvideLodging(): boolean {
    return this.canRegistrantProvideLodging;
  }
  public set canEvacueeProvideLodging(canRegistrantProvideLodging: boolean) {
    this.canRegistrantProvideLodging = canRegistrantProvideLodging;
  }

  public get canEvacueeProvideTransportation(): boolean {
    return this.canRegistrantProvideTransportation;
  }
  public set canEvacueeProvideTransportation(
    canRegistrantProvideTransportation: boolean
  ) {
    this.canRegistrantProvideTransportation = canRegistrantProvideTransportation;
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
    return this.setNextTabUpdate;
  }
  public set nextTabUpdate(setNextTabUpdate: Subject<void>) {
    this.setNextTabUpdate = setNextTabUpdate;
  }

  public get tabs(): Array<TabModel> {
    return this.essTabs;
  }
  public set tabs(tabs: Array<TabModel>) {
    this.essTabs = tabs;
  }

  /**
   * Set the given status to the given tab
   *
   * @param name of the tab
   * @param status of the tab
   */
  public setTabStatus(name: string, status: string): void {
    this.tabs.map((tab) => {
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
      paperESSFile: this.paperESSFile,
      facilityName: this.facilityName,
      insurance: this.insurance,
      householdAffected: this.householdAffected,
      emergencySupportServices: this.emergencySupportServices,
      referredServices: this.referredServices,
      referredServiceDetails: this.referredServiceDetails,
      externalServices: this.externalServices,
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
    return this.tabs.some(
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
