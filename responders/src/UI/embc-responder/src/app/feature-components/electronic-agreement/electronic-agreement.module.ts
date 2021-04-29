import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElectronicAgreementRoutingModule } from './electronic-agreement-routing.module';
import { ElectronicAgreementComponent } from './electronic-agreement.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [ElectronicAgreementComponent],
  imports: [
    CommonModule,
    ElectronicAgreementRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule
  ]
})
export class ElectronicAgreementModule {}
