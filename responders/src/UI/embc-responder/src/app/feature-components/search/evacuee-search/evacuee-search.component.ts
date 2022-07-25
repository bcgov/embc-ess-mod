import { Component, OnInit } from '@angular/core';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { UserService } from 'src/app/core/services/user.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { TaskSearchService } from '../task-search/task-search.service';
import { EvacueeSearchService } from './evacuee-search.service';
import * as globalConst from '../../../core/services/global-constants';
import { EssTaskModel } from '../../../core/models/ess-task.model';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';
import { ComputeRulesService } from 'src/app/core/services/computeRules.service';

@Component({
  selector: 'app-evacuee-search',
  templateUrl: './evacuee-search.component.html',
  styleUrls: ['./evacuee-search.component.scss']
})
export class EvacueeSearchComponent implements OnInit {
  isLoading = true;
  showDataEntryComponent = false;
  showPhotoIDComponent = false;
  showResultsComponent = false;

  constructor(
    private evacueeSessionService: EvacueeSessionService,
    private evacueeSearchService: EvacueeSearchService,
    private alertService: AlertService,
    private userService: UserService,
    private taskSearchService: TaskSearchService,
    private appBaseService: AppBaseService,
    private computeState: ComputeRulesService
  ) {}

  ngOnInit(): void {
    this.evacueeSessionService.clearEvacueeSession();
    this.evacueeSearchService.clearEvacueeSearch();
    this.appBaseService.clearEvacueeProperties();
    this.checkTaskStatus();
    this.computeState.triggerEvent();
  }

  private checkTaskStatus(): void {
    const taskNumber = this.userService?.currentProfile?.taskNumber;
    this.taskSearchService.searchTask(taskNumber).subscribe({
      next: (result: EssTaskModel) => {
        this.isLoading = !this.isLoading;
        this.showDataEntryComponent = !this.showDataEntryComponent;
        this.userService.updateTaskNumber(
          result.id,
          result.status,
          result.communityName,
          result.startDate,
          result.endDate
        );
        this.evacueeSessionService.isPaperBased =
          result.status === 'Expired' ? true : false;
      },
      error: (error) => {
        this.isLoading = !this.isLoading;
        this.alertService.clearAlert();
        this.alertService.setAlert('danger', globalConst.taskSearchError);
      }
    });
  }
}
