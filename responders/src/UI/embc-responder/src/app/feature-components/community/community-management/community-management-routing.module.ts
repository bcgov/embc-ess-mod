import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunityManagementComponent } from './community-management.component';

const routes: Routes = [
  {
    path: '', component: CommunityManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        loadChildren: () => import('../community-list/community-list.module').then(m => m.CommunityListModule)
      },
      {
        path: 'add-edit',
        loadChildren: () => import('../add-edit-community/add-edit-community.module').then(m => m.AddEditCommunityModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityManagementRoutingModule { }
