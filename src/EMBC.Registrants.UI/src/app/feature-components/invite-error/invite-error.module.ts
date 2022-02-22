import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InviteErrorRoutingModule } from './invite-error-routing.module';
import { InviteErrorComponent } from './invite-error.component';

@NgModule({
  declarations: [InviteErrorComponent],
  imports: [CommonModule, InviteErrorRoutingModule]
})
export class InviteErrorModule {}
