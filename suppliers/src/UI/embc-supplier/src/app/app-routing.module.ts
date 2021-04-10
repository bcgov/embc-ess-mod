import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigGuard } from './service/config.guard';
import { ReviewGuard } from './service/review.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ConfigGuard],
    children: [
      {
        path: '',
        redirectTo: '/submission',
        pathMatch: 'full',
      },
      {
        path: 'maintenance',
        loadChildren: () => import('./maintenance/maintenance.module').then(m => m.MaintenanceModule)
      },
      {
        path: 'submission',
        loadChildren: () => import('./supplierSubmission/supplierSubmission.module').then(m => m.SupplierSubmissionModule)
      },
      {
        path: 'review',
        canActivate: [ReviewGuard],
        loadChildren: () => import('./review/review.module').then(m => m.ReviewModule)
      },
      {
        path: 'thankyou',
        loadChildren: () => import('./reference/reference.module').then(m => m.ReferenceModule)
      },
      {
        path: '**',
        redirectTo: '/submission',
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
