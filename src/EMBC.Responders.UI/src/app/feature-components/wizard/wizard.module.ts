import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WizardRoutingModule } from './wizard-routing.module';
import { WizardComponent } from './wizard.component';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [WizardComponent],
  imports: [
    CommonModule,
    CoreModule,
    WizardRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class WizardModule {}
