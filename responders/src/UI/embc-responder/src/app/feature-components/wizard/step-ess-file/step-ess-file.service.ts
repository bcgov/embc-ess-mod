import { Injectable } from '@angular/core';
import { TabModel, TabStatusManager } from 'src/app/core/models/tab.model';
import * as globalConst from '../../../core/services/global-constants';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';
import { Subject } from 'rxjs';
import {
  EvacuationFile,
  HouseholdMemberType,
  InsuranceOption,
  NeedsAssessment,
  Pet
} from 'src/app/core/api/models';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup
} from '@angular/forms';
import { AddressModel } from 'src/app/core/models/address.model';
import { HouseholdMemberModel } from 'src/app/core/models/household-member.model';
import { EvacuationFileModel } from 'src/app/core/models/evacuation-file.model';
import { WizardService } from '../wizard.service';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { DialogContent } from 'src/app/core/models/dialog-content.model';
import { UserService } from 'src/app/core/services/user.service';
import { LocationsService } from 'src/app/core/services/locations.service';
import * as _ from 'lodash';
import { EvacueeSearchService } from '../../search/evacuee-search/evacuee-search.service';
import { WizardSteps, WizardType } from 'src/app/core/models/wizard-type.model';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';

@Injectable({ providedIn: 'root' })
export class StepEssFileService {
  // Wizard variables
  private essTabsVal: Array<TabModel>;
  private nextTabUpdateVal: Subject<void> = new Subject();

  //Selected ESS File object
  private selectedEssFileVal: EvacuationFileModel;

  // Important values not set on form
  // ESS File ID, Primary Registrant ID, and Task Number are set on EvacueeSession
  private primaryAddressVal: AddressModel;
  private taskNumberVal: string;
  private evacuationFileDateVal: string;
  private primaryRegistrantIdVal: string;

  // Evacuation Details tab
  private paperESSFileVal: string;
  private completedByVal?: string;
  private completedOnVal?: string;
  private evacuatedFromPrimaryVal: string;
  private evacAddressVal: AddressModel;
  private facilityNameVal: string;
  private insuranceVal: InsuranceOption;


  // Household Members & Pets tab
  private haveHouseHoldMembersVal: string;
  private householdMembersVal: HouseholdMemberModel[];
  private selectedHouseholdMembersVal: HouseholdMemberModel[];
  private tempHouseholdMemberVal: HouseholdMemberModel;
  private addMemberIndicatorVal: boolean;
  private addMemberFormIndicatorVal: boolean;

  private havePetsVal: string;
  private petsListVal: Pet[];
  private addPetIndicatorVal: boolean;

  // Needs tab
  private canRegistrantProvideLodgingVal: string;
  private shelterOptionsVal: string;
  private canRegistrantProvideFoodVal: string;
  private canRegistrantProvideClothingVal: string;
  private canRegistrantProvideIncidentalsVal: string;
  private canRegistrantProvideTransportationVal: string;
  private doesEvacueeNotRequireAssistanceVal: string;

  // Security Phrase tab
  private bypassPhraseVal: boolean;
  private securityPhraseVal: string;
  private originalPhraseVal: string;
  private editedSecurityPhraseVal: boolean;
  private needsAssessmentSubmitFlagVal: boolean;

  constructor(
    private dialog: MatDialog,
    private wizardService: WizardService,
    private evacueeSession: EvacueeSessionService,
    private userService: UserService,
    private locationService: LocationsService,
    private evacueeSearchService: EvacueeSearchService,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService
  ) {}

  // Selected ESS File Model getter and setter
  public get selectedEssFile(): EvacuationFileModel {
    return this.selectedEssFileVal;
  }

  public set selectedEssFile(essFile: EvacuationFileModel) {
    this.selectedEssFileVal = essFile;
  }

  public get needsAssessmentSubmitFlag(): boolean {
    return this.needsAssessmentSubmitFlagVal;
  }

  public set needsAssessmentSubmitFlag(needsAssessmentSubmitFlagVal: boolean) {
    this.needsAssessmentSubmitFlagVal = needsAssessmentSubmitFlagVal;
  }

  public get primaryRegistrantId(): string {
    return this.primaryRegistrantIdVal;
  }

  public set primaryRegistrantId(primaryRegistrantIdVal: string) {
    this.primaryRegistrantIdVal = primaryRegistrantIdVal;
  }

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

