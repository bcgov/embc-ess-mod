import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignedCommunityListComponent } from './assigned-community-list.component';

const routes: Routes = [
  { path: '', component: AssignedCommunityListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignedCommunityListRoutingModule {}
