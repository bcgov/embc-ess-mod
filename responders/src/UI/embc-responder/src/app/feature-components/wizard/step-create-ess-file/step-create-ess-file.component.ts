import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TabModel } from 'src/app/core/models/tab.model';
import { StepCreateEssFileService } from './step-create-ess-file.service';

@Component({
  selector: 'app-step-create-ess-file',
  templateUrl: './step-create-ess-file.component.html',
  styleUrls: ['./step-create-ess-file.component.scss']
})
export class StepCreateEssFileComponent {
  stepId: string;
  stepName: string;
  tabs: Array<TabModel> = new Array<TabModel>();

  constructor(
    private router: Router,
    private stepCreateEssFileService: StepCreateEssFileService
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
    this.tabs = this.stepCreateEssFileService.tabs;
  }

  /**
   * Determines if the tab navigation is allowed or not
   *
   * @param tabRoute clicked route
   * @param $event mouse click event
   */
  isAllowed(tabRoute: string, $event: MouseEvent): void {
    this.stepCreateEssFileService.nextTabUpdate.next();
    this.stepCreateEssFileService.isAllowed(tabRoute, $event);
  }
}