  public get taskNumber(): string {
    return this.taskNumberVal;
  }

  public set taskNumber(taskNumberVal: string) {
    this.taskNumberVal = taskNumberVal;
  }

  public get evacuationFileDate(): string {
    return this.evacuationFileDateVal;
  }

  public set evacuationFileDate(evacuationFileDateVal: string) {
    this.evacuationFileDateVal = evacuationFileDateVal;
  }

  // Evacuation Details tab
  public get paperESSFile(): string {
    return this.paperESSFileVal;
  }
  public set paperESSFile(paperESSFileVal: string) {
    this.paperESSFileVal = paperESSFileVal;
  }

  public get completedBy(): string {
    return this.completedByVal;
  }
  public set completedBy(completedByVal: string) {
    this.completedByVal = completedByVal;
  }

  public get completedOn(): string {
    return this.completedOnVal;
  }
  public set completedOn(completedOnVal: string) {
    this.completedOnVal = completedOnVal;
  }

  public get evacuatedFromPrimary(): string {
    return this.evacuatedFromPrimaryVal;
  }
  public set evacuatedFromPrimary(evacuatedFromPrimaryVal: string) {
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

  // Household Members tab
  public get haveHouseHoldMembers(): string {
    return this.haveHouseHoldMembersVal;
  }
  public set haveHouseHoldMembers(haveHouseHoldMembersVal: string) {
    this.haveHouseHoldMembersVal = haveHouseHoldMembersVal;
  }

  public get householdMembers(): HouseholdMemberModel[] {
    return this.householdMembersVal;
  }
  public set householdMembers(householdMembersVal: HouseholdMemberModel[]) {
    this.householdMembersVal = householdMembersVal;
  }

  public get selectedHouseholdMembers(): HouseholdMemberModel[] {
    return this.selectedHouseholdMembersVal;
  }
  public set selectedHouseholdMembers(
    selectedHouseholdMembersVal: HouseholdMemberModel[]
  ) {
    this.selectedHouseholdMembersVal = selectedHouseholdMembersVal;
  }

  public set tempHouseholdMember(tempHouseHoldMemberVal: HouseholdMemberModel) {
    this.tempHouseholdMemberVal = tempHouseHoldMemberVal;
  }

  public get tempHouseholdMember(): HouseholdMemberModel {
    return this.tempHouseholdMemberVal;
  }

  public get addMemberIndicator(): boolean {
    return this.addMemberIndicatorVal;
  }
  public set addMemberIndicator(addMemberIndicatorVal: boolean) {
    this.addMemberIndicatorVal = addMemberIndicatorVal;
  }

  public get addMemberFormIndicator(): boolean {
    return this.addMemberFormIndicatorVal;
  }
  public set addMemberFormIndicator(addMemberFormIndicatorVal: boolean) {
    this.addMemberFormIndicatorVal = addMemberFormIndicatorVal;
  }

  // Animals tab
  public get havePets(): string {
    return this.havePetsVal;
  }
  public set havePets(havePetsVal: string) {
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

  // Needs tab
  public get canRegistrantProvideLodging(): string {
    return this.canRegistrantProvideLodgingVal;
  }
  public set canRegistrantProvideLodging(
    canRegistrantProvideLodgingVal: string
  ) {
    this.canRegistrantProvideLodgingVal = canRegistrantProvideLodgingVal;
  }

  public get shelterOptions(): string {
    return this.shelterOptionsVal;
  }
  public set shelterOptions(
    shelterOptionsVal: string
  ) {
    this.shelterOptionsVal = shelterOptionsVal;
  }

  public get canRegistrantProvideFood(): string {
    return this.canRegistrantProvideFoodVal;
  }
  public set canRegistrantProvideFood(
    canRegistrantProvideFoodVal: string
  ) {
    this.canRegistrantProvideFoodVal = canRegistrantProvideFoodVal;
  }

  public get canRegistrantProvideClothing(): string {
    return this.canRegistrantProvideClothingVal;
  }
  public set canRegistrantProvideClothing(
    canRegistrantProvideClothingVal: string
  ) {
    this.canRegistrantProvideClothingVal = canRegistrantProvideClothingVal;
  }

  public get canRegistrantProvideIncidentals(): string {
    return this.canRegistrantProvideIncidentalsVal;
  }
  public set canRegistrantProvideIncidentals(
    canRegistrantProvideIncidentalsVal: string
  ) {
    this.canRegistrantProvideIncidentalsVal =
      canRegistrantProvideIncidentalsVal;
  }

  public get canRegistrantProvideTransportation(): string {
    return this.canRegistrantProvideTransportationVal;
  }
  public set canRegistrantProvideTransportation(
    canRegistrantProvideTransportationVal: string
  ) {
    this.canRegistrantProvideTransportationVal =
      canRegistrantProvideTransportationVal;
  }

  public get doesEvacueeNotRequireAssistance(): string {
    return this.doesEvacueeNotRequireAssistanceVal;
  }
  public set doesEvacueeNotRequireAssistance(
    doesEvacueeNotRequireAssistanceVal: string
  ) {
    this.doesEvacueeNotRequireAssistanceVal =
    doesEvacueeNotRequireAssistanceVal;
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

  public set originalSecurityPhrase(originalSecurityPhrase: string) {
    this.originalPhraseVal = originalSecurityPhrase;
  }

  public get originalSecurityPhrase(): string {
    return this.originalPhraseVal;
  }

  public get editedSecurityPhrase(): boolean {
    return this.editedSecurityPhraseVal;
  }
  public set editedSecurityPhrase(editedSecurityPhraseVal: boolean) {
    this.editedSecurityPhraseVal = editedSecurityPhraseVal;
  }

  /**
   * Set the given status to the given tab
   *
   * @param name of the tab
   * @param status of the tab
   */
  public setTabStatus(name: string, status: string): void {
    if (this.essTabs !== undefined) {
      this.essTabs.map((tab) => {
        if (tab.name === name) {
          tab.status = status;
        }
        return tab;
      });
    }
  }

  /**
   * Convert Create ESS File form data into object that can be submitted to the API
   *
   * @returns Evacuation File record usable by the API
   */
  public createEvacFileDTO(): EvacuationFile {
    // Get Correct API values for Household Members selections

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

    const needsObject: NeedsAssessment = {
      insurance: this.insurance,

      householdMembers: this.householdMembers,

      pets: this.petsList,

      canProvideFood: needsFoodDTO,
      canProvideLodging: needsLodgingDTO,
      canProvideClothing: needsClothingDTO,
      canProvideTransportation: needsTransportationDTO,
      canProvideIncidentals: needsIncidentalsDTO
    };

    // Map out into DTO object and return
    return {
      primaryRegistrantId:
        this.appBaseService?.appModel?.selectedProfile?.selectedEvacueeInContext
          ?.id,
      completedBy: this.completedBy,
      completedOn: this.completedOn,
      manualFileId: this.evacueeSession.isPaperBased
        ? this.evacueeSearchService?.evacueeSearchContext
            ?.evacueeSearchParameters?.paperFileNumber
        : null,
      evacuatedFromAddress: this.locationService.setAddressObjectForDTO(
        this.evacAddress
      ),
      registrationLocation: this.facilityName,

      needsAssessment: needsObject,
      securityPhrase: this.securityPhrase,
      securityPhraseEdited: true,
      task: {
        taskNumber: this.userService.currentProfile?.taskNumber
      }
    };
  }

  /**
   * Convert Update ESS File form data into object that can be submitted to the API
   *
   * @returns Evacuation File record usable by the API
   */
  public updateEvacFileDTO(): EvacuationFile {
    // Get Correct API values for Household Members selections

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

    const needsObject: NeedsAssessment = {
      insurance: this.insurance,
   
      householdMembers: this.selectedHouseholdMembers,
   
      pets: this.petsList,

      canProvideFood: needsFoodDTO,
      canProvideLodging: needsLodgingDTO,
      canProvideClothing: needsClothingDTO,
      canProvideTransportation: needsTransportationDTO,
      canProvideIncidentals: needsIncidentalsDTO
    };

    // Map out into DTO object and return
    return {
      completedBy: this.completedBy,
      completedOn: this.completedOn,
      manualFileId: this.evacueeSession.isPaperBased
        ? this.evacueeSearchService?.evacueeSearchContext
            ?.evacueeSearchParameters?.paperFileNumber
        : null,
      evacuationFileDate: this.evacuationFileDate,
      primaryRegistrantId: this.primaryRegistrantId,

      evacuatedFromAddress: this.locationService.setAddressObjectForDTO(
        this.evacAddress
      ),
      registrationLocation: this.facilityName,

      needsAssessment: needsObject,
      securityPhrase: this.securityPhrase,
      securityPhraseEdited: this.editedSecurityPhrase,
      task: {
        taskNumber:
          this.taskNumber ?? this.userService.currentProfile?.taskNumber
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
    this.nextTabUpdate.next();

    // Important values not set on form
    // ESS File ID, Primary Registrant ID, and Task Number are set on EvacueeSession
    this.primaryAddress = undefined;
    this.taskNumber = undefined;

    // Evacuation Details tab
    this.paperESSFile = undefined;
    this.completedBy = undefined;
    this.completedOnVal = undefined;
    this.evacuatedFromPrimary = undefined;
    this.evacAddress = undefined;
    this.facilityName = undefined;
    this.insurance = undefined;

    // Household Members tab
    this.haveHouseHoldMembers = undefined;
    this.householdMembers = undefined;
    this.selectedHouseholdMembers = undefined;
    this.addMemberIndicator = undefined;
    this.addMemberFormIndicator = undefined;

    // Animals tab
    this.havePets = undefined;
    this.petsList = undefined;
    this.addPetIndicator = undefined;

    // Needs tab
    this.canRegistrantProvideClothing = undefined;
    this.canRegistrantProvideFood = undefined;
    this.canRegistrantProvideIncidentals = undefined;
    this.canRegistrantProvideLodging = undefined;
    this.canRegistrantProvideTransportation = undefined;

    // Security Phrase tab
    this.bypassPhrase = undefined;
    this.securityPhrase = undefined;
    this.originalSecurityPhrase = undefined;
    this.editedSecurityPhrase = undefined;
  }

  /**
   * Update the wizard's values with ones fetched from API
   */
  public setFormValuesFromFile(essFile: EvacuationFileModel) {
    this.selectedEssFile = essFile;
    this.primaryRegistrantId = essFile.primaryRegistrantId;

    this.appBaseService.wizardProperties = {
      lastCompletedStep: WizardSteps.Step2
    };
    this.computeState.triggerEvent();

    const essNeeds = essFile.needsAssessment;
    this.evacueeSession.currentNeedsAssessment = essNeeds;
    this.evacueeSession.evacFile = essFile;
    this.wizardService.createObjectReference(essFile, 'file');
    const primaryLastName = essFile.householdMembers?.find(
      (member) => member.type === HouseholdMemberType.Registrant
    ).lastName;

    //Additional Behind the scenes variables
    this.taskNumber = essFile.task.taskNumber;
    this.evacuationFileDate = essFile.evacuationFileDate;

    // Wizard variables
    //this.evacueeSession.essFileNumber = essFile.id;

    // Evacuation Details tab
    this.completedOn = essFile.completedOn;
    this.completedBy = essFile.completedBy;
    this.evacAddress = essFile.evacuatedFromAddress;
    this.facilityName = essFile.registrationLocation;

    this.evacuatedFromPrimary = globalConst.radioButtonOptions.find(
      (ins) => ins.apiValue === _.isEqual(this.primaryAddress, this.evacAddress)
    )?.value;

    this.insurance = essNeeds.insurance;

    // Household Members tab
    // Split main applicant from other household members, remap to UI model
    this.householdMembers = essFile.householdMembers?.map<HouseholdMemberModel>(
      (member) => {
        return {
          ...member,
          sameLastName: member.lastName === primaryLastName,
          householdMemberFromDatabase: true
        };
      }
    );

    this.selectedHouseholdMembers = undefined;

    this.haveHouseHoldMembers = globalConst.radioButtonOptions.find(
      (ins) => ins.apiValue === this.householdMembers?.length > 2
    )?.value;

    // Animals tab
    const petsArray = [];
    this.petsList = [...petsArray, ...essNeeds.pets];
    this.havePets = globalConst.radioButtonOptions.find(
      (ins) => ins.apiValue === essNeeds.pets?.length > 0
    )?.value;

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
    this.originalSecurityPhrase = essFile.securityPhrase;
    this.editedSecurityPhrase = essFile.securityPhraseEdited;
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
    return this.essTabs?.some(
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
  checkForPartialUpdates(form: UntypedFormGroup): boolean {
    const fields = [];
    Object.keys(form.controls).forEach((field) => {
      const control = form.controls[field] as
        | UntypedFormControl
        | UntypedFormGroup
        | UntypedFormArray;
      if (control instanceof UntypedFormControl) {
        if (control.value instanceof Object && control.value != null) {
          fields.push(control.value.length);
        } else {
          fields.push(control.value);
        }
      } else if (
        control instanceof UntypedFormGroup ||
        control instanceof UntypedFormArray
      ) {
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
   * Checks if the form is partially completed or not
   *
   * @param form form group
   * @returns true/false
   */
  checkForEvacDetailsPartialUpdates(form: UntypedFormGroup): boolean {
    const fields = [];
    Object.keys(form.controls).forEach((field) => {
      const control = form.controls[field] as
        | UntypedFormControl
        | UntypedFormGroup
        | UntypedFormArray;
      if (control instanceof UntypedFormControl) {
        if (control.value instanceof Object && control.value != null) {
          fields.push(control.value.length);
        } else {
          if (typeof control.value !== 'boolean') {
            fields.push(control.value);
          }
        }
      } else if (control instanceof UntypedFormGroup) {
        for (const key in control.controls) {
          if (control.controls.hasOwnProperty(key)) {
            fields.push(control.controls[key].value);
          }
        }
      }
    });
    const result = fields.filter((field) => !!field);
    return result.length > 2;
  }

  /**
   * Sets the tab status for the Review ESS File wizard
   */
  public setReviewEssFileTabStatus(): void {
    this.essTabs.map((tab) => {
      if (tab.name !== 'review') {
        tab.status = 'complete';
      }
      if (tab.name === 'household-members') {
        tab.status = 'incomplete';
      }
      if (
        this.securityPhrase === null ||
        this.securityPhrase === undefined ||
        this.securityPhrase === ''
      ) {
        if (tab.name === 'security-phrase') {
          tab.status = 'not-started';
        }
      }
      return tab;
    });
  }

  /**
   * Sets the tab status for the Complete ESS File wizard
   */
  public setCompleteEssFileTabStatus(): void {
    this.essTabs.map((tab) => {
      if (tab.name !== 'review') {
        tab.status = 'complete';
      }
      if (
        tab.name === 'household-members' ||
        tab.name === 'evacuation-details'
      ) {
        tab.status = 'incomplete';
      }
      return tab;
    });
  }

  public getTaskEndDate(): string {
    if (
      this.appBaseService?.wizardProperties?.wizardType ===
        WizardType.NewEssFile ||
      this.appBaseService?.wizardProperties?.wizardType ===
        WizardType.NewRegistration
    ) {
      return this.userService?.currentProfile?.taskStartDate;
    } else {
      return this.selectedEssFileVal?.task?.from;
    }
  }

  checkForEdit(): boolean {
    return this.appBaseService?.appModel?.selectedEssFile?.id !== null;
  }

  getNavLinks(name: string): TabModel {
    if (this.essTabs !== undefined) {
      return this.essTabs.find((tab) => tab.name === name);
    }
  }

  updateEditedFormStatus() {
    this.wizardService.editStatus$.subscribe((statues: TabStatusManager[]) => {
      const index = statues.findIndex((tab) => tab.tabUpdateStatus === true);
      if (index !== -1) {
        this.setTabStatus('review', 'incomplete');
        this.wizardService.setStepStatus('/ess-wizard/evacuee-profile', true);
        this.wizardService.setStepStatus('/ess-wizard/add-supports', true);
        this.wizardService.setStepStatus('/ess-wizard/add-notes', true);
      } else {
        if (!this.checkTabsStatus()) {
          this.wizardService.setStepStatus(
            '/ess-wizard/evacuee-profile',
            false
          );
          this.wizardService.setStepStatus('/ess-wizard/add-supports', false);
          this.wizardService.setStepStatus('/ess-wizard/add-notes', false);
          this.setTabStatus('review', 'complete');
        }
      }
    });
  }

  /**
   * Returns the correct task number based on the type of Wizard
   */
  public getTaskNumber(wizardType: string): string {
    switch (wizardType) {
      case 'new-registration':
        return this.userService.currentProfile?.taskNumber;

      case 'edit-registration':
        return this.taskNumber;

      case 'new-ess-file':
        return this.userService.currentProfile?.taskNumber;

      case 'review-file':
        return this.taskNumber;

      case 'complete-file':
        return this.userService.currentProfile?.taskNumber;
    }
  }
}
