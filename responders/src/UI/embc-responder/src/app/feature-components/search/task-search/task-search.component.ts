import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { TaskSearchService } from './task-search.service';
import * as globalConst from '../../../core/services/global-constants';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss']
})
export class TaskSearchComponent implements OnInit {
  taskSearchForm: FormGroup;
  showLoader = false;
  isSubmitted = false;

  constructor(
    private builder: FormBuilder,
    private customValidation: CustomValidationService,
    private router: Router,
    private taskSearchService: TaskSearchService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.constructTaskSearchForm();
  }

  get taskSearchFormControl(): { [key: string]: AbstractControl } {
    return this.taskSearchForm.controls;
  }

  constructTaskSearchForm(): void {
    this.taskSearchForm = this.builder.group({
      taskNumber: ['', [this.customValidation.whitespaceValidator()]]
    });
  }

  submitTask(): void {
    this.showLoader = !this.showLoader;
    this.isSubmitted = !this.isSubmitted;
    this.taskSearchService
      .searchTask(this.taskSearchForm.get('taskNumber').value)
      .subscribe(
        (result) => {
          this.router.navigate(['/responder-access/search/task-details'], {
            state: { essTask: result }
          });
        },
        (error) => {
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
            this.alertService.setAlert('danger', globalConst.taskSearchError);
          }
        }
      );
  }
}
