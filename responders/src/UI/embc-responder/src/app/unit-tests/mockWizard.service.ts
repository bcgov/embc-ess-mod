import { Injectable } from '@angular/core';
import { WizardSidenavModel } from '../core/models/wizard-sidenav.model';
import { WizardService } from '../feature-components/wizard/wizard.service';

@Injectable({ providedIn: 'root' })
export class MockWizardService extends WizardService {
  public menuItemValue: Array<WizardSidenavModel>;

  public get menuItems(): Array<WizardSidenavModel> {
    return this.menuItemValue;
  }
  public set menuItems(menuItems: Array<WizardSidenavModel>) {
    this.menuItemValue = menuItems;
  }
}
