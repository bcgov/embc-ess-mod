import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EssfileDashboardComponent } from './essfile-dashboard.component';

const routes: Routes = [{ path: '', component: EssfileDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EssfileDashboardRoutingModule {}
