import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EssTaskModel } from 'src/app/core/models/ess-task.model';
import { UserService } from 'src/app/core/services/user.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { TaskSearchService } from '../task-search.service';
import * as globalConst from '../../../../core/services/global-constants';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss']
})
export class TaskDetailsComponent implements OnInit {
  essTask: EssTaskModel;
  taskNumber: string;
  showLoader = false;
  isSubmitted = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private taskSearchService: TaskSearchService,
    private alertService: AlertService,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService
  ) {
    if (this.router.getCurrentNavigation() !== null) {
      if (this.router.getCurrentNavigation().extras.state !== undefined) {
        const state = this.router.getCurrentNavigation().extras.state
          .essTask as EssTaskModel;
        this.essTask = state;
        this.taskNumber = state.id;
      }
    }
  }

  ngOnInit(): void {}

  /**
   * Navigates to task search page
   */
  searchTask(): void {
    this.router.navigate(['/responder-access/search/task']);
  }

  /**
   * Updates the signed in task number and navigates to evacuee
   * search
   */
  signInTask(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    this.taskSearchService.taskSignIn(this.taskNumber).subscribe({
      next: () => {
        this.updateTaskNumberValues();
        this.router.navigate(['/responder-access/search/evacuee']);
      },
      error: () => {
        this.showLoader = !this.showLoader;
        this.isSubmitted = !this.isSubmitted;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.taskSignInError);
      }
    });
  }

  updateTaskNumberValues(): void {
    this.appBaseService.appModel = { selectedEssTask: this.essTask };
    this.computeState.triggerEvent();
    this.userService.updateTaskNumber(
      this.essTask?.id,
      this.essTask?.status,
      this.essTask?.communityName,
      this.essTask?.startDate,
      this.essTask?.endDate
    );
  }
}
