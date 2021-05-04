import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSecurityQuestionsComponent } from './profile-security-questions.component';
import { ProfileSecurityQuestionsComponentRoutingModule } from './profile-security-questions-routing.module';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [ProfileSecurityQuestionsComponent],
  imports: [
    CommonModule,
    ProfileSecurityQuestionsComponentRoutingModule,
    MaterialModule
  ]
})
export class ProfileSecurityQuestionsModule {}
