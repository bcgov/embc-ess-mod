import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonVerifiedRegistrationComponent } from './non-verified-registration.component';
import { NonVerifiedRegistrationRoutingModule } from './non-verified-registration-routing.module';

@NgModule({
  declarations: [NonVerifiedRegistrationComponent],
  imports: [CommonModule, NonVerifiedRegistrationRoutingModule]
})
export class NonVerifiedRegistrationModule {}
