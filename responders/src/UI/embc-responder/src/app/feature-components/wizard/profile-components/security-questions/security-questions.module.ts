import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityQuestionsRoutingModule } from './security-questions-routing.module';
import { SecurityQuestionsComponent } from './security-questions.component';

@NgModule({
  declarations: [SecurityQuestionsComponent],
  imports: [CommonModule, SecurityQuestionsRoutingModule]
})
export class SecurityQuestionsModule {}
