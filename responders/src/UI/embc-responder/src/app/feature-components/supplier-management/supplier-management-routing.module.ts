import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierManagementComponent } from './supplier-management.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'list-suppliers',
        pathMatch: 'full'
      },
      {
        path: 'list-suppliers',
        loadChildren: () =>
          import(
            '../supplier-management/list-suppliers/list-suppliers.module'
          ).then((m) => m.ListSuppliersModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierManagementRoutingModule {}
