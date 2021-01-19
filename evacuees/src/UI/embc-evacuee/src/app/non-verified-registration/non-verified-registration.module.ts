import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonVerifiedRegistrationComponent } from './non-verified-registration.component';
import { NonVerifiedRegistrationRoutingModule } from './non-verified-registration-routing.module';
import { SubmitFileCanDeactivateGuardService } from '../core/services/routeGuards.service';

@NgModule({
  declarations: [
    NonVerifiedRegistrationComponent
  ],
  imports: [
    CommonModule,
    NonVerifiedRegistrationRoutingModule
  ],
  providers: [SubmitFileCanDeactivateGuardService]
})
export class NonVerifiedRegistrationModule { }
