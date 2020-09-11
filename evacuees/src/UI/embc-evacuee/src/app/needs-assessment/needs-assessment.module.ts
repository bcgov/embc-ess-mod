import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NeedsAssessmentRoutingModule } from './needs-assessment-routing.module';
import { NeedsAssessmentComponent } from './needs-assessment.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EvacueeProfileFormsModule } from '../core/components/evacuee-profile-forms.module';
import { ReviewModule } from '../core/components/review/review.module'

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
    EvacueeProfileFormsModule,
    ReviewModule
  ]
})
export class NeedsAssessmentModule { }
