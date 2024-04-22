import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InviteErrorRoutingModule } from './invite-error-routing.module';
import { InviteErrorComponent } from './invite-error.component';

@NgModule({
  imports: [CommonModule, InviteErrorRoutingModule, InviteErrorComponent]
})
export class InviteErrorModule {}
