import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileSecurityQuestionsComponent } from './profile-security-questions.component';

const routes: Routes = [
  { path: '', component: ProfileSecurityQuestionsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileSecurityQuestionsComponentRoutingModule {}
