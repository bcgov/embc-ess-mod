import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WizardRoutingModule } from './wizard-routing.module';
import { WizardComponent } from './wizard.component';

import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  imports: [CommonModule, CoreModule, WizardRoutingModule, WizardComponent]
})
export class WizardModule {}
