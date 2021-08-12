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
        redirectTo: 'suppliers-list',
        pathMatch: 'full'
      },
      {
        path: 'suppliers-list',
        loadChildren: () =>
          import('./suppliers-list/suppliers-list.module').then(
            (m) => m.SuppliersListModule
          ),
        data: { title: 'Supplier Management' }
      },
      {
        path: 'add-supplier',
        loadChildren: () =>
          import(
            '../supplier-management/add-supplier/add-supplier.module'
          ).then((m) => m.AddSupplierModule),
        data: { title: 'Add Supplier' }
      },
      {
        path: 'new-supplier',
        loadChildren: () =>
          import(
            '../supplier-management/new-supplier/new-supplier.module'
          ).then((m) => m.NewSupplierModule)
      },
      {
        path: 'review-supplier',
        loadChildren: () =>
          import(
            '../supplier-management/supplier-review/supplier-review.module'
          ).then((m) => m.SupplierReviewModule)
      },
      {
        path: 'supplier-detail',
        loadChildren: () =>
          import(
            '../supplier-management/supplier-detail/supplier-detail.module'
          ).then((m) => m.SupplierDetailModule),
        data: { title: 'View Supplier' }
      },
      {
        path: 'edit-supplier',
        loadChildren: () =>
          import(
            '../supplier-management/edit-supplier/edit-supplier.module'
          ).then((m) => m.EditSupplierModule),
        data: { title: 'Edit Supplier Details' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierManagementRoutingModule {}
