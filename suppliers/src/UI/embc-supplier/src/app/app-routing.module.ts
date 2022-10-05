import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { ConfigGuard } from './core/guards/config.guard';
import { DevGuard } from './core/guards/dev.guard';
import { ReviewGuard } from './core/guards/review.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [ConfigGuard],
    children: [
      {
        path: '',
        redirectTo: '/submission',
        pathMatch: 'full'
      },
      {
        path: 'auth',
        canActivate: [AuthGuard, DevGuard],
        loadChildren: () =>
          import('./supplier-auth/supplier-auth.module').then(
            (m) => m.SupplierAuthModule
          )
      },
      {
        path: 'public',
        canActivate: [DevGuard],
        loadChildren: () =>
          import('./supplier-public/supplier-public.module').then(
            (m) => m.SupplierPublicModule
          )
      },
      {
        path: 'submission',
        loadChildren: () =>
          import('./fire-and-forget/submission/submission.module').then(
            (m) => m.SubmissionModule
          )
      },
      {
        path: 'review',
        canActivate: [ReviewGuard],
        loadChildren: () =>
          import('./fire-and-forget/review/review.module').then(
            (m) => m.ReviewModule
          )
      },
      {
        path: 'thankyou',
        loadChildren: () =>
          import('./fire-and-forget/reference/reference.module').then(
            (m) => m.ReferenceModule
          )
      },
      {
        path: 'maintenance',
        loadChildren: () =>
          import('./maintenance/maintenance.module').then(
            (m) => m.MaintenanceModule
          )
      },
      {
        path: 'error',
        loadChildren: () =>
          import('./error/error.module').then((m) => m.ErrorModule)
      },
      {
        path: '**',
        redirectTo: '/submission',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
