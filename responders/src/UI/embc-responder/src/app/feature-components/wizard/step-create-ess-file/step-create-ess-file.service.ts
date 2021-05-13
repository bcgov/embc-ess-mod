import { Injectable } from '@angular/core';
import { TabModel, WizardTabModelValues } from 'src/app/core/models/tab.model';

@Injectable({ providedIn: 'root' })
export class StepCreateEssFileService {
  private essTabs: Array<TabModel> = WizardTabModelValues.essFileTabs;
  private paperESSFile: string;
  private evacuatedFromPrimary: boolean;
  private facilityName: string;
  private insurance: string;
  private householdAffected: string;
  private emergencySupportServices: string;
  private referredServices: boolean;
  private referredServiceDetails: string[] = [];
  private externalServices: string;

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

  public get facilityNames(): string {
    return this.facilityName;
  }
  public set facilityNames(facilityName: string) {
    this.facilityName = facilityName;
  }

  public get insuranceInfo(): string {
    return this.insurance;
  }
  public set insuranceInfo(insurance: string) {
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
}
