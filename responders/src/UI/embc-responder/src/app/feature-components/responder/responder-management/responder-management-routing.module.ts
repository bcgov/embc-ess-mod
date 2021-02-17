import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResponderManagementComponent } from './responder-management.component';

const routes: Routes = [
  {
    path: '', component: ResponderManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponderManagementRoutingModule { }
