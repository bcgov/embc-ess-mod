import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSecurityQuestionsComponent } from './profile-security-questions.component';
import { ProfileSecurityQuestionsComponentRoutingModule } from './profile-security-questions-routing.module';

import { SecurityQuestionCardComponent } from './security-question-card/security-question-card.component';

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ProfileSecurityQuestionsComponentRoutingModule,
    ReactiveFormsModule,
    ProfileSecurityQuestionsComponent,
    SecurityQuestionCardComponent
  ]
})
export class ProfileSecurityQuestionsModule {}
