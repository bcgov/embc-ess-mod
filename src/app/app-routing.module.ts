import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/supplier',
    pathMatch: 'full'
  },
  {
    path: 'supplier',
    loadChildren: () => import('./supplierSubmission/supplierSubmission.module').then(m => m.SupplierSubmissionModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
