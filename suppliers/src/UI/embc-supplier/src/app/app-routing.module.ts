import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/submission',
    pathMatch: 'full'
  },
  {
    path: 'submission',
    loadChildren: () => import('./supplierSubmission/supplierSubmission.module').then(m => m.SupplierSubmissionModule)
  },
  {
    path: 'review',
    loadChildren: () => import('./review/review.module').then(m => m.ReviewModule)
  },
  {
    path: 'thankyou',
    loadChildren: () => import('./reference/reference.module').then(m => m.ReferenceModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
