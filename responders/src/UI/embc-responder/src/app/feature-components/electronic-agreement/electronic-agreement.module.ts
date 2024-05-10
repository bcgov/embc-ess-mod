import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElectronicAgreementRoutingModule } from './electronic-agreement-routing.module';
import { ElectronicAgreementComponent } from './electronic-agreement.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';

@NgModule({
  declarations: [ElectronicAgreementComponent],
  imports: [CommonModule, ElectronicAgreementRoutingModule, MatCardModule, MatButtonModule, MatCheckboxModule]
})
export class ElectronicAgreementModule {}
