import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunityListComponent } from './community-list.component';

const routes: Routes = [
  { path: '', component: CommunityListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityListRoutingModule { }
