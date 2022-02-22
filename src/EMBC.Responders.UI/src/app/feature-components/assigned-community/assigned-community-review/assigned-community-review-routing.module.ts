import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignedCommunityReviewComponent } from './assigned-community-review.component';

const routes: Routes = [
  { path: '', component: AssignedCommunityReviewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignedCommunityReviewRoutingModule {}
