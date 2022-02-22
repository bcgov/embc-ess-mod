import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamMemberManagementComponent } from './team-member-management.component';

const routes: Routes = [
  {
    path: '',
    component: TeamMemberManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full'
      },
      {
        path: 'details',
        loadChildren: () =>
          import('../team-list-wrapper/team-list-wrapper.module').then(
            (m) => m.TeamListWrapperModule
          )
      },
      {
        path: 'add-member',
        loadChildren: () =>
          import('../add-team-member/add-team-member.module').then(
            (m) => m.AddTeamMemberModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamMemberManagementRoutingModule {}
