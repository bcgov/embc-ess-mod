import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TabModel } from 'src/app/core/models/tab.model';
import { WizardDataService } from '../wizard-data.service';
import { StepEssFileService } from './step-ess-file.service';

@Component({
  selector: 'app-step-ess-file',
  templateUrl: './step-ess-file.component.html',
  styleUrls: ['./step-ess-file.component.scss']
})
export class StepEssFileComponent {
  stepId: string;
  stepName: string;
  tabs: Array<TabModel> = new Array<TabModel>();

  constructor(
    private router: Router,
    private stepEssFileService: StepEssFileService,
    private wizardDataService: WizardDataService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state as {
          step: string;
          title: string;
        };
        this.stepId = state.step;
        this.stepName = state.title;
        if (
          this.stepEssFileService.essTabs === undefined ||
          this.stepEssFileService.essTabs.length == 0
        ) {
          this.stepEssFileService.essTabs = this.wizardDataService.createNewESSFileSteps();
        }
      }
    }
    this.tabs = this.stepEssFileService.essTabs;
  }

  /**
   * Determines if the tab navigation is allowed or not
   *
   * @param tabRoute clicked route
   * @param $event mouse click event
   */
  isAllowed(tabRoute: string, $event: MouseEvent): void {
    this.stepEssFileService.nextTabUpdate.next();
    this.stepEssFileService.isAllowed(tabRoute, $event);
  }
}
