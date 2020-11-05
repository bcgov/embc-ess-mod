import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NeedsAssessmentRoutingModule } from './needs-assessment-routing.module';
import { NeedsAssessmentComponent } from './needs-assessment.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ComponentWrapperModule } from '../../../core/components/component-wrapper/component-wrapper.module';
import { ReviewModule } from '../../../core/components/review/review.module';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    NeedsAssessmentComponent
  ],
  imports: [
    CommonModule,
    NeedsAssessmentRoutingModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ComponentWrapperModule,
    ReviewModule,
    MatSelectModule,
    MatAutocompleteModule
  ]
})
export class NeedsAssessmentModule { }
