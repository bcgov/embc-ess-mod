import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResponderAccessComponent } from './responder-access.component';

const routes: Routes = [
  {
    path: '',
    component: ResponderAccessComponent,
    children: [
      {
        path: '',
        redirectTo: 'responder-dashboard',
        pathMatch: 'full'
      },
      {
        path: 'responder-dashboard',
        loadChildren: () =>
          import('../responder-dashboard/responder-dashboard.module').then(
            (m) => m.ResponderDashboardModule
          )
      },
      {
        path: 'search',
        loadChildren: () =>
          import(
            '../search/search-registration/search-registration.module'
          ).then((m) => m.SearchRegistrationModule)
      },
      {
        path: 'user-profile',
        loadChildren: () =>
          import('../user-profile/user-profile/user-profile.module').then(
            (m) => m.UserProfileModule
          )
      },
      {
        path: 'community-management',
        loadChildren: () =>
          import(
            '../assigned-community/assigned-community-management/assigned-community-management.module'
          ).then((m) => m.AssignedCommunityManagementModule)
      },
      {
        path: 'responder-management',
        loadChildren: () =>
          import(
            '../team/team-member-management/team-member-management.module'
          ).then((m) => m.TeamMemberManagementModule)
      },
      {
        path: 'supplier-management',
        loadChildren: () =>
          import('../supplier-management/supplier-management.module').then(
            (m) => m.SupplierManagementModule
          )
      },
      {
        path: 'reporting',
        loadChildren: () =>
          import('../reporting/reporting.module').then((m) => m.ReportingModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponderAccessRoutingModule {}
