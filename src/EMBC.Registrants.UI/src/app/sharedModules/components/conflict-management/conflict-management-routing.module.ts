import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConflictManagementComponent } from './conflict-management.component';

const routes: Routes = [{ path: '', component: ConflictManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConflictManagementRoutingModule {}
