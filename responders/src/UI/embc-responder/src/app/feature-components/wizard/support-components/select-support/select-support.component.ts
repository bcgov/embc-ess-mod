import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Code } from 'src/app/core/api/models';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { LoadEvacueeListService } from 'src/app/core/services/load-evacuee-list.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';

@Component({
  selector: 'app-select-support',
  templateUrl: './select-support.component.html',
  styleUrls: ['./select-support.component.scss']
})
export class SelectSupportComponent implements OnInit {
  supportList: Code[] = [];
  supportTypeForm: UntypedFormGroup;

  constructor(
    public stepSupportsService: StepSupportsService,
    private loadEvacueeListService: LoadEvacueeListService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    public evacueeSessionService: EvacueeSessionService
  ) {}

  ngOnInit(): void {
    this.supportList = this.loadEvacueeListService
      .getSupportTypeList()
      .filter((element) => element.description !== '');
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
