import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TeamManagementComponent } from './team-management.component';

const routes: Routes = [
  {
    path: '', component: TeamManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadChildren: () => import('../team-list/team-list.module').then(m => m.TeamListModule)
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
