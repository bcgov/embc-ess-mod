import { Injectable } from '@angular/core';
import { TabModel } from 'src/app/core/models/tab.model';
import * as globalConst from '../../../core/services/global-constants';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { Subject } from 'rxjs';
import {
  EvacuationFile,
  EvacuationFileHouseholdMember,
  HouseholdMemberType,
  InsuranceOption,
  NeedsAssessment,
  Pet,
  ReferralServices
} from 'src/app/core/api/models';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AddressModel } from 'src/app/core/models/address.model';
import { HouseholdMemberModel } from 'src/app/core/models/household-member.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { WizardService } from '../wizard.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { UserService } from 'src/app/core/services/user.service';

@Injectable({ providedIn: 'root' })
export class StepEssFileService {
  // Wizard variables
  private essTabsVal: Array<TabModel>;
  private nextTabUpdateVal: Subject<void> = new Subject();

  // Important values not set on form
  // ESS File ID, Primary Registrant ID, and Task Number are set on EvacueeSession
  private primaryAddressVal: AddressModel;
  private primaryMemberVal: HouseholdMemberModel;

  // Evacuation Details tab
  private paperESSFileVal: string;
  private evacuatedFromPrimaryVal: boolean;
  private evacAddressVal: AddressModel;
  private facilityNameVal: string;
  private insuranceVal: InsuranceOption;

  private evacuationImpactVal: string;
  private householdRecoveryPlanVal: string;
  private referredServicesVal: boolean;
  private referredServiceDetailsVal: ReferralServices[];
  private evacuationExternalReferralsVal: string;

  // Household Members tab
  private haveHouseHoldMembersVal: boolean;
  private householdMembersVal: HouseholdMemberModel[];
  private addMemberIndicatorVal: boolean;

  private haveSpecialDietVal: boolean;
  private specialDietDetailsVal: string;
  private takeMedicationVal: boolean;
  private haveMedicationSupplyVal: boolean;

  // Animals tab
  private havePetsVal: boolean;
  private petsListVal: Pet[];
  private addPetIndicatorVal: boolean;

  private havePetsFoodVal: boolean;
  private petCarePlansVal: string;

  // Needs tab
  private canRegistrantProvideClothingVal: string;
  private canRegistrantProvideFoodVal: string;
  private canRegistrantProvideIncidentalsVal: string;
  private canRegistrantProvideLodgingVal: string;
  private canRegistrantProvideTransportationVal: string;

  // Security Phrase tab
  private bypassPhraseVal: boolean;
  private securityPhraseVal: string;

  constructor(
    private dialog: MatDialog,
    private wizardService: WizardService,
    private evacueeSession: EvacueeSessionService,
    private userService: UserService
  ) {}
  // Wizard variables
  public get essTabs(): Array<TabModel> {
    return this.essTabsVal;
  }
  public set essTabs(essTabsVal: Array<TabModel>) {
    this.essTabsVal = essTabsVal;
  }

  public get nextTabUpdate(): Subject<void> {
    return this.nextTabUpdateVal;
  }
  public set nextTabUpdate(nextTabUpdateVal: Subject<void>) {
    this.nextTabUpdateVal = nextTabUpdateVal;
  }

  // Required values not set on form
  // ESS File ID, Primary Registrant ID, and Task Number are set on EvacueeSession
  public get primaryAddress(): AddressModel {
    return this.primaryAddressVal;
  }
  public set primaryAddress(primaryAddressVal: AddressModel) {
    this.primaryAddressVal = primaryAddressVal;
  }

  public get primaryMember(): HouseholdMemberModel {
    return this.primaryMemberVal;
  }
  public set primaryMember(primaryMemberVal: HouseholdMemberModel) {
    this.primaryMemberVal = primaryMemberVal;
  }

  // Evacuation Details tab
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

  public get evacuationImpact(): string {
    return this.evacuationImpactVal;
  }
  public set evacuationImpact(evacuationImpactVal: string) {
    this.evacuationImpactVal = evacuationImpactVal;
  }

  public get householdRecoveryPlan(): string {
    return this.householdRecoveryPlanVal;
  }
  public set householdRecoveryPlan(householdRecoveryPlanVal: string) {
    this.householdRecoveryPlanVal = householdRecoveryPlanVal;
  }

  public get referredServices(): boolean {
    return this.referredServicesVal;
  }
  public set referredServices(referredServicesVal: boolean) {
    this.referredServicesVal = referredServicesVal;
  }

  public get referredServiceDetails(): ReferralServices[] {
    return this.referredServiceDetailsVal;
  }
  public set referredServiceDetails(
    referredServiceDetailsVal: ReferralServices[]
  ) {
    this.referredServiceDetailsVal = referredServiceDetailsVal;
  }

