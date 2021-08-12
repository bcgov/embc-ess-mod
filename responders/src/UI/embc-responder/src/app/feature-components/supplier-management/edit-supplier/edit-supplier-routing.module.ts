import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditSupplierComponent } from './edit-supplier.component';

const routes: Routes = [{ path: '', component: EditSupplierComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditSupplierRoutingModule {}
