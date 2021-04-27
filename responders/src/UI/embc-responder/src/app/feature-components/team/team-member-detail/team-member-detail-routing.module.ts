import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamMemberDetailComponent } from './team-member-detail.component';

const routes: Routes = [{ path: '', component: TeamMemberDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamMemberDetailRoutingModule {}
