import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonVerifiedRegistrationComponent } from './non-verified-registration.component';
import { NonVerifiedRegistrationRoutingModule } from './non-verified-registration-routing.module';
import { CanDeactivateGuardService } from '../core/services/disableBackGuard.service';

@NgModule({
  declarations: [
    NonVerifiedRegistrationComponent
  ],
  imports: [
    CommonModule,
    NonVerifiedRegistrationRoutingModule
  ],
  providers: [CanDeactivateGuardService]
})
export class NonVerifiedRegistrationModule { }
