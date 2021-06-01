import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvacueeProfileDashboardComponent } from './evacuee-profile-dashboard.component';

const routes: Routes = [
  { path: '', component: EvacueeProfileDashboardComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvacueeProfileDashboardRoutingModule {}
