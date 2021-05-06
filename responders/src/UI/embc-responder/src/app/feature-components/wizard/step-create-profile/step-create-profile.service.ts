import { Injectable } from '@angular/core';
import { TabModel, WizardTabModelValues } from 'src/app/core/models/tab.model';

@Injectable({ providedIn: 'root' })
export class StepCreateProfileService {
  private profileTabs: Array<TabModel> =
    WizardTabModelValues.evacueeProfileTabs;

  public get tabs(): Array<TabModel> {
    return this.profileTabs;
  }
  public set tabs(tabs: Array<TabModel>) {
    this.profileTabs = tabs;
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
