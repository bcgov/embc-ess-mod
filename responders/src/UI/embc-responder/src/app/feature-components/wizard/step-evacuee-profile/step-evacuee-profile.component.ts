import { Component } from '@angular/core';
import { Router, RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { TabModel } from 'src/app/core/models/tab.model';
import { StepEvacueeProfileService } from './step-evacuee-profile.service';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { NgClass } from '@angular/common';
import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';

/**
 * Initializes the profile tabs layout and defines navigation rules
 */
@Component({
  selector: 'app-step-evacuee-profile',
  templateUrl: './step-evacuee-profile.component.html',
  styleUrls: ['./step-evacuee-profile.component.scss'],
  standalone: true,
  imports: [MatTabNav, MatTabLink, RouterLinkActive, RouterLink, NgClass, AlertComponent, MatTabNavPanel, RouterOutlet]
})
export class StepEvacueeProfileComponent {
  stepId: string;
  stepName: string;
  tabs: Array<TabModel> = new Array<TabModel>();

  constructor(
    private router: Router,
    private stepEvacueeProfileService: StepEvacueeProfileService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state as {
          step: string;
          title: string;
        };
        this.stepId = state.step;
        this.stepName = state.title;
      }
    }

    this.tabs = this.stepEvacueeProfileService.profileTabs;
    this.stepEvacueeProfileService.loadTab(this.tabs);
    this.stepEvacueeProfileService.loadSecurityQuestions();
  }

  /**
   * Determines if the tab navigation is allowed or not
   *
   * @param tabRoute clicked route
   * @param $event mouse click event
   * @returns true/false
   */
  isAllowed(tabRoute: string, $event: MouseEvent): void {
    this.stepEvacueeProfileService.nextTabUpdate.next();
    this.stepEvacueeProfileService.isAllowed(tabRoute, $event);
  }
}
