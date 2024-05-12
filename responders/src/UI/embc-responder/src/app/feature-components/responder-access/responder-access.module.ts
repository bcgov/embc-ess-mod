import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponderAccessRoutingModule } from './responder-access-routing.module';
import { ResponderAccessComponent } from './responder-access.component';
import { SharedModule } from '../../shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
    imports: [CommonModule, ResponderAccessRoutingModule, SharedModule, MatSidenavModule, ResponderAccessComponent]
})
export class ResponderAccessModule {}
