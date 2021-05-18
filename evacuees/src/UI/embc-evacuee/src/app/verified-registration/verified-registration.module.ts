import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerifiedRegistrationRoutingModule } from './verified-registration-routing.module';
import { VerifiedRegistrationComponent } from './verified-registration.component';

@NgModule({
  declarations: [VerifiedRegistrationComponent],
  imports: [CommonModule, VerifiedRegistrationRoutingModule]
})
export class VerifiedRegistrationModule {}
