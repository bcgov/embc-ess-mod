import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

import { SecurityQuestionsRoutingModule } from './security-questions-routing.module';
import { SecurityQuestionsComponent } from './security-questions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomPipeModule } from 'src/app/shared/pipes/customPipe.module';

@NgModule({
  declarations: [SecurityQuestionsComponent],
  imports: [
    CommonModule,
    CustomPipeModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    SecurityQuestionsRoutingModule,
    ReactiveFormsModule
  ]
})
export class SecurityQuestionsModule {}
