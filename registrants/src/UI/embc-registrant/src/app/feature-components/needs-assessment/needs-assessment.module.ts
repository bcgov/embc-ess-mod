import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NeedsAssessmentRoutingModule } from './needs-assessment-routing.module';
import { NeedsAssessmentComponent } from './needs-assessment.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { ComponentWrapperModule } from '../../sharedModules/components/component-wrapper/component-wrapper.module';
import { ReviewModule } from '../review/review.module';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
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
