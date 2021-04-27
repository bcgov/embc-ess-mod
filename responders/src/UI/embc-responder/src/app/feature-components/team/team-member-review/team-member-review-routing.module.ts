import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamMemberReviewComponent } from './team-member-review.component';

const routes: Routes = [{ path: '', component: TeamMemberReviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamMemberReviewRoutingModule {}
