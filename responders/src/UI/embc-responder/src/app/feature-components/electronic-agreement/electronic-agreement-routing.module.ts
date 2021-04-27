import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ElectronicAgreementComponent } from './electronic-agreement.component';

const routes: Routes = [{ path: '', component: ElectronicAgreementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElectronicAgreementRoutingModule {}
