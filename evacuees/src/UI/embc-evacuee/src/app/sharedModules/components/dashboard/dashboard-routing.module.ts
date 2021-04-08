import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'current',
        pathMatch: 'full'
      },
      {
        path: 'current',
        loadChildren: () => import('src/app/sharedModules/components/evacuation-file/evacuation-file-list/evacuation-file-list.module')
          .then(m => m.EvacuationFileListModule)
      },
      {
        path: 'past',
        loadChildren: () => import('src/app/sharedModules/components/evacuation-file/evacuation-file-list/evacuation-file-list.module')
          .then(m => m.EvacuationFileListModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('src/app/sharedModules/components/evacuation-file/profile/profile.module')
          .then(m => m.ProfileModule)
      },
      {
        path: 'current/:essFile',
        loadChildren: () => import('src/app/sharedModules/components/evacuation-file/evacuation-details/evacuation-details.module')
          .then(m => m.EvacuationDetailsModule)
      },
      {
        path: 'past/:essFile',
        loadChildren: () => import('src/app/sharedModules/components/evacuation-file/evacuation-details/evacuation-details.module')
          .then(m => m.EvacuationDetailsModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
