import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EssfileDashboardComponent } from './essfile-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: EssfileDashboardComponent,
    children: [
      // {
      //   path: '',
      //   redirectTo: 'overview',
      //   pathMatch: 'full'
      // },
      {
        path: 'overview',
        loadChildren: () =>
          import('./ess-file-overview/ess-file-overview.module').then(
            (m) => m.EssFileOverviewModule
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
