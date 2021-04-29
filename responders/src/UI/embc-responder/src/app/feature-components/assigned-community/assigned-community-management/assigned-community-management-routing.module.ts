import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignedCommunityManagementComponent } from './assigned-community-management.component';

const routes: Routes = [
  {
    path: '',
    component: AssignedCommunityManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'list-communities',
        pathMatch: 'full'
      },
      {
        path: 'list-communities',
        loadChildren: () =>
          import(
            '../assigned-community-list/assigned-community-list.module'
          ).then((m) => m.AssignedCommunityListModule)
      },
      {
        path: 'add-communities',
        loadChildren: () =>
          import('../add-community/add-community.module').then(
            (m) => m.AddCommunityModule
          )
      },
      {
        path: 'review',
        loadChildren: () =>
          import(
            '../assigned-community-review/assigned-community-review.module'
          ).then((m) => m.AssignedCommunityReviewModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignedCommunityManagementRoutingModule {}
