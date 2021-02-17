import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponderManagementRoutingModule } from './responder-management-routing.module';
import { ResponderManagementComponent } from './responder-management.component';

@NgModule({
  declarations: [
    ResponderManagementComponent
  ],
  imports: [
    CommonModule,
    ResponderManagementRoutingModule
  ]
})
export class ResponderManagementModule { }
