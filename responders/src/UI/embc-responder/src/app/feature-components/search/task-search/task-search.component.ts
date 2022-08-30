import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { TaskSearchService } from './task-search.service';
import * as globalConst from '../../../core/services/global-constants';
import { AppBaseService } from 'src/app/core/services/helper/appBase.service';

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss']
})
export class TaskSearchComponent implements OnInit {
  taskSearchForm: UntypedFormGroup;
  showLoader = false;
  isSubmitted = false;

  constructor(
    private builder: UntypedFormBuilder,
    private customValidation: CustomValidationService,
    private router: Router,
    private taskSearchService: TaskSearchService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.constructTaskSearchForm();
  }

  /**
   * Return form control
   */
  get taskSearchFormControl(): { [key: string]: AbstractControl } {
    return this.taskSearchForm.controls;
  }

  /**
   * Constructs task search form
   */
  constructTaskSearchForm(): void {
    this.taskSearchForm = this.builder.group({
      taskNumber: ['', [this.customValidation.whitespaceValidator()]]
    });
  }

  /**
   * Submits the task number
   * 1. If successful, navigates to task details page
   * 2. If error code is 404, updates the task status to 'invalid'
   * and navigates to task details page
   * 3. In case of any other error, displays the error banner
   */
  submitTask(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    this.taskSearchService
      .searchTask(this.taskSearchForm.get('taskNumber').value)
      .subscribe({
        next: (result) => {
          this.router.navigate(['/responder-access/search/task-details'], {
            state: { essTask: result }
          });
        },
        error: (error) => {
          if (error?.status && error?.status === 404) {
            this.router.navigate(['/responder-access/search/task-details'], {
              state: {
                essTask: {
                  id: this.taskSearchForm.get('taskNumber').value,
                  status: 'Invalid'
                }
              }
            });
          } else {
            this.showLoader = !this.showLoader;
            this.isSubmitted = !this.isSubmitted;
            this.alertService.clearAlert();
            this.alertService.setAlert('danger', globalConst.taskSearchError);
          }
        }
      });
  }
}
