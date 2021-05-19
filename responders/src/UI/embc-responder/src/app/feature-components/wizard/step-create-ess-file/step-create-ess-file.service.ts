import { Injectable } from '@angular/core';
import {
  InsuranceOption,
  NeedsAssessment
} from 'src/app/core/models/evacuation-file';
import { Address } from 'src/app/core/models/profile';
import { TabModel, WizardTabModelValues } from 'src/app/core/models/tab.model';
import { StepCreateProfileService } from '../step-create-profile/step-create-profile.service';
import * as globalConst from '../../../core/services/global-constants';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { InformationDialogComponent } from 'src/app/shared/components/dialog-components/information-dialog/information-dialog.component';

@Injectable({ providedIn: 'root' })
export class StepCreateEssFileService {
  private essTabs: Array<TabModel> = WizardTabModelValues.essFileTabs;
  private paperESSFile: string;
  private evacuatedFromPrimary: boolean;
  private evacAddress: Address;
  private facilityName: string;
  private insurance: InsuranceOption;
  private householdAffected: string;
  private emergencySupportServices: string;
  private referredServices: boolean;
  private referredServiceDetails: string[] = [];
  private externalServices: string;

  constructor(
    private strepCreateProfileService: StepCreateProfileService,
    private dialog: MatDialog
  ) {}

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

  public get evacAddresS(): Address {
    return this.evacAddress;
  }
  public set evacAddresS(evacAddress: Address) {
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

  public get tabs(): Array<TabModel> {
    return this.essTabs;
  }
  public set tabs(tabs: Array<TabModel>) {
    this.essTabs = tabs;
  }

  public setTabStatus(name: string, status: string): void {
    this.tabs.map((tab) => {
      if (tab.name === name) {
        tab.status = status;
      }
      return tab;
    });
  }

  public createNeedsAssessmentDTO(): NeedsAssessment {
    console.log({
      paperESSFile: this.paperESSFile,
      facilityName: this.facilityName,
      insurance: this.insurance,
      householdAffected: this.householdAffected,
      emergencySupportServices: this.emergencySupportServices,
      referredServices: this.referredServices,
      referredServiceDetails: this.referredServiceDetails,
      externalServices: this.externalServices,
      evacAddress: this.strepCreateProfileService.setAddressObject(
        this.evacAddress
      )
    });

    return {
      paperESSFile: this.paperESSFile,
      facilityName: this.facilityName,
      insurance: this.insurance,
      householdAffected: this.householdAffected,
      emergencySupportServices: this.emergencySupportServices,
      referredServices: this.referredServices,
      referredServiceDetails: this.referredServiceDetails,
      externalServices: this.externalServices
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
  openModal(text: string): void {
    this.dialog.open(DialogComponent, {
      data: {
        component: InformationDialogComponent,
        text
      },
      height: '230px',
      width: '530px'
    });
  }
}
