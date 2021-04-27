import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditUserProfileComponent } from './edit-user-profile.component';

const routes: Routes = [{ path: '', component: EditUserProfileComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditUserProfileRoutingModule {}
