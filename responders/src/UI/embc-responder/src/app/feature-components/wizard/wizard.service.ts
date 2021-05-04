import { Injectable } from '@angular/core';
import {
  WizardSidenavModel,
  WizardSidenavModelValues
} from 'src/app/core/models/wizard-sidenav.model';

@Injectable({ providedIn: 'root' })
export class WizardService {
  private sideMenuItems: Array<WizardSidenavModel> =
    WizardSidenavModelValues.newRegistrationMenu;

  public get menuItems(): Array<WizardSidenavModel> {
    return this.sideMenuItems;
  }
  public set menuItems(menuItems: Array<WizardSidenavModel>) {
    this.sideMenuItems = menuItems;
  }

  public setStepStatus(name: string, status: boolean): void {
    this.menuItems.map((menu) => {
      if (menu.route === name) {
        menu.isLocked = status;
      }
      return menu;
    });
  }
}
