import { Injectable } from '@angular/core';
import { TabModel, WizardTabModelValues } from 'src/app/core/models/tab.model';
import * as globalConst from '../../../core/services/global-constants';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { Subject } from 'rxjs';
import {
  Address,
  EvacuationFile,
  EvacuationFileHouseholdMember,
  HouseholdMemberType,
  InsuranceOption,
  NeedsAssessment,
  NoteType,
  PersonDetails,
  Pet,
  ReferralServices
} from 'src/app/core/api/models';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { AddressModel } from 'src/app/core/models/address.model';
import { HouseholdMemberModel } from 'src/app/core/models/household-member.model';
import { StepCreateProfileService } from '../step-create-profile/step-create-profile.service';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { WizardService } from '../wizard.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { UserService } from 'src/app/core/services/user.service';

@Injectable({ providedIn: 'root' })
export class StepCreateEssFileService {
  private essTabsVal: Array<TabModel> = WizardTabModelValues.essFileTabs;

  private nextTabUpdateVal: Subject<void> = new Subject();

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
  private petCarePlansVal: string;

  private canRegistrantProvideClothingVal: string;
  private canRegistrantProvideFoodVal: string;
  private canRegistrantProvideIncidentalsVal: string;
  private canRegistrantProvideLodgingVal: string;
  private canRegistrantProvideTransportationVal: string;

  constructor(
    private dialog: MatDialog,
    private wizardService: WizardService,
    private userService: UserService,
    private evacueeSession: EvacueeSessionService,
    private stepCreateProfileService: StepCreateProfileService
  ) {}

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

  public get petCarePlans(): string {
    return this.petCarePlansVal;
  }
  public set petCarePlans(petCarePlansVal: string) {
    this.petCarePlansVal = petCarePlansVal;
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
   * Convert Create ESS File form data into object that can be submitted to the API
   *
   * @returns Evacuation File record usable by the API
   */
  public createEvacFileDTO(): EvacuationFile {
    const userProfile = this.userService.currentProfile;

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
    this.householdMembers.forEach(
      (mem) => (mem.type = HouseholdMemberType.HouseholdMember)
    );

    const allMembers: EvacuationFileHouseholdMember[] = [
      {
        dateOfBirth: this.stepCreateProfileService.personalDetails.dateOfBirth,
        firstName: this.stepCreateProfileService.personalDetails.firstName,
        lastName: this.stepCreateProfileService.personalDetails.lastName,
        gender: this.stepCreateProfileService.personalDetails.gender,
        initials: this.stepCreateProfileService.personalDetails.initials,
        type: HouseholdMemberType.Registrant
      },
      ...this.householdMembers
    ];

    const needsObject: NeedsAssessment = {
      notes: [
        {
          type: NoteType.EvacuationImpact,
          content: this.evacuationImpact
        },
        {
          type: NoteType.HouseHoldRecoveryPlan,
          content: this.householdRecoveryPlan
        },
        {
          type: NoteType.EvacuationExternalReferrals,
          content: this.evacuationExternalReferrals
        },
        {
          type: NoteType.PetCarePlans,
          content: this.petCarePlans
        }
      ],

      insurance: this.insurance,
      recommendedReferralServices: this.referredServiceDetails,

      householdMembers: allMembers,
      haveSpecialDiet: this.haveSpecialDiet,
      specialDietDetails: this.specialDietDetails,
      haveMedication: this.haveMedication,

      pets: this.petsList,
      hasPetsFood: this.havePetsFood,

      canEvacueeProvideFood: needsFoodDTO,
      canEvacueeProvideLodging: needsLodgingDTO,
      canEvacueeProvideClothing: needsClothingDTO,
      canEvacueeProvideTransportation: needsTransportationDTO,
      canEvacueeProvideIncidentals: needsIncidentalsDTO
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
        taskNumber: userProfile.taskNumber
      }
    };
  }

  /**
   * Update the wizard's values with ones fetched from API
   */
  public getEvacFileDTO(essFile: EvacuationFileModel) {
    this.paperESSFile = essFile.essFileNumber;
    this.evacAddress = this.wizardService.setAddressObjectForForm(
      essFile.evacuatedFromAddress
    );
    this.facilityName = essFile.registrationLocation;

    this.evacuatedFromPrimary =
      this.stepCreateProfileService?.primaryAddressDetails === this.evacAddress;

    const essNeeds = essFile.needsAssessment;

    // Get content for API Notes fields
    if (essNeeds.notes?.length > 0) {
      this.evacuationImpact = essNeeds.notes?.find(
        (note) => note.type === NoteType.EvacuationImpact
      )?.content;

      this.householdRecoveryPlan = essNeeds.notes?.find(
        (note) => note.type === NoteType.HouseHoldRecoveryPlan
      )?.content;

      this.evacuationExternalReferrals = essNeeds.notes?.find(
        (note) => note.type === NoteType.EvacuationExternalReferrals
      )?.content;

      this.petCarePlans = essNeeds.notes?.find(
        (note) => note.type === NoteType.PetCarePlans
      )?.content;
    }
    this.insurance = essNeeds.insurance;

    this.referredServiceDetails = essNeeds.recommendedReferralServices;
    this.referredServices = essNeeds.recommendedReferralServices.length > 0;

    // Split main applicant from other household members, remap to UI model
    const primaryLastName = essNeeds.householdMembers?.find(
      (member) => member.type === HouseholdMemberType.Registrant
    )?.lastName;

    this.householdMembers = essNeeds.householdMembers
      ?.filter((member) => member.type !== HouseholdMemberType.Registrant)
      .map<HouseholdMemberModel>((member) => {
        return {
          ...member,
          sameLastName: member.lastName === primaryLastName
        };
      });

    this.haveHouseholdMembersVal = this.householdMembers?.length > 0;

    this.haveSpecialDiet = essNeeds.haveSpecialDiet;
    this.specialDietDetails = essNeeds.specialDietDetails;
    this.haveMedication = essNeeds.haveMedication;

    this.petsList = essNeeds.pets;
    this.havePetsFood = essNeeds.hasPetsFood;

    this.havePets = essNeeds.pets?.length > 0;

    // Get values for buttons on Needs tabs
    this.canRegistrantProvideFood = globalConst.needsOptions.find(
      (ins) => ins.apiValue === essNeeds.canEvacueeProvideFood
    )?.value;

    this.canRegistrantProvideLodging = globalConst.needsOptions.find(
      (ins) => ins.apiValue === essNeeds.canEvacueeProvideLodging
    )?.value;

    this.canRegistrantProvideClothing = globalConst.needsOptions.find(
      (ins) => ins.apiValue === essNeeds.canEvacueeProvideClothing
    )?.value;

    this.canRegistrantProvideTransportation = globalConst.needsOptions.find(
      (ins) => ins.apiValue === essNeeds.canEvacueeProvideTransportation
    )?.value;

    this.canRegistrantProvideIncidentals = globalConst.needsOptions.find(
      (ins) => ins.apiValue === essNeeds.canEvacueeProvideIncidentals
    )?.value;

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
