import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAuthProfileComponent } from './dashboard.component';

const routes: Routes = [
  { path: '', component: ViewAuthProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewAuthProfileRoutingModule { }
