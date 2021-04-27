import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewUserProfileComponent } from './view-user-profile.component';

const routes: Routes = [{ path: '', component: ViewUserProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewUserProfileRoutingModule {}
