import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonVerifiedRegistrationComponent } from './non-verified-registration.component';
import { NonVerifiedRegistrationRoutingModule } from './non-verified-registration-routing.module';

@NgModule({
  imports: [CommonModule, NonVerifiedRegistrationRoutingModule, NonVerifiedRegistrationComponent]
})
export class NonVerifiedRegistrationModule {}
