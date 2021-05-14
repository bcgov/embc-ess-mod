import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WizardRoutingModule } from './wizard-routing.module';
import { WizardComponent } from './wizard.component';
import { MaterialModule } from 'src/app/material.module';

@NgModule({
  declarations: [WizardComponent],
  imports: [CommonModule, WizardRoutingModule, MaterialModule]
})
export class WizardModule {}
