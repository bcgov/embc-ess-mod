import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TabModel } from 'src/app/core/models/tab.model';
import { SecurityQuestionsService } from 'src/app/core/services/security-questions.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepEvacueeProfileService } from './step-evacuee-profile.service';
import * as globalConst from '../../../core/services/global-constants';

@Component({
  selector: 'app-step-evacuee-profile',
  templateUrl: './step-evacuee-profile.component.html',
  styleUrls: ['./step-evacuee-profile.component.scss']
})
export class StepEvacueeProfileComponent {
  questionListSubscription: Subscription;

  stepId: string;
  stepName: string;
  tabs: Array<TabModel> = new Array<TabModel>();

  constructor(
    private router: Router,
    private stepEvacueeProfileService: StepEvacueeProfileService,
    private securityQuestionsService: SecurityQuestionsService,
    private alertService: AlertService
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

    // Load security question list as soon as wizard is initialized
    this.securityQuestionsService.getSecurityQuestionList().subscribe(
      (questions) => {
        this.stepEvacueeProfileService.securityQuestionOptions = questions;
      },
      (error) => {
        if (error?.error?.title)
          this.alertService.setAlert('danger', error.error.title);
        else this.alertService.setAlert('danger', globalConst.genericError);
      }
    );
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
