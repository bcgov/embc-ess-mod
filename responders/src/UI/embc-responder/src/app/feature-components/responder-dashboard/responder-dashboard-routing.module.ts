import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResponderDashboardComponent } from './responder-dashboard.component';

const routes: Routes = [{ path: '', component: ResponderDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponderDashboardRoutingModule {}
