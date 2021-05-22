import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { TabModel } from 'src/app/core/models/tab.model';
import { SecurityQuestionsService } from 'src/app/core/services/security-questions.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { StepCreateProfileService } from './step-create-profile.service';

@Component({
  selector: 'app-step-create-profile',
  templateUrl: './step-create-profile.component.html',
  styleUrls: ['./step-create-profile.component.scss']
})
export class StepCreateProfileComponent implements OnDestroy {
  questionListSubscription: Subscription;

  stepId: string;
  stepName: string;
  tabs: Array<TabModel> = new Array<TabModel>();

  constructor(
    private router: Router,
    private stepCreateProfileService: StepCreateProfileService,
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
    this.tabs = this.stepCreateProfileService.tabs;

    // Load security question list as soon as wizard is initialized
    this.securityQuestionsService.getSecurityQuestionList().subscribe(
      (questions) => {
        this.stepCreateProfileService.securityQuestionOptions = questions;
      },
      (error) => {
        if (error?.error?.title)
          this.alertService.setAlert('danger', error.error.title);
        else
          this.alertService.setAlert(
            'danger',
            'An error has occurred. Please refresh and try again.'
          );
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
    this.stepCreateProfileService.nextTabUpdate.next();
    this.stepCreateProfileService.isAllowed(tabRoute, $event);
  }

  /**
   * Explicitly deactivate Question List subscription when wizard is finished
   */
  ngOnDestroy() {
    this.questionListSubscription.unsubscribe();
  }
}
