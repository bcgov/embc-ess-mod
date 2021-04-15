import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidationService } from 'src/app/core/services/customValidation.service';

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss']
})
export class TaskSearchComponent implements OnInit {

  taskSearchForm: FormGroup;

  constructor(private builder: FormBuilder, private customValidation: CustomValidationService,
              private router: Router) { }

  ngOnInit(): void {
    this.constructTaskSearchForm();
  }

  get taskSearchFormControl(): { [key: string]: AbstractControl; } {
    return this.taskSearchForm.controls;
  }

  constructTaskSearchForm(): void {
    this.taskSearchForm = this.builder.group({
      taskNumber: ['', [this.customValidation.whitespaceValidator()]]
    });
  }

  submitTask(): void {
    this.router.navigate(['/responder-access/search/task-details'], {state: {taskNumber: this.taskSearchForm.get('taskNumber').value}});
  }

}
