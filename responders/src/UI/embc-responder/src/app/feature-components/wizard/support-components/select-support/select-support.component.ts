import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { Code, SupportCategory, SupportSubCategory } from 'src/app/core/api/models';
import { EvacueeSessionService } from 'src/app/core/services/evacuee-session.service';
import { LoadEvacueeListService } from 'src/app/core/services/load-evacuee-list.service';
import { StepSupportsService } from '../../step-supports/step-supports.service';
import * as globalConst from '../../../../core/services/global-constants';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';

import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';

@Component({
  selector: 'app-select-support',
  templateUrl: './select-support.component.html',
  styleUrls: ['./select-support.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatError,
    MatButton,
    MatCard,
    MatCardContent
  ]
})
export class SelectSupportComponent implements OnInit {
  supportList: Code[] = [];
  supportTypeForm: UntypedFormGroup;
  noAssistanceRequiredMessage = globalConst.noAssistanceRequired;

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
      .filter(
        (element) =>
          element.description !== '' &&
          element.value !== SupportSubCategory.Lodging_Billeting &&
          element.value !== SupportCategory.Lodging
      );
    this.stepSupportsService.supportDetails = null;
    this.stepSupportsService.supportDelivery = null;
    this.createVerificationForm();
  }

  public getIdentifiedNeeds(): string[] {
    return Array.from(this.evacueeSessionService?.currentNeedsAssessment?.needs ?? []).map(
      (need) => this.loadEvacueeListService?.getIdentifiedNeeds()?.find((value) => value.value === need)?.description
    );
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
      this.stepSupportsService.supportTypeToAdd = this.supportTypeForm.get('type').value;
      this.router.navigate(['/ess-wizard/add-supports/details']);
    }
  }
}
