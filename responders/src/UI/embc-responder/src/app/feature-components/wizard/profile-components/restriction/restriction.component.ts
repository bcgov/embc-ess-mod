import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { StepCreateProfileService } from '../../step-create-profile/step-create-profile.service';

@Component({
  selector: 'app-restriction',
  templateUrl: './restriction.component.html',
  styleUrls: ['./restriction.component.scss']
})
export class RestrictionComponent implements OnInit {
  restrictionForm: FormGroup;

  constructor(
    private router: Router,
    private stepCreateProfileService: StepCreateProfileService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createRestrictionForm();
  }

  createRestrictionForm(): void {
    this.restrictionForm = this.formBuilder.group({
      restrictedAccess: ['', [Validators.required]]
    });
  }

  /**
   * Returns the control of the form
   */
  get restrFormControl(): { [key: string]: AbstractControl } {
    return this.restrictionForm.controls;
  }

  /**
   * Updates the tab status and navigate to next tab
   */
  next(): void {
    this.stepCreateProfileService.setTabStatus('restriction', 'complete');
    this.router.navigate([
      '/ess-wizard/create-evacuee-profile/security-questions'
    ]);
  }
}
