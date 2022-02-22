import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EssfileDashboardComponent } from './essfile-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: EssfileDashboardComponent,
    children: [
      {
        path: 'overview',
        loadChildren: () =>
          import('./ess-file-overview/ess-file-overview.module').then(
            (m) => m.EssFileOverviewModule
          )
      },
      {
        path: 'details',
        loadChildren: () =>
          import('./ess-file-details/ess-file-details.module').then(
            (m) => m.EssFileDetailsModule
          )
      },
      {
        path: 'supports',
        loadChildren: () =>
          import('./ess-file-supports/ess-file-supports.module').then(
            (m) => m.EssFileSupportsModule
          )
      },
      {
        path: 'notes',
        loadChildren: () =>
          import('./ess-file-notes/ess-file-notes.module').then(
            (m) => m.EssFileNotesModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EssfileDashboardRoutingModule {}
