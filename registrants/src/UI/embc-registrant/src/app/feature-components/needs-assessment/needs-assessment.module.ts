import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NeedsAssessmentRoutingModule } from './needs-assessment-routing.module';
import { NeedsAssessmentComponent } from './needs-assessment.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ReviewModule } from '../review/review.module';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { CoreModule } from '../../core/core.module';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  imports: [
    CommonModule,
    NeedsAssessmentRoutingModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReviewModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDialogModule,
    CoreModule,
    RecaptchaFormsModule,
    RecaptchaModule,
    NeedsAssessmentComponent
  ]
})
export class NeedsAssessmentModule {}
