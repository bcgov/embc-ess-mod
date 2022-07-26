import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvacueeIdVerifyComponent } from './evacuee-id-verify.component';

const routes: Routes = [{ path: '', component: EvacueeIdVerifyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvacueeIdVerifyRoutingModule {}
