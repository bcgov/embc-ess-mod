import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCommunityComponent } from './add-community.component';

const routes: Routes = [{ path: '', component: AddCommunityComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCommunityRoutingModule {}
