import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityQuestionsComponent } from './security-questions.component';

const routes: Routes = [{ path: '', component: SecurityQuestionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityQuestionsRoutingModule {}
