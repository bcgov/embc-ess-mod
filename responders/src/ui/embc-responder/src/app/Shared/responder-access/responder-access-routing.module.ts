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
        path: 'search',
        loadChildren: () => import('../search-registartion/search-registartion.module').then(m => m.SearchRegistartionModule)
      },
      {
        path: 'user-profile',
        loadChildren: () => import('../user-profile/user-profile.module').then(m => m.UserProfileModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponderAccessRoutingModule { }
