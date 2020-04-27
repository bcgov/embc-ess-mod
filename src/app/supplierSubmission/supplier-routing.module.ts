import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierSubmissionComponent } from './supplierSubmission.component';


const routes: Routes = [
    {path: '', component: SupplierSubmissionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
