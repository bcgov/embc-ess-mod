import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponderAccessRoutingModule } from './responder-access-routing.module';
import { ResponderAccessComponent } from './responder-access.component';

import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  imports: [CommonModule, ResponderAccessRoutingModule, MatSidenavModule, ResponderAccessComponent]
})
export class ResponderAccessModule {}