  public get evacuationExternalReferrals(): string {
    return this.evacuationExternalReferralsVal;
  }
  public set evacuationExternalReferrals(
    evacuationExternalReferralsVal: string
  ) {
    this.evacuationExternalReferralsVal = evacuationExternalReferralsVal;
  }

  // Household Members tab
  public get haveHouseHoldMembers(): boolean {
    return this.haveHouseHoldMembersVal;
  }
  public set haveHouseHoldMembers(haveHouseHoldMembersVal: boolean) {
    this.haveHouseHoldMembersVal = haveHouseHoldMembersVal;
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

  public get takeMedication(): boolean {
    return this.takeMedicationVal;
  }
  public set takeMedication(takeMedicationVal: boolean) {
    this.takeMedicationVal = takeMedicationVal;
  }

  public get haveMedicationSupply(): boolean {
    return this.haveMedicationSupplyVal;
  }
  public set haveMedicationSupply(haveMedicationSupplyVal: boolean) {
    this.haveMedicationSupplyVal = haveMedicationSupplyVal;
  }

  // Animals tab
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

  public get petCarePlans(): string {
    return this.petCarePlansVal;
  }
  public set petCarePlans(petCarePlansVal: string) {
    this.petCarePlansVal = petCarePlansVal;
  }

  // Needs tab
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

  // Security Phrase tab
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

  /**
   * Set the given status to the given tab
   *
   * @param name of the tab
   * @param status of the tab
   */
  public setTabStatus(name: string, status: string): void {
    this.essTabs.map((tab) => {
      if (tab.name === name) {
        tab.status = status;
      }
      return tab;
    });
  }

  /**
   * Convert Create ESS File form data into object that can be submitted to the API
   *
   * @returns Evacuation File record usable by the API
   */
  public createEvacFileDTO(): EvacuationFile {
    // Get correct API values for Needs Assessment selections
    const needsClothingDTO = globalConst.needsOptions.find(
      (ins) => ins.value === this.canRegistrantProvideClothing
    )?.apiValue;

    const needsFoodDTO = globalConst.needsOptions.find(
      (ins) => ins.value === this.canRegistrantProvideFood
    )?.apiValue;

    const needsIncidentalsDTO = globalConst.needsOptions.find(
      (ins) => ins.value === this.canRegistrantProvideIncidentals
    )?.apiValue;

    const needsLodgingDTO = globalConst.needsOptions.find(
      (ins) => ins.value === this.canRegistrantProvideLodging
    )?.apiValue;

    const needsTransportationDTO = globalConst.needsOptions.find(
      (ins) => ins.value === this.canRegistrantProvideTransportation
    )?.apiValue;

    // Create new HouseholdMembers array that includes primary registrant, set member types
    this.householdMembers.forEach((mem) => {
      mem.isPrimaryRegistrant = false;
      mem.type = HouseholdMemberType.HouseholdMember;
    });

    const allMembers: EvacuationFileHouseholdMember[] = [
      this.primaryMember,
      ...this.householdMembers
    ];

    const needsObject: NeedsAssessment = {
      insurance: this.insurance,
      recommendedReferralServices: this.referredServiceDetails,
      evacuationImpact: this.evacuationImpact,
      houseHoldRecoveryPlan: this.householdRecoveryPlan,
      evacuationExternalReferrals: this.evacuationExternalReferrals,

      householdMembers: allMembers,
      haveSpecialDiet: this.haveSpecialDiet,
      specialDietDetails: this.specialDietDetails,
      takeMedication: this.takeMedication,
      haveMedicalSupplies: this.haveMedicationSupply,

      pets: this.petsList,
      havePetsFood: this.havePetsFood,
      petCarePlans: this.petCarePlans,

      canProvideFood: needsFoodDTO,
      canProvideLodging: needsLodgingDTO,
      canProvideClothing: needsClothingDTO,
      canProvideTransportation: needsTransportationDTO,
      canProvideIncidentals: needsIncidentalsDTO
    };

    // Map out into DTO object and return
    return {
      primaryRegistrantId: this.evacueeSession.profileId,

      evacuatedFromAddress: this.wizardService.setAddressObjectForDTO(
        this.evacAddress
      ),
      registrationLocation: this.facilityName,

      needsAssessment: needsObject,
      securityPhrase: this.securityPhrase,
      securityPhraseEdited: !this.bypassPhrase,
      task: {
        taskNumber: this.userService.currentProfile?.taskNumber
      }
    };
  }

  /**
   * Reset all values in this service to defaults
   */
  public clearService() {
    if (this.essTabs) {
      this.essTabs.length = 0;
    }

    // Wizard variables
    this.nextTabUpdate.next(null);

    // Important values not set on form
    // ESS File ID, Primary Registrant ID, and Task Number are set on EvacueeSession
    this.primaryAddress = undefined;
    this.primaryMember = undefined;

    // Evacuation Details tab
    this.paperESSFile = undefined;
    this.evacuatedFromPrimary = undefined;
    this.evacAddress = undefined;
    this.facilityName = undefined;
    this.insurance = undefined;

    this.evacuationImpact = undefined;
    this.householdRecoveryPlan = undefined;
    this.referredServices = undefined;
    this.referredServiceDetails = undefined;
    this.evacuationExternalReferrals = undefined;

    // Household Members tab
    this.haveHouseHoldMembers = undefined;
    this.householdMembers = undefined;
    this.addMemberIndicator = undefined;

    this.haveSpecialDiet = undefined;
    this.specialDietDetails = undefined;
    this.takeMedication = undefined;
    this.haveMedicationSupply = undefined;

    // Animals tab
    this.havePets = undefined;
    this.petsList = undefined;
    this.addPetIndicator = undefined;

    this.havePetsFood = undefined;
    this.petCarePlans = undefined;

    // Needs tab
    this.canRegistrantProvideClothing = undefined;
    this.canRegistrantProvideFood = undefined;
    this.canRegistrantProvideIncidentals = undefined;
    this.canRegistrantProvideLodging = undefined;
    this.canRegistrantProvideTransportation = undefined;

    // Security Phrase tab
    this.bypassPhrase = undefined;
    this.securityPhrase = undefined;
  }

  /**
   * Update the wizard's values with ones fetched from API
   */
  public setFormValuesFromFile(essFile: EvacuationFileModel) {
    const essNeeds = essFile.needsAssessment;

    // Wizard variables
    this.evacueeSession.essFileNumber = essFile.id;

    // Required values not set on form
    this.primaryMember = {
      sameLastName: true,
      ...essNeeds.householdMembers?.find(
        (member) => member.type === HouseholdMemberType.Registrant
      )
    };

    // Evacuation Details tab
    this.evacAddress = essFile.evacuatedFromAddress;
    this.facilityName = essFile.registrationLocation;

    this.evacuatedFromPrimary = this.primaryAddress === this.evacAddress;

    this.insurance = essNeeds.insurance;

    this.evacuationImpact = essNeeds.evacuationImpact;
    this.householdRecoveryPlan = essNeeds.houseHoldRecoveryPlan;

    this.referredServiceDetails = essNeeds.recommendedReferralServices;
    this.referredServices = essNeeds.recommendedReferralServices.length > 0;

    this.evacuationExternalReferrals = essNeeds.evacuationExternalReferrals;

    // Household Members tab
    // Split main applicant from other household members, remap to UI model
    this.householdMembers = essNeeds.householdMembers
      ?.filter((member) => member.type !== HouseholdMemberType.Registrant)
      .map<HouseholdMemberModel>((member) => {
        return {
          ...member,
          sameLastName: member.lastName === this.primaryMember.lastName
        };
      });

    this.haveHouseHoldMembersVal = this.householdMembers?.length > 0;

    this.haveSpecialDiet = essNeeds.haveSpecialDiet;
    this.specialDietDetails = essNeeds.specialDietDetails;
    this.takeMedication = essNeeds.takeMedication;
    this.haveMedicationSupply = essNeeds.haveMedicalSupplies;

    // Animals tab
    this.petsList = essNeeds.pets;
    this.havePets = essNeeds.pets?.length > 0;

    this.havePetsFood = essNeeds.havePetsFood;
    this.petCarePlans = essNeeds.petCarePlans;

    // Needs tab
    this.canRegistrantProvideFood = globalConst.needsOptions.find(
      (ins) => ins.apiValue === essNeeds.canProvideFood
    )?.value;

    this.canRegistrantProvideLodging = globalConst.needsOptions.find(
      (ins) => ins.apiValue === essNeeds.canProvideLodging
    )?.value;

    this.canRegistrantProvideClothing = globalConst.needsOptions.find(
      (ins) => ins.apiValue === essNeeds.canProvideClothing
    )?.value;

    this.canRegistrantProvideTransportation = globalConst.needsOptions.find(
      (ins) => ins.apiValue === essNeeds.canProvideTransportation
    )?.value;

    this.canRegistrantProvideIncidentals = globalConst.needsOptions.find(
      (ins) => ins.apiValue === essNeeds.canProvideIncidentals
    )?.value;

    // Security Phrase tab
    this.securityPhrase = essFile.securityPhrase;
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

        this.openModal(globalConst.wizardESSFileMessage);
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
    return this.essTabs.some(
      (tab) =>
        (tab.status === 'not-started' || tab.status === 'incomplete') &&
        tab.name !== 'review'
    );
  }

  /**
   * Open information modal window
   *
   * @param text text to display
   * @param title title of modal
   * @param button text on "close" button ("Close" by default)
   * @param exitLink link to exit greater context (e.g. wizard) for modal, null = no link
   */
  openModal(content: DialogContent): MatDialogRef<DialogComponent, any> {
    const thisModal = this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        content
      },
      width: '530px'
    });

    return thisModal;
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
}
