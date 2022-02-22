import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSecurityQuestionsComponent } from './profile-security-questions.component';
import { ProfileSecurityQuestionsComponentRoutingModule } from './profile-security-questions-routing.module';
import { MaterialModule } from 'src/app/material.module';
import { SecurityQuestionCardComponent } from './security-question-card/security-question-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProfileSecurityQuestionsComponent,
    SecurityQuestionCardComponent
  ],
  imports: [
    CommonModule,
    ProfileSecurityQuestionsComponentRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class ProfileSecurityQuestionsModule {}
