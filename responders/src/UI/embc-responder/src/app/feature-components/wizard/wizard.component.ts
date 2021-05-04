import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  WizardSidenavModel,
  WizardSidenavModelValues
} from 'src/app/core/models/wizard-sidenav.model';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {
  sideNavMenu: Array<WizardSidenavModel> =
    WizardSidenavModelValues.newRegistrationMenu;

  constructor(private router: Router) {
    // for (const items of WizardSidenavModelValues.newRegistrationMenu) {
    //   this.sideNavMenu.push(Object.assign(new WizardSidenavModel(), items));
    // }
  }

  ngOnInit(): void {
    this.loadDefaultStep();
  }

  loadDefaultStep(): void {
    if (this.sideNavMenu !== null && this.sideNavMenu !== undefined) {
      const firstStepUrl = this.sideNavMenu[0].route;
      const firstStepId = this.sideNavMenu[0].step;
      const firstStepTitle = this.sideNavMenu[0].title;
      this.router.navigate([firstStepUrl], {
        state: { step: firstStepId, title: firstStepTitle }
      });
    }
  }
}
