import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Code } from 'src/app/core/api/models';
import { StepSupportsService } from '../../step-supports/step-supports.service';

@Component({
  selector: 'app-select-support',
  templateUrl: './select-support.component.html',
  styleUrls: ['./select-support.component.scss']
})
export class SelectSupportComponent implements OnInit {
  supportList: Code[] = [];
  supportTypeForm: FormGroup;

  constructor(
    public stepSupportsService: StepSupportsService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.supportList = this.stepSupportsService.getSupportTypeList();
    this.stepSupportsService.supportDetails = null;
    this.stepSupportsService.supportDelivery = null;
    this.createVerificationForm();
  }

  createVerificationForm(): void {
    this.supportTypeForm = this.formBuilder.group({
      type: ['', [Validators.required]]
    });
  }

  /**
   * Returns the control of the form
   */
  get typeFormControl(): { [key: string]: AbstractControl } {
    return this.supportTypeForm.controls;
  }

  back() {
    this.router.navigate(['/ess-wizard/add-supports/view']);
  }

  addDetails() {
    if (!this.supportTypeForm.valid) {
      this.supportTypeForm.get('type').markAsTouched();
    } else {
      this.stepSupportsService.supportTypeToAdd =
        this.supportTypeForm.get('type').value;
      this.router.navigate(['/ess-wizard/add-supports/details']);
    }
  }
}
