import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponderAccessRoutingModule } from './responder-access-routing.module';
import { ResponderAccessComponent } from './responder-access.component';
import { CoreModule } from '../../core/core.module';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    ResponderAccessComponent
  ],
  imports: [
    CommonModule,
    ResponderAccessRoutingModule,
    CoreModule,
    MatSidenavModule
  ]
})
export class ResponderAccessModule { }
