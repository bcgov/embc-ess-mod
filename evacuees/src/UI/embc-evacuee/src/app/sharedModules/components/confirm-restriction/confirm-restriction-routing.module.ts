import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmRestrictionComponent } from './confirm-restriction.component';

const routes: Routes = [{ path: '', component: ConfirmRestrictionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmRestrictionRoutingModule {}
