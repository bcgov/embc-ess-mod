import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SecurityQuestionsRoutingModule } from './security-questions-routing.module';
import { SecurityQuestionsComponent } from './security-questions.component';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    SecurityQuestionsRoutingModule,
    ReactiveFormsModule,
    SecurityQuestionsComponent
  ]
})
export class SecurityQuestionsModule {}
