import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestrictionComponent } from './restriction.component';

const routes: Routes = [{ path: '', component: RestrictionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestrictionRoutingModule {}
