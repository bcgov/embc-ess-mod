import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'current',
        pathMatch: 'full'
      },
      {
        path: 'current',
        loadChildren: () =>
          import(
            'src/app/sharedModules/components/evacuation-file/evacuation-file-list/evacuation-file-list.module'
          ).then((m) => m.EvacuationFileListModule),
        data: { flow: 'verified-registration' }
      },
      {
        path: 'past',
        loadChildren: () =>
          import(
            'src/app/sharedModules/components/evacuation-file/evacuation-file-list/evacuation-file-list.module'
          ).then((m) => m.EvacuationFileListModule),
        data: { flow: 'verified-registration' }
      },
      {
        path: 'profile',
        loadChildren: () =>
          import(
            'src/app/sharedModules/components/evacuation-file/profile/profile.module'
          ).then((m) => m.ProfileModule),
        data: { flow: 'verified-registration' }
      },
      {
        path: 'current/:essFile',
        loadChildren: () =>
          import(
            'src/app/sharedModules/components/evacuation-file/evacuation-details/evacuation-details.module'
          ).then((m) => m.EvacuationDetailsModule),
        data: { flow: 'verified-registration' }
      },
      {
        path: 'past/:essFile',
        loadChildren: () =>
          import(
            'src/app/sharedModules/components/evacuation-file/evacuation-details/evacuation-details.module'
          ).then((m) => m.EvacuationDetailsModule),
        data: { flow: 'verified-registration' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
