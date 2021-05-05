import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectedProfileComponent } from './selected-profile.component';

const routes: Routes = [{ path: '', component: SelectedProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectedProfileRoutingModule {}
