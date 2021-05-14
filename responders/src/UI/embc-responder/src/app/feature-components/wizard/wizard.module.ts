import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WizardRoutingModule } from './wizard-routing.module';
import { WizardComponent } from './wizard.component';
import { MaterialModule } from 'src/app/material.module';
import { HouseholdMembersComponent } from './ess-file-components/household-members/household-members.component';

@NgModule({
  declarations: [WizardComponent, HouseholdMembersComponent],
  imports: [CommonModule, WizardRoutingModule, MaterialModule]
})
export class WizardModule {}
