import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditCommunityComponent } from './add-edit-community.component';

const routes: Routes = [
  { path: '', component: AddEditCommunityComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditCommunityRoutingModule { }
