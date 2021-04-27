import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'member-list',
    pathMatch: 'full'
  },
  {
    path: 'member-list',
    loadChildren: () =>
      import('../team-list/team-list.module').then((m) => m.TeamListModule)
  },
  {
    path: 'member-details',
    loadChildren: () =>
      import('../team-member-detail/team-member-detail.module').then(
        (m) => m.TeamMemberDetailModule
      )
  },
  {
    path: 'edit',
    loadChildren: () =>
      import('../edit-team-member/edit-team-member.module').then(
        (m) => m.EditTeamMemberModule
      )
  },
  {
    path: 'review',
    loadChildren: () =>
      import('../team-member-review/team-member-review.module').then(
        (m) => m.TeamMemberReviewModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamListWrapperRoutingModule {}
