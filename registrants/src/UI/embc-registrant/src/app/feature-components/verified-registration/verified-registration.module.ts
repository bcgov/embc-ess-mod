import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifiedRegistrationRoutingModule } from './verified-registration-routing.module';
import { VerifiedRegistrationComponent } from './verified-registration.component';

@NgModule({
  imports: [CommonModule, VerifiedRegistrationRoutingModule, VerifiedRegistrationComponent]
})
export class VerifiedRegistrationModule {}
