import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResponderAccessComponent } from './responder-access.component';

const routes: Routes = [
  {
    path: '', component: ResponderAccessComponent,
    children: [
      {
        path: '',
        redirectTo: 'responder-dashboard',
        pathMatch: 'full',
      },
      {
        path: 'responder-dashboard',
        loadChildren: () => import('../responder-dashboard/responder-dashboard.module').then(m => m.ResponderDashboardModule)
      },
      {
        path: 'evacuee-search',
        loadChildren: () => import('../evacuee-search/evacuee-search.module').then(m => m.EvacueeSearchModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponderAccessRoutingModule { }
