import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupportDeliveryComponent } from './support-delivery.component';

const routes: Routes = [{ path: '', component: SupportDeliveryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportDeliveryRoutingModule {}
