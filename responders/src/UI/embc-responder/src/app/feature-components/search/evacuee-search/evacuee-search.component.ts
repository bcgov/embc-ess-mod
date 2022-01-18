import { Component, OnInit } from '@angular/core';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { UserService } from 'src/app/core/services/user.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { TaskSearchService } from '../task-search/task-search.service';
import { EvacueeSearchService } from './evacuee-search.service';
import * as globalConst from '../../../core/services/global-constants';

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
    private taskSearchService: TaskSearchService
  ) {
    this.evacueeSearchService.getCategoryList();
    this.evacueeSearchService.getSubCategoryList();
  }

  ngOnInit(): void {
    this.evacueeSessionService.clearEvacueeSession();
    this.evacueeSearchService.clearEvacueeSearch();
    this.checkTaskStatus();
  }

  /**
   * Receives the emitted event from data-entry child and changes the component to show
   */
  changeDataEntryComponent(value: boolean): void {
    this.showDataEntryComponent = value;
  }

  /**
   * Receives the emitted event from evacuee-id-verify child and changes the component to show
   */
  changeVerifyIdComponent(value: boolean): void {
    this.showPhotoIDComponent = value;
  }

  /**
   * Receives the emitted event from evacuee-name-search child and changes the component to show
   */
  changeResultsComponent(value: boolean): void {
    this.showResultsComponent = value;
  }

  allowNewSearch($event: boolean): void {
    this.showPhotoIDComponent = $event;
    this.showResultsComponent = !$event;
  }

  private checkTaskStatus(): void {
    const taskNumber = this.userService?.currentProfile?.taskNumber;
    this.taskSearchService.searchTask(taskNumber).subscribe({
      next: (result) => {
        this.isLoading = !this.isLoading;
        this.showDataEntryComponent = !this.showDataEntryComponent;
        this.userService.updateTaskNumber(result.id, result.status);
        this.evacueeSearchService.paperBased =
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
