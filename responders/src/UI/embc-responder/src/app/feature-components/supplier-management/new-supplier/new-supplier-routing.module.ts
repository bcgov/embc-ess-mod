import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewSupplierComponent } from './new-supplier.component';

const routes: Routes = [{ path: '', component: NewSupplierComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewSupplierRoutingModule {}
