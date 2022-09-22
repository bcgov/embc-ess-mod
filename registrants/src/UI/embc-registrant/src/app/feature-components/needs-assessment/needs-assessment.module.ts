import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NeedsAssessmentRoutingModule } from './needs-assessment-routing.module';
import { NeedsAssessmentComponent } from './needs-assessment.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ComponentWrapperModule } from '../../sharedModules/components/component-wrapper/component-wrapper.module';
import { ReviewModule } from '../review/review.module';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { CoreModule } from '../../core/core.module';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  declarations: [NeedsAssessmentComponent],
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
    MatAutocompleteModule,
    MatDialogModule,
    CoreModule,
    RecaptchaFormsModule,
    RecaptchaModule
  ]
})
export class NeedsAssessmentModule {}
