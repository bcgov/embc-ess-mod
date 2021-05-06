import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TabModel } from 'src/app/core/models/tab.model';
import { StepCreateProfileService } from './step-create-profile.service';

@Component({
  selector: 'app-step-create-profile',
  templateUrl: './step-create-profile.component.html',
  styleUrls: ['./step-create-profile.component.scss']
})
export class StepCreateProfileComponent {
  stepId: string;
  stepName: string;
  tabs: Array<TabModel> = new Array<TabModel>();

  constructor(
    private router: Router,
    private stepCreateProfileService: StepCreateProfileService
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
    this.tabs = this.stepCreateProfileService.tabs;
  }

  /**
   * Determines if the tab navigation is allowed or not
   *
   * @param tabRoute clicked route
   * @param $event mouse click event
   * @returns true/false
   */
  isAllowed(tabRoute: string, $event: MouseEvent): void {
    this.stepCreateProfileService.isAllowed(tabRoute, $event);
  }

  test(){
    console.log('well')
  }
}
