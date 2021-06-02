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

  /**
   * Return the index of current step of the wizard, based on the submitted URL
   *
   * @param url URL of current page, typically retrieved from this.router.url
   */
  public getCurrentStep(currentUrl: string): number {
    let curStep = -1;
    currentUrl = currentUrl.toLowerCase();

    this.menuItems.every((item, index) => {
      const route = item.route.toLowerCase();

      // If match is found, set value and stop loop
      if (currentUrl.startsWith(route)) {
        curStep = index;
        return false;
      }

      return true;
    });

    return curStep;
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
