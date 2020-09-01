import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreRegistrationComponent } from './pre-registration.component'

const routes: Routes = [
  { path: '', component: PreRegistrationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreRegistrationRoutingModule { }
