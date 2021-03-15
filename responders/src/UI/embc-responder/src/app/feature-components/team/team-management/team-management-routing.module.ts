import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamManagementComponent } from './team-management.component';

const routes: Routes = [
  {
    path: '', component: TeamManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full'
      },
      {
        path: 'details',
        loadChildren: () => import('../team-list-wrapper/team-list-wrapper.module').then(m => m.TeamListWrapperModule)
      },
      {
        path: 'add',
        loadChildren: () => import('../add-team-member/add-team-member.module').then(m => m.AddTeamMemberModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamManagementRoutingModule { }
