import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignedCommunityManagementComponent } from './assigned-community-management.component';

const routes: Routes = [
  {
    path: '', component: AssignedCommunityManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadChildren: () => import('../assigned-community-list/assigned-community-list.module').then(m => m.AssignedCommunityListModule)
      },
      {
        path: 'add',
        loadChildren: () => import('../add-community/add-community.module').then(m => m.AddCommunityModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignedCommunityManagementRoutingModule { }
