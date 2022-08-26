import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoicesComponent } from './invoices/invoices.component';
import { SuppliersComponent } from './suppliers/suppliers.component';

const routes: Routes = [
  {
    path: 'invoices',
    component: InvoicesComponent
  },
  {
    path: 'suppliers',
    component: SuppliersComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
